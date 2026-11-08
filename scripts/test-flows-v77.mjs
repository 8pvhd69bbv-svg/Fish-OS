import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../assets/fishos-flows-v1-077.js',import.meta.url),'utf8');
function fixture() {
  const storage=new Map();
  const ctx={URL,URLSearchParams,DATA:{field_settings:{other:'keep'}},state:{page:'home',profile:{userId:'test-a',loggedIn:true},privateHydrated:true},
    document:{readyState:'loading',addEventListener(){}},fishosRender725:{register(){}},persistData(){ctx.saves++},saves:0,
    fishStorage:{scope:'scope-a',getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)}};
  ctx.window=ctx;
  vm.runInNewContext(source,ctx);
  return {ctx,flows:ctx.fishosFlows77,owner:'test-a|true|true|scope-a'};
}
test('USGS queries use full-text search for names and exact station numbers including leading zeros',()=>{
  const {flows}=fixture();
  assert.equal(new URL(flows.searchURL('river & county')).searchParams.get('q'),'river & county');
  const url=new URL(flows.searchURL(' usgs-01234567 '));
  assert.equal(url.searchParams.get('monitoring_location_number'),'01234567');
  assert.equal(url.searchParams.get('agency_code'),'USGS');
  assert.throws(()=>flows.searchURL(' '));
});
test('GeoJSON monitoring location results preserve station IDs and exclude other agencies and duplicates',()=>{
  const {flows}=fixture();
  const hit={id:'USGS-01234567',properties:{agency_code:'USGS',monitoring_location_name:'Example River',state_name:'Oregon',site_type:'Stream'}};
  const nonUsgs={properties:{...hit.properties,agency_code:'OTHER',monitoring_location_number:'99999999'}};
  const rows=flows.parseStations({features:[hit,hit,nonUsgs,{properties:{monitoring_location_number:'bad'}}]});
  assert.deepEqual(JSON.parse(JSON.stringify(rows)),[{id:'01234567',name:'Example River',state:'Oregon',type:'Stream'}]);
});
test('adding a station preserves other panels, stores its name and restores the account configuration',()=>{
  const {ctx,flows,owner}=fixture();
  const hit={id:'01234567',name:'Example River'};
  flows.addStation(hit,1,owner);flows.addStation(hit,1,owner);
  assert.deepEqual(Array.from(flows.settings()),['14303600','01234567','14301500']);
  assert.equal(ctx.DATA.field_settings.other,'keep');
  assert.equal(ctx.saves,2);
  const restored=fixture();restored.ctx.DATA.field_settings=JSON.parse(JSON.stringify(ctx.DATA.field_settings));
  assert.equal(restored.flows.settings()[1],hit.id);
  assert.equal(restored.flows.catalog().filter(s=>s.id===hit.id&&s.name===hit.name).length,1);
});
test('a stale result cannot update a detached panel, another route, a new search or another account',()=>{
  const {ctx,flows,owner}=fixture(),panel={isConnected:true},hit={id:'01234567',name:'Example River'};
  assert.equal(flows.requestCurrent(0,owner,panel),true);
  assert.equal(flows.requestCurrent(1,owner,panel),false);
  assert.equal(flows.requestCurrent(0,owner,{isConnected:false}),false);
  ctx.state.page='research';assert.equal(flows.requestCurrent(0,owner,panel),false);
  ctx.state.page='home';ctx.state.profile.userId='test-b';assert.equal(flows.requestCurrent(0,owner,panel),false);
  assert.throws(()=>flows.addStation(hit,1,owner),/Account changed/);
  ctx.state.privateHydrated=false;assert.throws(()=>flows.addStation(hit,1,'test-b|true|false|scope-a'),/finish loading/);
  assert.equal(ctx.DATA.field_settings.flow_station_catalog,undefined);
  assert.equal(ctx.saves,0);
});

test('adding to the shared station catalog preserves all selected panels',()=>{
 const {ctx,flows,owner}=fixture(),before=Array.from(flows.settings());
 flows.addStation({id:'01234567',name:'Shared river'},null,owner);
 assert.deepEqual(Array.from(flows.settings()),before);
 assert.ok(flows.catalog().some(x=>x.id==='01234567'));
 assert.equal(ctx.saves,1);
 assert.ok(!source.includes('Show in panel'));
});
