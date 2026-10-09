import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const geo=vm.createContext({});vm.runInContext(fs.readFileSync(new URL('../assets/fishos-geography-v62.js',import.meta.url),'utf8'),geo);
test('geography fills missing fields without overwriting confirmed values or mutating input',()=>{
 const t={id:'Metolius test',country:'Custom country',lat:0,lon:0};const result=geo.fishosGeography62.infer(t);
 assert.equal(result.country,'Custom country');assert.equal(result.state,'Oregon');assert.equal(result.lat,0);assert.equal(result.lon,0);assert.equal(t.state,undefined);
});
test('inferred coordinates are approximate; ambiguous names remain unclaimed',()=>{
 const t=geo.fishosGeography62.infer({place:'La Paz'});assert.equal(t.country,'Mexico');assert.equal(t.state,'Baja California Sur');assert.equal(t.coordinate_accuracy,'approximate');assert.match(t.coordinate_note,/Estimated/);
 const unknown=geo.fishosGeography62.infer({place:'Unknown stream'});assert.equal(unknown.lat,undefined);assert.equal(unknown.country,undefined);
 const partial=geo.fishosGeography62.infer({place:'Metolius',lat:44});assert.equal(partial.lon,undefined);
});
test('separate tying/casting notes survive actual cloud payload and hydration',()=>{
 const ctx=vm.createContext({DATA:{section_notes:[{id:'synthetic',section:'casting-spey',title:'Practice',body:'Sample'}]},state:{},saveLocal(){}});
 for(const name of ['privatePayload','applyPrivate'])vm.runInContext(html.match(new RegExp('^  function '+name+'\\([^\\n]+','m'))[0],ctx);
 const saved=ctx.privatePayload();ctx.DATA.section_notes=[];ctx.applyPrivate(saved);assert.equal(ctx.DATA.section_notes[0].section,'casting-spey');assert.equal(ctx.DATA.section_notes[0].body,'Sample');
 ctx.applyPrivate({});assert.equal(ctx.DATA.section_notes.length,0,'Another account without notes must not inherit old notes');
});
test('dedicated pages escape private notes and preserve pattern knowledge',()=>{
 const ctx=vm.createContext({DATA:{section_notes:[{section:'tying-knowledge',id:'1',title:'<unsafe>',body:'<script>bad</script>'}],flies:[{name:'Example',notes:'Recipe'}]},state:{},setTimeout(){},document:{addEventListener(){}},crypto:{randomUUID:()=> 'test'},URL:{},shell:(t,s,b)=>b});ctx.window=ctx;ctx.render=()=>{};ctx.side=()=>{};
 let code=fs.readFileSync(new URL('../assets/fishos-collections-v62.js',import.meta.url),'utf8');code=code.replace(/\}\)\(\);\s*$/,'window.test62={notesPage,photosPage,sections};})();');vm.runInContext(code,ctx);
 const rendered=ctx.test62.notesPage('tying-knowledge');assert.match(rendered,/&lt;unsafe&gt;/);assert.doesNotMatch(rendered,/<script>/);assert.match(rendered,/Recipe/);
 for(const route of ['casting-drills','casting-spey','casting-saltwater'])assert.ok(ctx.test62.sections[route]);assert.match(ctx.test62.photosPage(),/UPLOAD FLY PHOTOS/);
});
test('private research fetch uses captured owner and pages through all results',()=>{
 const code=fs.readFileSync(new URL('../assets/fishos-research-bridge-v62.js',import.meta.url),'utf8');
 assert.match(code,/async function fetchResearch[\s\S]*const c=window.supabaseClient,uid=state.profile.userId/);
 assert.match(code,/\.eq\('user_id',uid\)/);assert.match(code,/state.profile.userId!==uid/);assert.match(code,/\.range\(offset,offset\+199\)/);
});
test('late photo catalog from an old account never enters the new account gallery',async()=>{
 let resolve;const pending=new Promise(r=>resolve=r),grid={isConnected:true,append(){throw Error('Stale photo was rendered')}},status={textContent:'',isConnected:true};
 const query={select(){return this},eq(){return this},order(){return this},range(){return pending}};
 const ctx=vm.createContext({DATA:{},state:{profile:{loggedIn:true,userId:'A'},privateHydrated:true},setTimeout(){},document:{addEventListener(){},getElementById:id=>id==='v62-photo-status'?status:grid},crypto:{},URL:{},shell(){}});ctx.window=ctx;ctx.render=()=>{};ctx.side=()=>{};ctx.supabaseClient={from:()=>query};
 let code=fs.readFileSync(new URL('../assets/fishos-collections-v62.js',import.meta.url),'utf8');code=code.replace(/\}\)\(\);\s*$/,'window.test62={loadPhotos};})();');vm.runInContext(code,ctx);
 const load=ctx.test62.loadPhotos(0);ctx.state.profile.userId='B';resolve({data:[{id:'private-a',mime_type:'image/jpeg'}]});await load;assert.equal(status.textContent,'');
});
