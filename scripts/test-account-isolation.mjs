import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('Dashboard sidebar, legacy bookmark, and direct navigation resolve to home',()=>{
  const routes=vm.createContext({location:{hash:'#dashboard'},state:{page:'trips',stack:[]},history:{pushState(){}},render(){},window:{scrollTo(){}}});
  for(const name of ['routeKey','currentHash','go'])vm.runInContext(html.match(new RegExp('^function '+name+'\\([^\\n]+','m'))[0],routes);
  assert.equal(routes.routeKey('Dashboard'),'home');assert.equal(routes.currentHash(),'home');
  routes.go('dashboard');assert.equal(routes.state.page,'home');
  routes.location.hash='#maps';assert.equal(routes.currentHash(),'maps');
});
const storage=html.match(/<script id="fishos-account-storage">([\s\S]*?)<\/script>/)[1];
const dataCode=html.slice(html.indexOf('  // Account transition and hydration'),html.indexOf('  window.persistData=function()',html.indexOf('  // Account transition and hydration')));
const authCode=html.slice(html.indexOf('  let privateAuthSubscription='),html.indexOf('  // V24:',html.indexOf('  let privateAuthSubscription=')));
function harness(existing=new Map()){
  const elements=new Map(['searchResults','modal','fishAIHistory','search'].map(k=>[k,{innerHTML:'private text',value:'private query',classList:{remove(){}}}]));
  const timers=new Map();let next=1,reloads=0,callback;
  const ctx=vm.createContext({console,Map,JSON,encodeURIComponent,
    localStorage:{getItem:k=>existing.get(k)??null,setItem:(k,v)=>existing.set(k,v),removeItem:k=>existing.delete(k)},
    document:{getElementById:k=>elements.get(k)},location:{reload(){reloads++}},
    setTimeout(fn,ms){const id=next++;timers.set(id,{fn,ms});return id},clearTimeout:id=>timers.delete(id),
    state:{supabase:{url:'https://project-a.supabase.co',key:'public'},profile:{},privateHydrated:false},
    DATA:{trips:[],knots:['public knot']},PUBLIC_DATA_BASELINE:{trips:[],knots:['public knot']},render(){},topAuth(){},
    privatePayload(){return JSON.parse(JSON.stringify(ctx.DATA))},
    applyPrivate(d){Object.assign(ctx.DATA,d);vm.runInContext("fishStorage.setItem('fishos_data',JSON.stringify(DATA))",ctx)}
  });ctx.window=ctx;
  vm.runInContext(storage+dataCode+authCode,ctx);
  return {ctx,existing,elements,timers,run:s=>vm.runInContext(s,ctx),get reloads(){return reloads},
    auth(){ctx.supabase={};ctx.supabaseClient={auth:{onAuthStateChange(fn){callback=fn;return {data:{subscription:{unsubscribe(){}}}}}}};return()=>callback},
    flush(){for(const [id,t]of [...timers])if(t.ms<1000){timers.delete(id);t.fn()}}
  };
}
function clientWithRead(h,read){const writes=[];h.ctx.supabaseClient={from:()=>({select:()=>({eq:()=>({maybeSingle:()=>read})}),upsert:async value=>{writes.push(value);return {error:null}}})};return writes}

test('legacy values stay unclaimed; guest drafts never enter an account; project and user namespaces differ',()=>{
  const disk=new Map([['fishos_data','LEGACY'],['fishos_supabase','PUBLIC SETTINGS']]);const h=harness(disk);
  assert.equal(h.run("fishStorage.getItem('fishos_data')"),null);
  assert.equal(h.run("fishStorage.getItem('fishos_supabase')"),'PUBLIC SETTINGS');
  h.run("fishStorage.setItem('fishos_data','GUEST');selectPrivateAccount({id:'A'});");
  assert.equal(h.run("fishStorage.getItem('fishos_data')"),null);
  h.run("fishStorage.setItem('fishos_data','ACCOUNT A');selectPrivateAccount({id:'B'});");
  assert.equal(h.run("fishStorage.getItem('fishos_data')"),null);
  h.run("fishStorage.setItem('fishos_data','ACCOUNT B');selectPrivateAccount({id:'A'});");
  assert.equal(h.run("fishStorage.getItem('fishos_data')"),'ACCOUNT A');
  h.run("state.supabase.url='https://project-b.supabase.co';selectPrivateAccount({id:'A'});");
  assert.equal(h.run("fishStorage.getItem('fishos_data')"),null);
  assert.equal(disk.get('fishos_data'),'LEGACY');
});

