/* Dedicated private collections; retain existing hubs, Upload and record controls. */
(function(){
'use strict';
const E=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const A=x=>Array.isArray(x)?x:[];
const sections={
 'tying-knowledge':['Tying Knowledge','Techniques, designers, recipes and lessons from your tying bench.'],
 'casting-drills':['Casting Drills','Practice sessions, goals and observations.'],
 'casting-spey':['Two-hand Casting','Switch and spey casting notes, setups and practice.'],
 'casting-saltwater':['Saltwater Casting','Wind, distance, line handling and saltwater practice.']
};
let epoch=0,photoUrls=[],researchCategory='All';
const categories=['All','General','Research','Destinations','Species','Fly Patterns','Fly Photos','Knots','Maps','Gear','Trip Research','Articles','Video / Audio','Fishing Opportunities','Fly Shop','Regulations','Outfitters','Other'];
function auth(){if(!state.profile?.loggedIn||!state.profile.userId||!state.privateHydrated)throw Error('Sign in and finish loading your account first.');return {client:window.supabaseClient,uid:state.profile.userId}}
function active(uid,t){return state.profile?.userId===uid&&epoch===t}
function goButton(page,label){return '<button class="btn" data-v62-go="'+E(page)+'">'+E(label)+'</button>'}
function notesPage(route){const [title,sub]=sections[route],notes=A(DATA.section_notes).filter(x=>x.section===route);return shell(title,sub,
 '<div class="toolbar">'+goButton(route==='tying-knowledge'?'fly-tying':'casting','BACK TO HUB')+goButton('resources','REFERENCE LINKS')+goButton('gear','GEAR')+'<button class="btn gold" id="v62-add-note">+ ADD NOTE</button></div><div class="grid g2">'+notes.map(n=>'<article class="card"><h3>'+E(n.title)+'</h3><p style="white-space:pre-wrap">'+E(n.body)+'</p><button class="btn" data-v62-note="'+E(n.id)+'">EDIT NOTE</button></article>').join('')+'</div>'+(!notes.length?'<div class="empty">No notes yet. Add a private note to start this collection.</div>':'')+
 (route==='tying-knowledge'?'<div class="card"><h3>Saved pattern knowledge</h3>'+A(DATA.flies).filter(x=>x&&typeof x==='object'&&(x.notes||x.materials||x.recipe)).map(x=>'<details><summary>'+E(x.name||x.title||'Pattern')+'</summary><p style="white-space:pre-wrap">'+E([x.materials||x.recipe,x.notes].filter(Boolean).join('\n\n'))+'</p></details>').join('')+'</div>':''));}
function editNote(id){
 try{auth()}catch(e){alert(e.message);return}
 const route=state.page,n=A(DATA.section_notes).find(x=>x.id===id&&x.section===route)||{id:crypto.randomUUID()},uid=state.profile.userId;
 openModal(id?'EDIT NOTE':'ADD NOTE','<div class="form"><label>Title<input id="v62-note-title" value="'+E(n.title||'')+'"></label><label>Notes<textarea id="v62-note-body" rows="8">'+E(n.body||'')+'</textarea></label><button class="btn gold" id="v62-save-note">SAVE NOTE</button><p id="v62-note-status" role="status"></p></div>');
 document.getElementById('v62-save-note').onclick=async()=>{const title=document.getElementById('v62-note-title').value.trim(),body=document.getElementById('v62-note-body').value;
  if(!title)return;try{auth();if(state.profile.userId!==uid)throw Error('Account changed. Reopen this note.');DATA.section_notes=A(DATA.section_notes);const index=DATA.section_notes.findIndex(x=>x.id===n.id&&x.section===route),entry={...n,id:n.id||crypto.randomUUID(),section:route,title,body,updated_at:new Date().toISOString()};if(index<0)DATA.section_notes.push(entry);else DATA.section_notes[index]=entry;persistData();const saved=await syncCloud();if(state.profile.userId!==uid)return;if(!saved)throw Error(state.cloudError||'Cloud save failed; note remains in this session. Retry.');closeModal();render()}catch(e){const el=document.getElementById('v62-note-status');if(el)el.textContent=e.message}
 };
}
function photosPage(){return shell('Fly Photos / Best Of','Your private uploaded fly-photo collection.',
 '<div class="toolbar">'+goButton('fly-tying','FLY TYING')+'<button class="btn gold" id="v62-upload-photos">UPLOAD FLY PHOTOS</button><button class="btn" id="v62-refresh-photos">REFRESH</button></div><p>Choose Fly Photos on Upload. Existing files can be moved into this collection by editing their category in the private file catalog.</p><p id="v62-photo-status" role="status">Loading your collection…</p><div id="v62-photo-grid" class="grid g3"></div>');}
async function loadPhotos(t){
 const status=document.getElementById('v62-photo-status'),grid=document.getElementById('v62-photo-grid');
 try{const {client,uid}=auth();let rows=[],offset=0;
  for(;;){const r=await client.from('fishos_files').select('id,bucket_id,path,original_name,mime_type,category,notes').eq('user_id',uid).eq('category','Fly Photos').order('created_at',{ascending:false}).range(offset,offset+199);if(r.error)throw r.error;if(!active(uid,t)||!grid.isConnected)return;rows.push(...(r.data||[]));if((r.data||[]).length<200)break;offset+=200}
  status.textContent=rows.length?rows.length+' private files. Images load from your account.':'No fly photos yet. Upload your first photo using the button above.';
  for(const row of rows){if(!active(uid,t)||!grid.isConnected)return;const card=document.createElement('article');card.className='card';card.innerHTML='<h3>'+E(row.original_name)+'</h3><p>'+E(row.notes||'')+'</p>';grid.append(card);
   if(!/^image\/(jpeg|png|webp|gif|avif)$/i.test(row.mime_type||'')){card.insertAdjacentHTML('beforeend','<p>Preview unavailable for this format. Use Upload’s file catalog to open the original.</p>');continue}
   try{const r=await client.storage.from(row.bucket_id||'fishos-private').download(row.path);if(r.error)throw r.error;if(!active(uid,t)||!grid.isConnected)return;const url=URL.createObjectURL(r.data);photoUrls.push(url);const img=document.createElement('img');img.src=url;img.alt=row.original_name;img.loading='lazy';img.style.cssText='width:100%;max-height:300px;object-fit:contain';const link=document.createElement('a');link.href=url;link.download=row.original_name;link.className='btn';link.textContent='DOWNLOAD ORIGINAL';card.prepend(img);card.append(link)}catch(e){if(active(uid,t))card.insertAdjacentHTML('beforeend','<p>'+E('Photo unavailable: '+e.message)+'</p>')}
  }
 }catch(e){if(t===epoch&&status?.isConnected)status.textContent=e.message}
}
function uploadCategory(value){go('upload');window.fishos40Mode?.('upload');for(const id of ['f40category','v34Category']){const el=document.getElementById(id);if(el)el.value=value}document.getElementById('f40files')?.focus()}
function wireUpload(){for(const id of ['f40category','v34Category']){const el=document.getElementById(id);if(el&&!Array.from(el.options).some(x=>x.value==='Fly Photos'))el.add(new Option('Fly Photos','Fly Photos'))}}
function categoryOf(x){return x.category||'Other'}
function researchControls(){
 const main=document.getElementById('main');if(!main||main.querySelector('#v62-research-categories'))return;
 const bar=document.createElement('section');bar.id='v62-research-categories';bar.className='card';bar.innerHTML='<h3>Research categories</h3><div class="toolbar">'+categories.map(c=>'<button class="btn '+(c===researchCategory?'gold':'')+'" data-v62-category="'+E(c)+'">'+E(c)+'</button>').join('')+'</div><p>Filter saved links and uploaded research. Unclassified items remain under Other.</p>';
 main.querySelector('.grid')?.after(bar);
 bar.querySelectorAll('[data-v62-category]').forEach(b=>b.onclick=()=>{researchCategory=b.dataset.v62Category;render()});
 const links=A(DATA.links).map(x=>typeof x==='string'?{title:x}:x).filter(Boolean),grid=bar.nextElementSibling;
 if(grid?.classList.contains('grid'))grid.innerHTML=links.filter(x=>researchCategory==='All'||categoryOf(x).toLowerCase()===researchCategory.toLowerCase()).map(x=>'<article class="card"><h3>'+E(x.title||x.name||x.url||'Resource')+'</h3><span class="tag">'+E(categoryOf(x))+'</span><p>'+E(x.notes||'')+'</p>'+(/^https?:\/\//i.test(x.url||'')?'<a class="btn" target="_blank" rel="noopener noreferrer" href="'+E(x.url)+'">OPEN SOURCE</a>':'')+'</article>').join('')||'<p class="muted">No saved links in this category.</p>';
}
// The Research bridge reads this filter before loading its private catalog.
window.fishosResearchCategory62=()=>researchCategory;
function tripFields(){
 const main=document.getElementById('main');if(!main)return;
 if(state.page==='trips')main.querySelectorAll('[data-trip-route]').forEach(el=>{const t=A(DATA.trips).find(x=>'trip-'+slug(x.id||'')===el.dataset.tripRoute);if(!t)return;const info=document.createElement('div');info.className='meta';info.textContent=[t.country||'Country not set',t.state||'State / district not set'].join(' · ');el.firstElementChild?.append(info)});
 if(!state.page.startsWith('trip-')||main.querySelector('#v62-trip-location'))return;
 const i=A(DATA.trips).findIndex(x=>'trip-'+slug(x.id||'')===state.page),t=DATA.trips?.[i];if(!t)return;
 const box=document.createElement('section');box.id='v62-trip-location';box.className='card';box.innerHTML='<h3>Country, state & coordinates</h3><p>'+E([t.country||'Country not set',t.state||'State / district not set'].join(' · '))+'</p><p>'+E(t.lat!=null&&t.lon!=null?t.lat+', '+t.lon:'Coordinates not set')+'</p><p class="muted">'+E([t.geography_note,t.coordinate_accuracy,t.coordinate_note].filter(Boolean).join(' · '))+'</p><button class="btn" id="v62-edit-geography">EDIT GEOGRAPHY</button>';main.append(box);box.querySelector('button').onclick=()=>editGeography(i);
}
function editGeography(i){const t=DATA.trips[i];if(!t)return;const uid=state.profile?.userId;
 openModal('TRIP GEOGRAPHY','<div class="form">'+[['country','Country'],['state','State / province / district'],['lat','Latitude'],['lon','Longitude']].map(([k,label])=>'<label>'+label+'<input id="v62-geo-'+k+'" value="'+E(t[k]??'')+'"></label>').join('')+'<label>Coordinate accuracy<select id="v62-geo-accuracy"><option value="approximate">Approximate area</option><option value="user-confirmed">User-confirmed location</option></select></label><button class="btn" id="v62-estimate">FILL MISSING FROM PLACE</button><button class="btn gold" id="v62-save-geo">SAVE GEOGRAPHY</button><p id="v62-geo-status" role="status"></p></div>');
 let note=t.coordinate_note||'';document.getElementById('v62-geo-accuracy').value=t.coordinate_accuracy==='user-confirmed'?'user-confirmed':'approximate';
 document.getElementById('v62-estimate').onclick=()=>{const draft={...t};for(const k of ['country','state','lat','lon'])draft[k]=document.getElementById('v62-geo-'+k).value.trim();const inferred=fishosGeography62.infer(draft,DATA.locations);for(const k of ['country','state','lat','lon'])document.getElementById('v62-geo-'+k).value=inferred[k]??'';note=inferred.coordinate_note||note;document.getElementById('v62-geo-status').textContent='Missing fields filled where recognizable. Estimates are regional references; check before saving.'};
 document.getElementById('v62-save-geo').onclick=async()=>{try{auth();if(uid!==state.profile.userId||DATA.trips[i]!==t)throw Error('Account or trip changed. Reopen the editor.');const lat=document.getElementById('v62-geo-lat').value.trim(),lon=document.getElementById('v62-geo-lon').value.trim();if((lat==='')!==(lon==='')||lat!==''&&(!Number.isFinite(Number(lat))||!Number.isFinite(Number(lon))||Math.abs(Number(lat))>90||Math.abs(Number(lon))>180))throw Error('Enter both valid latitude and longitude, or leave both blank.');Object.assign(t,{country:document.getElementById('v62-geo-country').value.trim(),state:document.getElementById('v62-geo-state').value.trim(),lat:lat===''?null:Number(lat),lon:lon===''?null:Number(lon),geography_note:'Reviewed in trip geography editor.',coordinate_accuracy:document.getElementById('v62-geo-accuracy').value,coordinate_note:note});persistData();const ok=await syncCloud();if(uid!==state.profile.userId)return;if(!ok)throw Error(state.cloudError||'Cloud save failed. Retry.');closeModal();render()}catch(e){document.getElementById('v62-geo-status').textContent=e.message}};
}
const prior=window.render;
const priorSide=window.side;
window.side=function(...args){const result=priorSide.apply(this,args),nav=document.getElementById('side');if(nav&&!nav.querySelector('#gh-nav')){const tracking=Array.from(nav.querySelectorAll('.nav')).find(x=>x.textContent.trim()==='Tracking');if(tracking){const group=document.createElement('div');group.id='gh-nav';group.className='navgroup';group.innerHTML='<button class="nav"><span class="ico"><img alt="" src="icons/rod.svg" width="18" height="18"></span><span>Gear Health</span></button>';group.querySelector('button').onclick=()=>go('gear-health');tracking.closest('.navgroup').after(group)}}return result};
window.render=function(...args){epoch++;photoUrls.forEach(URL.revokeObjectURL);photoUrls=[];
 const p=state.page;let result;
 if(p==='fly-photos'||sections[p]){side();mobile();window.topAuth?.();document.getElementById('main').innerHTML=p==='fly-photos'?photosPage():notesPage(p)}else result=prior.apply(this,args);
 document.querySelectorAll('[data-v62-go]').forEach(b=>b.onclick=()=>go(b.dataset.v62Go));
 if(sections[p]){document.getElementById('v62-add-note').onclick=()=>editNote();document.querySelectorAll('[data-v62-note]').forEach(b=>b.onclick=()=>editNote(b.dataset.v62Note))}
 if(p==='fly-photos'){document.getElementById('v62-upload-photos').onclick=()=>uploadCategory('Fly Photos');document.getElementById('v62-refresh-photos').onclick=()=>render();loadPhotos(epoch)}
 if(p==='research')researchControls();if(p==='upload'||p==='uploads')wireUpload();tripFields();return result;
};
setTimeout(()=>render(),0);
document.addEventListener('DOMContentLoaded',()=>render(),{once:true});
})();
