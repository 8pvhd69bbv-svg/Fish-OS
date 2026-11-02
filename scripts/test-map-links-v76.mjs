import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const code=readFileSync(new URL('../assets/fishos-map-links-v1-076.js',import.meta.url),'utf8');
function setup({page='maps',mapPresent=true,mainPresent=true}={}) {
  const hooks=[],timers=[],children=[],pins=[{id:'synthetic-pin',lat:45,lon:-122}],map={pins};
  const card={id:'existing-map-card',map,before(node){children.splice(children.indexOf(card),0,node)}};
  if(mapPresent)children.push(card);
  map.closest=selector=>selector==='.card'?card:null;
  const main={querySelector(selector){if(selector==='#fishMap')return mapPresent?map:null;if(selector==='#f59maplinks')return children.find(n=>n.id==='f59maplinks')||null;return null},appendChild(node){children.push(node)}};
  const originalRender=()=> 'unchanged';
  const c=vm.createContext({state:{page},render:originalRender,document:{getElementById:id=>id==='main'&&mainPresent?main:null,createElement:()=>({style:{}})},fishosRender725:{register:hook=>hooks.push(hook)},setTimeout(fn,delay){timers.push({fn,delay})}});c.window=c;
  vm.runInContext(code,c);
  return {c,hooks,timers,children,card,map,pins,originalRender};
}
test('registers one after hook without replacing render and retains delayed startup',()=>{
  const s=setup();assert.equal(s.c.render,s.originalRender);assert.equal(s.hooks.length,1);assert.equal(typeof s.hooks[0].after,'function');assert.deepEqual(Object.keys(s.hooks[0]),['after']);assert.equal(s.timers.length,1);assert.equal(s.timers[0].delay,70);s.timers[0].fn();assert.equal(s.children[0].id,'f59maplinks');
});
test('startup and repeated render hooks insert only one tools card, preserving map and pins',()=>{
  const s=setup();s.hooks[0].after();s.timers[0].fn();s.hooks[0].after();assert.equal(s.children.length,2);assert.equal(s.children[0].id,'f59maplinks');assert.equal(s.children[1],s.card);assert.equal(s.card.map,s.map);assert.equal(s.map.pins,s.pins);assert.deepEqual(s.pins,[{id:'synthetic-pin',lat:45,lon:-122}]);assert.match(s.children[0].innerHTML,/onX Maps/);assert.match(s.children[0].innerHTML,/Google Earth/);assert.match(s.children[0].innerHTML,/USGS National Map/);assert.equal((s.children[0].innerHTML.match(/rel="noopener noreferrer"/g)||[]).length,3);
});
test('adds tools only on maps, including when delayed startup fires after navigation',()=>{
  for(const page of ['home','research','map','owner-tools']){const s=setup({page});s.hooks[0].after();s.timers[0].fn();assert.equal(s.children.length,1)}
  const s=setup();s.c.state.page='home';s.timers[0].fn();assert.equal(s.children.length,1);s.c.state.page='maps';s.hooks[0].after();assert.equal(s.children.length,2);
});
test('missing map appends tools once and missing main is harmless',()=>{
  const s=setup({mapPresent:false});s.hooks[0].after();s.hooks[0].after();assert.equal(s.children.length,1);assert.equal(s.children[0].id,'f59maplinks');const absent=setup({mainPresent:false});assert.doesNotThrow(()=>absent.hooks[0].after());assert.equal(absent.children.length,1);
});