test('logout clears active private data, search and pending debounce, then reloads',()=>{
  const h=harness();h.run("selectPrivateAccount({id:'A',email:'a@example.test'});DATA.trips=[{id:'PRIVATE A'}];state.privateHydrated=true;");
  clientWithRead(h,Promise.resolve({data:null}));h.ctx.syncCloudDebounced();
  assert.equal(h.timers.size,1);
  h.run('selectPrivateAccount(null)');
  assert.equal(h.ctx.DATA.trips.length,0);assert.equal(h.ctx.state.profile.email,'');
  assert.equal(h.ctx.state.fishCaught.length,0);assert.equal(h.elements.get('searchResults').innerHTML,'');
  assert.equal(h.timers.size,0);assert.equal(h.reloads,1);
});

test('late hydration from A cannot populate B or the signed-out view',async()=>{
  for(const nextUser of ["{id:'B'}",'null']){
    const h=harness();let resolve;const read=new Promise(r=>resolve=r);
    h.run("selectPrivateAccount({id:'A'})");clientWithRead(h,read);
    const pending=h.ctx.hydratePrivateData();h.run('selectPrivateAccount('+nextUser+')');
    resolve({data:{data:{trips:[{id:'PRIVATE A'}]}}});
    assert.equal(await pending,false);assert.equal(h.ctx.DATA.trips.length,0);
  }
});

test('cloud empty collections remain empty despite same-account old cache; hydration never writes',async()=>{
  const h=harness();h.run("selectPrivateAccount({id:'A'});fishStorage.setItem('fishos_data',JSON.stringify({trips:[{id:'OLD'}]}));");
  const writes=clientWithRead(h,Promise.resolve({data:{data:{trips:[]}}}));
  assert.equal(await h.ctx.hydratePrivateData(),true);
  assert.equal(h.ctx.DATA.trips.length,0);assert.equal(writes.length,0);
  assert.equal(h.ctx.state.privateHydrated,true);
});

test('missing cloud row does not upload legacy/guest data; failed hydration blocks saving',async()=>{
  const h=harness(new Map([['fishos_data','{"trips":[{"id":"LEGACY"}]}']]));
  h.run("selectPrivateAccount({id:'A'})");const writes=clientWithRead(h,Promise.resolve({data:null}));
  await h.ctx.hydratePrivateData();assert.equal(writes.length,0);assert.equal(h.ctx.DATA.trips.length,0);
  clientWithRead(h,Promise.resolve({error:{message:'offline'}}));
  assert.equal(await h.ctx.hydratePrivateData(),false);assert.equal(await h.ctx.syncCloud(),false);
});

test('save payload belongs to initiating account and late completion cannot update B status',async()=>{
  const h=harness();h.run("selectPrivateAccount({id:'A'});state.privateHydrated=true;DATA.trips=[{id:'A trip'}]");
  let resolve,captured;
  h.ctx.supabaseClient={from:()=>({upsert:value=>{captured=value;return new Promise(r=>resolve=r)}})};
  const save=h.ctx.syncCloud();h.run("selectPrivateAccount({id:'B'});state.cloudStatus='B status'");
  resolve({error:null});assert.equal(await save,false);assert.equal(captured.user_id,'A');
  assert.equal(captured.data.trips[0].id,'A trip');assert.equal(h.ctx.state.cloudStatus,'B status');
});

test('auth INITIAL_SESSION selects account; token refresh does not reset hydrated state; signout resets',async()=>{
  const h=harness();const callback=h.auth();await h.run('initPrivateAuth()');
  callback()('INITIAL_SESSION',{user:{id:'A',email:'a@example.test'}});
  assert.equal(h.ctx.state.profile.userId,'A');assert.ok(h.run('fishStorage.scope').endsWith(':A'));
  h.ctx.state.privateHydrated=true;h.ctx.DATA.trips=[{id:'A trip'}];
  callback()('TOKEN_REFRESHED',{user:{id:'A',email:'a@example.test'}});
  assert.equal(h.ctx.DATA.trips.length,1);
  callback()('SIGNED_OUT',null);assert.equal(h.ctx.DATA.trips.length,0);assert.equal(h.reloads,1);
});

test('all application persistence uses the scoped facade; SDK storage stays native',()=>{
  const withoutFacade=html.replace(/<script id="fishos-account-storage">[\s\S]*?<\/script>/,'');
  assert.equal(withoutFacade.includes('localStorage.'),false);
  assert.match(withoutFacade,/persistSession:true/);
  assert.equal(html.includes('id="fishos-v54-session-restore"'),false);
  for(const m of html.matchAll(/<script src="(assets\/[^\"]+)"/g))assert.equal(readFileSync(new URL('../'+m[1],import.meta.url),'utf8').includes('localStorage.'),false,m[1]);
  const version=html.match(/el.textContent='FISH OS (V\d+(?:\.\d+)?)'/)[1];
  assert.equal(readFileSync(new URL('../Fish_OS_'+version+'.html',import.meta.url),'utf8'),html);
});
