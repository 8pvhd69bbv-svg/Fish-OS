import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const release=html.match(/<script id="fishos-release-v1-074">([\s\S]*?)<\/script>/)?.[1];
const version=html.match(/<script id="fishos-v57-release-chip">[\s\S]*?FISH OS (V[\d.]+)/)?.[1];
const dispatcher=readFileSync(new URL('../assets/fishos-partial-v1-0725.js',import.meta.url),'utf8');
function setup({present=true,readyState='loading'}={}){
  const events=[],timers=[],calls=[];
  let chip=present?{textContent:'old release'}:null;
  let tags=present?[{textContent:'PAGE V1.000 / Home'},{textContent:'unrelated tag'}]:[];
  const main={dataset:{},querySelectorAll:selector=>selector==='.tag'?tags:[]};
  const result={identity:'render return'};
  const c=vm.createContext({state:{page:'home'},DATA:{},side(){},render(...args){calls.push({receiver:this,args});return result},document:{readyState,getElementById:id=>id==='main'?main:id==='fishos-release-global'?chip:null,querySelectorAll:selector=>selector==='#main .tag'?tags:[],addEventListener:(name,fn,options)=>events.push({name,fn,options})},setTimeout:(fn,delay)=>timers.push({fn,delay})});
  c.window=c;
  vm.runInContext(dispatcher,c);
  const render=c.render;
  vm.runInContext(release,c);
  return {c,render,result,calls,events,timers,get chip(){return chip},get tags(){return tags},replace(label='Next'){chip={textContent:'stale'};tags=[{textContent:`PAGE V1.012 / ${label}`},{textContent:'PAGE V1.012 without separator'},{textContent:'Catch V1.012'}]}};
}
function marked(s,label){assert.equal(s.chip.textContent,`FISH OS ${version}`);assert.equal(s.tags[0].textContent,`PAGE ${version} / ${label}`)}

test('one release hook replaces the legacy wrapper without replacing dispatcher',()=>{
  assert.ok(version,'startup chip supplies expected release');
  assert.ok(release);
  assert.doesNotMatch(html,/id="fishos-release-v1-070"/);
  const s=setup();assert.equal(s.c.render,s.render);marked(s,'Home');
  assert.equal(s.timers.length,1);assert.equal(s.timers[0].delay,200);
  assert.equal(s.tags[1].textContent,'unrelated tag');
});
test('normal routes retain render receiver, arguments and return while marking new DOM',()=>{
  const s=setup();const receiver={caller:true},argument={synthetic:true};
  for(const page of ['home','maps','account']){
    s.c.state.page=page;s.replace(page);
    assert.equal(s.c.render.call(receiver,argument,42),s.result);marked(s,page);
    const last=s.calls.at(-1);assert.equal(last.receiver,receiver);assert.deepEqual(last.args,[argument,42]);
    assert.equal(s.tags[1].textContent,'PAGE V1.012 without separator');assert.equal(s.tags[2].textContent,'Catch V1.012');
  }
  assert.equal(s.calls.length,3);
});
test('dispatcher-handled routes bypass legacy render and still mark new chip and PAGE tags',()=>{
  const s=setup();s.c.fishosRender725.register({render(){s.replace('Handled');return true}});
  s.c.state.page='synthetic-handled';assert.equal(s.c.render(),undefined);marked(s,'Handled');assert.equal(s.calls.length,0);
  s.c.render();marked(s,'Handled');assert.equal(s.calls.length,0);
});
test('DOMContentLoaded restores current release after older refinement and marks late DOM',()=>{
  const s=setup({present:false});s.replace('Loaded');
  for(const event of s.events){assert.equal(event.name,'DOMContentLoaded');assert.equal(event.options.once,true);event.fn()}
  marked(s,'Loaded');assert.equal(s.calls.length,0);
});
test('delayed startup marks late or replaced DOM, including after navigation',()=>{
  const s=setup({present:false,readyState:'complete'});assert.doesNotThrow(()=>s.timers[0].fn());
  s.c.state.page='maps';s.replace('Delayed');s.timers[0].fn();marked(s,'Delayed');assert.equal(s.calls.length,0);
});
