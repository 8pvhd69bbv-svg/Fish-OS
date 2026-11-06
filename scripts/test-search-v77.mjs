import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=name=>readFileSync(new URL('../assets/'+name,import.meta.url),'utf8');
class Element {
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.style={};this.value='';this.listeners={};this.classes=new Set();this.classList={add:n=>this.classes.add(n),remove:n=>this.classes.delete(n)};this.textContent='';}
  append(...nodes){this.children.push(...nodes)}
  replaceChildren(...nodes){this.children=[...nodes]}
  contains(node){return this.children.includes(node)||this.children.some(x=>x.contains?.(node))}
  addEventListener(name,callback){this.listeners[name]=callback}
  click(){this.listeners.click?.()}
}
function setup(){
  const nodes=Object.fromEntries(['searchResults','nfPlace','nfLat','nfLon','tripLocResults'].map(id=>{const el=new Element();el.id=id;return [id,el]}));
  const listeners={},routes=[],requests=[],journal=[],fish=[];
  const c=vm.createContext({DATA:{locations:[{name:'Sample River',notes:'Sample water'}],flies:[{name:'Sample Fly'}],trips:[{id:'Sample Trip'}],journal:[{title:'Sample Journal'}],links:[{title:'Sample hidden link'}],master_note:'Sample general note'},state:{page:'locations',profile:{userId:'synthetic'}},document:{readyState:'loading',getElementById:id=>nodes[id],createElement:tag=>new Element(tag),addEventListener:(type,fn)=>listeners[type]=fn},render(){},go:page=>routes.push(page),fetch:url=>new Promise((resolve,reject)=>requests.push({url,resolve,reject})),fishosEditors68:{editJournal:i=>journal.push(i)},fishos41FishEdit:i=>fish.push(i)});c.window=c;
  vm.runInContext(source('fishos-review-v1-069.js'),c);vm.runInContext(source('fishos-search-v1-078.js'),c);
  const reply=(index,rows)=>requests[index].resolve({ok:true,json:async()=>rows});
  return {c,nodes,listeners,routes,requests,reply,journal,fish};
}
test('global search keeps existing index results and opens exact water, fly, trip and journal records',()=>{
  const s=setup(),expected=s.c.fishosReview69.searchHits(s.c.DATA,'Sample');s.c.search('Sample');
  assert.equal(s.nodes.searchResults.children.length,expected.length);
  expected.forEach((hit,i)=>{const b=s.nodes.searchResults.children[i];assert.equal(b.tagName,'BUTTON');assert.equal(b.children[1].textContent,hit.title);assert.equal(b.children[2].textContent,hit.excerpt)});
  const click=type=>s.nodes.searchResults.children[expected.findIndex(h=>h.type===type)].click();
  click('Water');click('Fly');click('Trip');click('Journal');
  assert.deepEqual(s.routes,['location-detail-0','fly-pattern-0','trip-sample-trip']);assert.deepEqual(s.journal,[0]);assert.ok(!expected.some(h=>h.title==='Sample hidden link'));
});
test('same-page water result no longer routes to collection and shifted indices follow original record',()=>{
  const s=setup();s.c.search('Sample River');const b=s.nodes.searchResults.children[0];s.c.DATA.locations.unshift({name:'Another river'});b.click();assert.deepEqual(s.routes,['location-detail-1']);
});
test('global results refuse stale accounts and removed records, and empty query closes results',()=>{
  const s=setup();s.c.search('Sample River');s.c.state.profile.userId='other';s.nodes.searchResults.children[0].click();assert.deepEqual(s.routes,[]);
  s.c.search('Sample River');s.c.DATA.locations=[];s.nodes.searchResults.children[0].click();assert.deepEqual(s.routes,[]);
  s.c.search('');assert.equal(s.nodes.searchResults.children.length,0);assert.equal(s.nodes.searchResults.classes.has('show'),false);
});
test('location names with quotes and markup select literal text and zero coordinates without inline handlers',async()=>{
  const s=setup();s.nodes.nfPlace.value='River';const pending=s.c.tripLocationSearch();const name='Fisher\'s "River" <img src=x>, Test';s.reply(0,[{display_name:name,lat:0,lon:0}]);await pending;
  const b=s.nodes.tripLocResults.children[0];assert.equal(b.tagName,'BUTTON');assert.equal(b.children[2].textContent,name);assert.equal(b.onclick,undefined);b.click();assert.equal(s.nodes.nfPlace.value,name);assert.equal(s.nodes.nfLat.value,'0');assert.equal(s.nodes.nfLon.value,'0');assert.equal(s.nodes.tripLocResults.children[0].textContent,'Location selected.');
});
test('late location responses cannot replace newer results',async()=>{
  const s=setup();s.nodes.nfPlace.value='First';const first=s.c.tripLocationSearch();s.nodes.nfPlace.value='Second';const second=s.c.tripLocationSearch();s.reply(1,[{display_name:'Second water',lat:45,lon:-120}]);await second;s.reply(0,[{display_name:'First water',lat:40,lon:-100}]);await first;assert.equal(s.nodes.tripLocResults.children[0].children[2].textContent,'Second water');
});
test('pending results ignore replaced modal, account switch, query edits and short subsequent searches',async()=>{
  for(const change of ['modal','account','query','short']){
    const s=setup();s.nodes.nfPlace.value='River';const pending=s.c.tripLocationSearch();
    if(change==='modal')s.nodes.nfPlace=new Element('input');
    if(change==='account')s.c.state.profile.userId='other';
    if(change==='query')s.nodes.nfPlace.value='Different';
    if(change==='short'){s.nodes.nfPlace.value='a';await s.c.tripLocationSearch()}
    s.reply(0,[{display_name:'Stale result',lat:10,lon:20}]);await pending;assert.ok(!s.nodes.tripLocResults.children.some(x=>x.tagName==='BUTTON'));
  }
});
test('manual location edits clear stale coordinates and cancel result selection',async()=>{
  const s=setup();s.nodes.nfPlace.value='River';const pending=s.c.tripLocationSearch();s.reply(0,[{display_name:'Chosen river',lat:10,lon:20}]);await pending;const old=s.nodes.tripLocResults.children[0];old.click();s.nodes.nfPlace.value='Manual lake';s.listeners.input({target:s.nodes.nfPlace});assert.equal(s.nodes.nfLat.value,'');assert.equal(s.nodes.nfLon.value,'');old.click();assert.equal(s.nodes.nfPlace.value,'Manual lake');
});
test('invalid coordinates are not selectable and request errors offer manual entry',async()=>{
  const s=setup();s.nodes.nfPlace.value='River';let pending=s.c.tripLocationSearch();s.reply(0,[{display_name:'Invalid',lat:91,lon:10},{display_name:'Missing',lat:'',lon:20}]);await pending;assert.equal(s.nodes.tripLocResults.children[0].textContent,'No matches.');pending=s.c.tripLocationSearch();s.requests[1].reject(Error('offline'));await pending;assert.match(s.nodes.tripLocResults.children[0].textContent,/enter the location manually/);
});
test('duplicate titles route to their own record even when only the second note matches',()=>{
  const s=setup();s.c.DATA.locations=[{name:'Twin water',notes:'North channel'},{name:'Twin water',notes:'South channel'}];
  s.c.search('South channel');assert.equal(s.nodes.searchResults.children.length,1);s.nodes.searchResults.children[0].click();assert.deepEqual(s.routes,['location-detail-1']);
  s.c.search('Twin water');assert.equal(s.nodes.searchResults.children.length,2);s.nodes.searchResults.children.forEach(b=>b.click());assert.deepEqual(s.routes.slice(1),['location-detail-0','location-detail-1']);
});
test('equal truncated result labels retain distinct journal identities',()=>{
  const s=setup(),prefix='A'.repeat(100);s.c.DATA.journal=[{title:prefix+' North'},{title:prefix+' South'}];s.c.search(prefix);
  assert.equal(s.nodes.searchResults.children.length,2);assert.equal(s.nodes.searchResults.children[0].children[1].textContent,s.nodes.searchResults.children[1].children[1].textContent);
  s.nodes.searchResults.children.forEach(b=>b.click());assert.deepEqual(s.journal,[0,1]);
});

test('private destination search uses country name and opens its country profile',()=>{
 const s=setup();s.c.DATA.destination_notes=[{country:'Sample Islands (North)',notes:'Rare sample research',rating:'Good'}];
 s.c.search('Rare sample research');const result=s.nodes.searchResults.children[0];
 assert.equal(result.children[0].textContent,'Destination');assert.equal(result.children[1].textContent,'Sample Islands (North)');
 result.click();assert.deepEqual(s.routes,['destination-sample-islands-north']);
});
