import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const source=html.split('\n').find(x=>x.includes('window.deleteFishTrip=function(i)'));
function fixture(confirmAction){
 const c={DATA:{trips:[{id:'a'},{id:'b'}],journal:[{trip_id:'a'}],fish:[{trip_id:'a'}]},state:{profile:{loggedIn:true,userId:'owner'},privateHydrated:true,packingByTrip:{a:{kit:1},b:{kit:2}},packTripId:'a'},persistData(){c.saved=true},render(){},alert(){c.alerted=true},fishStorage:{setItem(k,v){c.cache=JSON.parse(v)}},confirm(){confirmAction?.(c);return true}};
 c.trips=()=>c.DATA.trips;c.window=c;vm.runInNewContext(source,c);return c;
}
test('trip deletion removes only its trip and checklist, including cached checklist',()=>{const c=fixture();c.deleteFishTrip(0);assert.equal(c.DATA.trips[0].id,'b');assert.equal(c.DATA.journal.length,1);assert.equal(c.DATA.fish.length,1);assert.equal(c.cache.a,undefined);assert.equal(c.cache.b.kit,2);assert.equal(c.state.packTripId,'GENERAL');assert.equal(c.saved,true)});
test('trip deletion refuses stale account, stale record and incomplete hydration',()=>{for(const change of [c=>c.state.profile.userId='other',c=>c.DATA.trips.unshift({id:'new'})]){const c=fixture(change);c.deleteFishTrip(0);assert.ok(c.DATA.trips.some(x=>x.id==='a'));assert.equal(c.saved,undefined)}const c=fixture();c.state.privateHydrated=false;c.deleteFishTrip(0);assert.equal(c.DATA.trips.length,2)});
test('duplicate trip IDs retain shared checklist until last trip is removed',()=>{const c=fixture();c.DATA.trips.push({id:'a'});c.deleteFishTrip(0);assert.equal(c.state.packingByTrip.a.kit,1)});
