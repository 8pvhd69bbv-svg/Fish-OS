import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source = name => readFileSync(new URL('../assets/'+name,import.meta.url),'utf8');
function packing() {
  const nodes = {'p64-save':{},'p64-list-name':{value:'Recovered pack'},'p64-trip':{value:''}};
  const c=vm.createContext({DATA:{trips:[]},state:{profile:{},packing:[{name:'Old item',qty:0,weight:0}]},document:{readyState:'loading',getElementById:id=>nodes[id]},crypto:{randomUUID:()=> 'recovered'},fishStorage:{setItem(){}},render(){},persistData(){},closeModal(){},openModal(){},shell:(title,sub,body)=>body,tripStatus:t=>t.status});
  c.window=c;
  vm.runInContext(source('fishos-packing-v1-075.js').replace('normalize,locked,active,weight','normalize,locked,active,weight,assign,page,saveAs'),c);
  return {c,nodes,a:c.fishosPacking64};
}
test('new and obsolete selections use New List without changing previous items',()=>{
  const {c,a}=packing();
  for(const id of [undefined,'GENERAL','missing','LIST:missing']) {
    c.state.packTripId=id; assert.equal(a.active().id,'NEW');
  }
  assert.equal(c.state.packing[0].name,'Old item');
  assert.equal(c.DATA.field_settings.pack_lists && Object.keys(c.DATA.field_settings.pack_lists).length,0);
  assert.doesNotMatch(a.page(),/General working list|value="GENERAL"/);
  assert.match(a.page(),/SAVE PREVIOUS ITEMS AS NAMED LIST/);
});
test('previous items are copied only on explicit named-list save, preserving zero values',async()=>{
  const {c,nodes,a}=packing();
  a.saveAs(a.normalize(c.state.packing));
  assert.equal(c.DATA.field_settings?.pack_lists?.recovered,undefined);
  await nodes['p64-save'].onclick();
  const saved=c.DATA.field_settings.pack_lists.recovered;
  assert.equal(saved.items.FIELD[0].qty,0);
  assert.equal(saved.items.FIELD[0].weight,0);
  saved.items.FIELD[0].name='Changed copy';
  assert.equal(c.state.packing[0].name,'Old item');
  assert.equal(c.state.packTripId,'LIST:recovered');
});
test('completed-trip packing remains immutable',()=>{
  const {c,a}=packing();c.DATA.trips=[{id:'Past',status:'Completed'}];c.state.packingByTrip={Past:{FIELD:[{name:'Protected'}]}};c.state.packTripId='Past';
  assert.equal(a.active().locked,true);
  assert.throws(()=>a.assign('Past',{FIELD:[]}),/locked/);
  assert.equal(c.state.packingByTrip.Past.FIELD[0].name,'Protected');
});
function layout(page,owner) {
  const removed=[];
  const main={querySelector:id=>({remove:()=>removed.push(id)}),querySelectorAll:()=>[]};
  const c=vm.createContext({state:{page},document:{getElementById:id=>id==='main'?main:null,addEventListener(){}},fishosCleanup65:{owner:()=>owner},fishosRender725:{register(){}},go(){}});c.window=c;
  vm.runInContext(source('fishos-layout-v1-075.js'),c);return {c,removed,main};
}
test('invite help and reference tools remain only on authorized Owner Tools',()=>{
  for(const [page,owner] of [['account',false],['account',true],['research',true],['tying-knowledge',true],['owner-tools',false]]) {
    const {c,removed}=layout(page,owner);c.fishosLayout75.arrange();assert.deepEqual(removed,['#invite71','#m64-tools']);
  }
  const {c,removed}=layout('owner-tools',true);c.fishosLayout75.arrange();assert.deepEqual(removed,[]);
});
test('AI is inserted after Owner Tools or immediately before Account',()=>{
  for(const isOwner of [true,false]) {
    const {c}=layout('home',false),events=[];
    const ai={parentElement:{children:[],remove:()=>events.push('empty group removed')}};
    const account={textContent:'Account',before:n=>{assert.equal(n,ai);events.push('before account');ai.parentElement={}}};
    const owner={after:n=>{assert.equal(n,ai);events.push('after owner');ai.parentElement={}}};
    const root={querySelector:s=>s==='#v63-owner-nav'?(isOwner?owner:null):ai,querySelectorAll:()=>[account]};
    const old=c.document.getElementById;c.document.getElementById=id=>id==='side'?root:old(id);
    c.fishosLayout75.arrange();assert.equal(events[0],isOwner?'after owner':'before account');
  }
});

