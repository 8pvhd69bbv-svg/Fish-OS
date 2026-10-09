// Offline only: never connects to Supabase or writes to the live account.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const [mode,folder,downloads]=process.argv.slice(2);
if(!['seal','verify'].includes(mode)||!folder)throw Error('Usage: node scripts/backup-verify.mjs seal|verify PRIVATE_FOLDER [DOWNLOADS_FOLDER]');
const root=path.resolve(folder),repo=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
if(root===repo||root.startsWith(repo+path.sep))throw Error('Keep private backups outside the repository.');
const digest=(buffer,algorithm='sha256')=>crypto.createHash(algorithm).update(buffer).digest('hex');
function file(name){const p=path.resolve(root,name);if(!p.startsWith(root+path.sep)||name.includes('..')||path.isAbsolute(name))throw Error('Unsafe manifest path');return p}
const read=name=>fs.readFileSync(file(name));
const db=JSON.parse(read('database.json'));
assert.equal(db.format,'fishos-complete-backup-v1');
assert.ok(Array.isArray(db.records)&&db.records.length>0);
const objects=db.storage_objects||[],catalog=db.catalog||[];
assert.equal(objects.length,catalog.length,'Orphaned object or missing catalog entry: inspect before declaring complete');
for(const obj of objects)assert.ok(catalog.some(x=>x.path===obj.name&&x.bucket_id===obj.bucket_id),'Storage object missing from catalog');
if(mode==='seal'){
 if(fs.existsSync(file('manifest.json')))throw Error('Already sealed; create a new dated backup instead of overwriting it.');
 const names=['database.json'];fs.mkdirSync(file('objects'),{recursive:true});fs.mkdirSync(file('restore-records'),{recursive:true});
 for(const row of catalog){
  assert.match(row.id,/^[a-f0-9-]{36}$/i);const original=fs.readFileSync(path.join(downloads,path.basename(row.path)));
  assert.equal(original.length,Number(row.size_bytes),'Downloaded size differs from catalog');
  const obj=objects.find(x=>x.name===row.path&&x.bucket_id===row.bucket_id);assert.ok(obj,'Catalog object missing');
  const etag=String(obj.metadata?.eTag||obj.metadata?.etag||'').replaceAll('"','');
  if(/^[a-f0-9]{32}$/i.test(etag))assert.equal(digest(original,'md5'),etag.toLowerCase(),'Downloaded object differs from storage ETag');
  const name='objects/'+row.id+'.bin';fs.writeFileSync(file(name),original,{flag:'wx'});names.push(name);
 }
 for(const row of db.records){assert.match(row.user_id,/^[a-f0-9-]{36}$/i);const name='restore-records/'+row.user_id+'.json';fs.writeFileSync(file(name),JSON.stringify({format:'fishos-private',data:row.data},null,2),{flag:'wx'});names.push(name)}
 if(fs.existsSync(file('local-sources')))for(const n of fs.readdirSync(file('local-sources')))names.push('local-sources/'+n);
 const manifest={format:'fishos-checksums-v1',sealed_at:new Date().toISOString(),project_ref:db.project_ref,records:db.records.length,revisions:db.revisions.length,objects:objects.length,files:names.map(name=>({name,bytes:read(name).length,sha256:digest(read(name))})),scope:'Application records, revisions, private catalog and object bytes; local source snapshots retained separately. Does not include Supabase Auth passwords or platform infrastructure.'};
 fs.writeFileSync(file('manifest.json'),JSON.stringify(manifest,null,2),{flag:'wx'});
}
const manifest=JSON.parse(read('manifest.json'));assert.equal(manifest.format,'fishos-checksums-v1');
for(const item of manifest.files){const bytes=read(item.name);assert.equal(bytes.length,item.bytes,'Size mismatch: '+item.name);assert.equal(digest(bytes),item.sha256,'Checksum mismatch: '+item.name)}
for(const row of db.records){const restored=JSON.parse(read('restore-records/'+row.user_id+'.json'));assert.equal(restored.format,'fishos-private');assert.deepEqual(restored.data,row.data);assert.ok(Array.isArray(restored.data.trips));assert.ok(Array.isArray(restored.data.locations))}
for(const row of catalog)assert.equal(read('objects/'+row.id+'.bin').length,Number(row.size_bytes));
console.log(JSON.stringify({result:'PASS',checkedFiles:manifest.files.length,accountRecords:db.records.length,revisions:db.revisions.length,privateObjects:catalog.length,tripRecords:db.records.reduce((n,r)=>n+(r.data.trips||[]).length,0),locationRecords:db.records.reduce((n,r)=>n+(r.data.locations||[]).length,0),productionWrites:0}));
