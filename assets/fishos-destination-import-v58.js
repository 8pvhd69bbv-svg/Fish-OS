/* FishOS V58 — optional private coordinates importer for existing destination atlas. */
(function(){
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function decorate(){
 if(state.page!=='destinations')return;
 const main=document.getElementById('main');if(!main||main.querySelector('#dest-coordinate-import'))return;
 const box=document.createElement('div');box.className='card';box.id='dest-coordinate-import';box.style.marginTop='14px';
 box.innerHTML='<h3>Private destination coordinates</h3><p>Import approximate reference positions for your own destinations. These are map reference points, not specific fishing spots. Existing saved coordinates are preserved.</p><div class="toolbar"><input id="dest-coordinate-file" type="file" accept=".json,application/json"><button id="dest-coordinate-action" class="btn">REVIEW / IMPORT COORDINATES</button></div><p id="dest-coordinate-status" role="status" class="muted small">Sign in and choose a FishOS destination-coordinates JSON file.</p>';
 const hero=main.querySelector('.hero');if(hero)hero.after(box);else main.prepend(box);
 const points=DATA.legacy_v21?.destination_map_points||{};const names=Object.keys(points);
 if(names.length){const summary=document.createElement('div');summary.className='card';summary.innerHTML='<h3>Saved approximate destination references — '+names.length+'</h3><p class="muted">These are regional map references, not exact fishing positions.</p><div class="grid g2">'+names.map(name=>{const x=points[name];if(!Number.isFinite(Number(x.lat))||!Number.isFinite(Number(x.lon)))return '';return '<div class="row"><div><b>'+escape(name)+'</b><div class="meta">'+Number(x.lat).toFixed(3)+', '+Number(x.lon).toFixed(3)+' · approximate</div></div><a class="btn" rel="noopener" target="_blank" href="https://www.openstreetmap.org/?mlat='+encodeURIComponent(x.lat)+'&mlon='+encodeURIComponent(x.lon)+'#map=7/'+encodeURIComponent(x.lat)+'/'+encodeURIComponent(x.lon)+'">MAP</a></div>'}).join('')+'</div>';box.after(summary);}

 box.querySelector('#dest-coordinate-action').onclick=async()=>{
 const result=box.querySelector('#dest-coordinate-status');
 try{
  if(!state.profile?.loggedIn||!window.supabaseClient||!state.profile?.userId||!state.privateHydrated)throw Error('Sign in and load your private account first.');
  const file=box.querySelector('#dest-coordinate-file').files[0];if(!file||file.size>512000)throw Error('Choose a destination-coordinates JSON file under 500 KB.');
  const parsed=JSON.parse(await file.text());if(parsed.format!=='fishos-destination-coordinates-v1'||!Array.isArray(parsed.entries))throw Error('File must be a FishOS destination-coordinates export.');
  const records=parsed.entries.filter(x=>x&&typeof x.name==='string'&&x.name.trim()&&Number.isFinite(Number(x.lat))&&Math.abs(Number(x.lat))<=90&&Number.isFinite(Number(x.lon))&&Math.abs(Number(x.lon))<=180);
  if(!records.length)throw Error('No valid coordinate references in the file.');
  if(!confirm('Add up to '+records.length+' approximate destinations to your private atlas? Existing coordinate entries will not be replaced.'))return;
  const c=window.supabaseClient,userId=state.profile.userId;
  const read=await c.from('fishos_user_data').select('data,updated_at').eq('user_id',userId).single();if(read.error)throw read.error;
  const legacy={...(read.data.data.legacy_v21||{})},current={...(legacy.destination_map_points||{})};let added=0,skipped=0;
  for(const x of records){if(current[x.name]?.lat!=null&&current[x.name]?.lon!=null){skipped++;continue}current[x.name]={lat:Number(x.lat),lon:Number(x.lon),coordinate_accuracy:'approximate',coordinate_note:String(x.coordinate_note||'Preliminary geographic reference').slice(0,250),coordinate_source:String(x.coordinate_source||'').slice(0,500),review_status:'needs_confirmation'};added++}
  if(!added){result.textContent='All '+skipped+' reference points already exist. No data changed.';return}
  legacy.destination_map_points=current;
  const save=await c.from('fishos_user_data').update({data:{...read.data.data,legacy_v21:legacy},updated_at:new Date().toISOString()}).eq('user_id',userId).eq('updated_at',read.data.updated_at).select('updated_at');
  if(save.error)throw save.error;
  if((save.data||[]).length!==1)throw Error('Cloud record changed in another session. Refresh and retry.');
  DATA.legacy_v21=legacy;localStorage.setItem('fishos_data',JSON.stringify(DATA));
  state.cloudStatus='Saved';result.textContent='Imported '+added+' approximate positions; skipped '+skipped+' existing points. Private Supabase confirmed save.';
 }catch(err){result.textContent='Import error: '+(err.message||String(err))}
 };
}
const prior=window.render;window.render=function(...args){const r=prior.apply(this,args);decorate();return r};
setTimeout(decorate,75);
})();