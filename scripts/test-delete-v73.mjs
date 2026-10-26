import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const source=html.slice(html.indexOf('window.fishos73DeletePrivateFile='),html.indexOf('// Patch only requested routes'));
const modern=html.match(/window\.v35DeleteFile=async function\(id\)\{[^\n]+/)[0];
function setup(options={}){
 const file={id:'photo',user_id:'alice',path:'alice/research/photo.jpg',bucket_id:'fishos-private',original_name:'Synthetic photo.jpg'};
 const calls=[],alerts=[],filters=[];
 const c=vm.createContext({DATA:options.local||{},state:{profile:{loggedIn:true,userId:'alice'},privateHydrated:true},statusText:e=>e.message||String(e),alert:v=>alerts.push(v),confirm:()=>{calls.push('confirm');options.onConfirm?.(c);return options.confirm!==false},fileRows:[file],rows35:[file]});c.window=c;
 const answer=async stage=>{calls.push(stage);await options.hook?.(stage,c);if(options.fail===stage)return {error:Error(stage+' failed')};if(stage==='catalog')return {data:options.catalog===undefined?{...file}:options.catalog};if(stage==='records')return {data:options.missingRecords?null:{data:options.cloud===undefined?{}:options.cloud}};if(stage==='delete')return {data:options.emptyDelete?[]:[{id:file.id}]};return {data:[]}};
 c.supabaseClient={from(table){let deleting=false;const query={select(){return query},eq(k,v){filters.push([table,k,v]);return query},delete(){deleting=true;return query},maybeSingle(){return answer(table==='fishos_files'?'catalog':'records')},then(resolve,reject){return answer(deleting?'delete':'unexpected').then(resolve,reject)}};return query},storage:{from(bucket){assert.equal(bucket,'fishos-private');return {remove(paths){assert.deepEqual(Array.from(paths),[file.path]);return answer('storage')}}}}};
 c.v34ListFiles=async()=>{calls.push('refresh');await options.hook?.('refresh',c)};
 vm.runInContext(source+'\n'+modern,c);
 return {c,file,calls,alerts,filters,run:()=>c[options.legacy?'v34DeleteFile':'v35DeleteFile'](file.id)};
}
for(const legacy of [false,true])test(`${legacy?'legacy':'current'} handler deletes an unlinked owned file and refreshes`,async()=>{const x=setup({legacy});assert.equal(await x.run(),true);assert.deepEqual(x.calls,['catalog','records','confirm','storage','delete','refresh']);assert.ok(x.filters.some(([table,k,v])=>table==='fishos_files'&&k==='user_id'&&v==='alice'));assert.deepEqual(x.alerts,[])});
const references=[
 ['section photo',{field_settings:{section_photos:{journal:{file_id:'photo'}}}},'REMOVE SECTION PHOTO'],
 ['fly thumbnail',{flies:[{name:'Test fly',thumbnail_file_id:'photo'}]},'REMOVE THUMBNAIL'],
 ['fly gallery',{flies:[{name:'Test fly',photo_file_ids:['photo']}]},'REMOVE PHOTO'],
 ['location thumbnail',{locations:[{name:'Test lake',thumbnail_file_id:'photo'}]},'REMOVE THUMBNAIL'],
 ['location gallery',{locations:[{name:'Test lake',photo_file_ids:['photo']}]},'REMOVE PHOTO']
];
for(const [name,data,instruction] of references)for(const scope of ['local','cloud'])test(`${scope} ${name} prevents destructive calls and gives detach instructions`,async()=>{const before=JSON.stringify(data),x=setup({[scope]:data});assert.equal(await x.run(),false);assert.ok(!x.calls.includes('storage'));assert.ok(!x.calls.includes('delete'));assert.match(x.alerts[0],new RegExp(instruction));assert.equal(JSON.stringify(data),before)});
for(const stage of ['catalog','records'])test(`${stage} read error preserves storage and catalog`,async()=>{const x=setup({fail:stage});await x.run();assert.ok(!x.calls.includes('storage'));assert.ok(!x.calls.includes('delete'));assert.match(x.alerts[0],/failed/)});
for(const options of [{missingRecords:true},{cloud:null},{cloud:{flies:{}}},{cloud:{locations:[{photo_file_ids:'photo'}]}},{catalog:null},{catalog:{id:'photo',user_id:'bob',path:'bob/photo'}}])test('missing, malformed or unowned authoritative records fail closed '+JSON.stringify(options),async()=>{const x=setup(options);await x.run();assert.ok(!x.calls.includes('storage'));assert.ok(!x.calls.includes('delete'));assert.equal(x.alerts.length,1)});
for(const stage of ['catalog','records','storage','delete'])for(const change of ['account','client','hydration'])test(`${change} change while ${stage} is pending stops subsequent work`,async()=>{const x=setup({hook:(s,c)=>{if(s===stage){if(change==='account')c.state.profile.userId='bob';else if(change==='client')c.supabaseClient={};else c.state.privateHydrated=false}}});assert.equal(await x.run(),false);const index=x.calls.indexOf(stage);assert.equal(x.calls.length,index+1);assert.match(x.alerts[0],/Account changed/)});
test('signed out, unhydrated and stale owner rows cannot start reads',async()=>{for(const change of [x=>x.c.state.profile.loggedIn=false,x=>x.c.state.privateHydrated=false,x=>x.file.user_id='bob']){const x=setup();change(x);await x.run();assert.deepEqual(x.calls,[]);assert.equal(x.alerts.length,1)}});
test('cancel does not delete',async()=>{const x=setup({confirm:false});assert.equal(await x.run(),false);assert.ok(!x.calls.includes('storage'));assert.deepEqual(x.alerts,[])});
test('a local photo selection added during reads blocks removal',async()=>{const x=setup({hook:(s,c)=>{if(s==='records')c.DATA.flies=[{photo_file_ids:['photo']}]}});await x.run();assert.ok(!x.calls.includes('storage'));assert.match(x.alerts[0],/REMOVE PHOTO/)});
test('confirmation rechecks account and local links',async()=>{for(const onConfirm of [c=>c.state.profile.userId='bob',c=>c.DATA.locations=[{thumbnail_file_id:'photo'}]]){const x=setup({onConfirm});await x.run();assert.ok(!x.calls.includes('storage'))}});
test('storage failure retains catalog',async()=>{const x=setup({fail:'storage'});await x.run();assert.ok(!x.calls.includes('delete'));assert.match(x.alerts[0],/storage failed/)});
for(const options of [{fail:'delete'},{emptyDelete:true}])test('catalog failure reports partial storage deletion '+JSON.stringify(options),async()=>{const x=setup(options);assert.equal(await x.run(),false);assert.ok(!x.calls.includes('refresh'));assert.match(x.alerts[0],/Storage removal completed; catalog cleanup may be incomplete/)});
test('unrelated references and legacy string records remain deletable',async()=>{const x=setup({local:{flies:['Legacy fly',{photo_file_ids:['other']}],locations:['Legacy lake'],field_settings:{section_photos:{journal:null}}}});assert.equal(await x.run(),true)});
for(const patch of [{path:'bob/research/photo.jpg'},{path:'alice/../bob/photo.jpg'},{path:'alice//photo.jpg'},{bucket_id:'another-bucket'}])test('untrusted storage target is refused '+JSON.stringify(patch),async()=>{const x=setup();Object.assign(x.file,patch);await x.run();assert.ok(!x.calls.includes('storage'));assert.match(x.alerts[0],/storage ownership/)});
test('catalog path changed since the library was loaded is refused',async()=>{const x=setup({hook:(stage,c)=>{if(stage==='catalog')c.fileRows[0].notes='unrelated UI mutation'},catalog:{id:'photo',user_id:'alice',path:'alice/research/different.jpg',bucket_id:'fishos-private'}});await x.run();assert.ok(!x.calls.includes('storage'));assert.match(x.alerts[0],/File changed/)});
