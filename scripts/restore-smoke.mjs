// Exercises the actual application's hydration against an offline restored snapshot.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const folder=process.argv[2];if(!folder)throw Error('Pass the independently restored private backup folder.');
const db=JSON.parse(fs.readFileSync(path.join(folder,'database.json'),'utf8'));
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const row of db.records){
 const data=JSON.parse(fs.readFileSync(path.join(folder,'restore-records',row.user_id+'.json'),'utf8')).data;
 const c=vm.createContext({DATA:{},state:{},saveLocal(){}});
 for(const name of ['privatePayload','applyPrivate'])vm.runInContext(html.match(new RegExp('^  function '+name+'\\([^\\n]+','m'))[0],c);
 c.applyPrivate(data);const roundtrip=JSON.parse(JSON.stringify(c.privatePayload()));
 for(const key of ['trips','locations','rods','journal','fish','flies','links','knot_notes','section_notes','trip_sessions'])assert.deepEqual(roundtrip[key],data[key]||[],key+' differs after application restore');
 assert.deepEqual(roundtrip.packingByTrip,data.packingByTrip||{});
}
console.log('PASS: restored account records hydrate through the actual app and retain supported records, notes and packing; no network or production writes.');
