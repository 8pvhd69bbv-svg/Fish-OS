/* FishOS V60 — Restore Research hub; intake stays exclusively in Uploads. */
(function(){
'use strict';
const E=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const A=x=>Array.isArray(x)?x:[];
let token=0;
function links(){return A(DATA.links).map(x=>typeof x==='string'?{title:x}:x).filter(Boolean)}
function hub(){
const doors=[['DESTINATIONS','destinations'],['RESOURCES','resources'],['PODCAST NOTES','podcasts'],['LOCATIONS','locations'],['FLY PATTERNS','fly-patterns'],['MAPS','maps']];
return shell('Research','Field research, destinations, resources and reference library.',
 '<div class="grid g3">'+doors.map(x=>'<div class="door" data-v60research-page="'+E(x[1])+'" role="button" tabindex="0"><h3>'+x[0]+'</h3><p>Open research collection</p></div>').join('')+'</div>'+
 '<div class="grid g2" style="margin-top:14px">'+links().map(x=>'<div class="card"><h3>'+E(x.title||x.name||x.url||'Resource')+'</h3><p class="muted">'+E([x.notes,x.tags].filter(Boolean).join(' · '))+'</p>'+(typeof x.url==='string'&&/^https:\/\//i.test(x.url)?'<a class="btn" target="_blank" rel="noopener noreferrer" href="'+E(x.url)+'">OPEN SOURCE</a>':'')+'</div>').join('')+'</div>'+
 '<div id="v60research-files" class="card" style="margin-top:14px"><h3>Private uploaded research</h3><p class="muted" id="v60research-status">Loading items saved through Uploads…</p><div id="v60research-list"></div></div>');
}
function wire(){
document.querySelectorAll('#main [data-v60research-page]').forEach(el=>{const action=()=>go(el.dataset.v60researchPage);el.onclick=action;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();action()}}});
}
window.fishos60OpenResearchFile=async function(id){
const viewer=window.open('about:blank','_blank');if(viewer)viewer.document.body.textContent='Opening private research…';
try{
 if(!state.profile?.loggedIn||!window.supabaseClient||!state.profile.userId)throw Error('Sign in first.');
 const c=window.supabaseClient,uid=state.profile.userId;
 const q=await c.from('fishos_files').select('id,path,bucket_id,category').eq('user_id',state.profile.userId).eq('id',id).maybeSingle();
 if(q.error)throw q.error;
 if(state.profile.userId!==uid)throw Error('Account changed. Reopen the file.');
 if(!q.data)throw Error('Research file not found.');
 const link=await c.storage.from(q.data.bucket_id||'fishos-private').createSignedUrl(q.data.path,60);
 if(link.error)throw link.error;
 if(state.profile.userId!==uid)throw Error('Account changed. Reopen the file.');
 if(viewer)viewer.location.replace(link.data.signedUrl);else window.open(link.data.signedUrl,'_blank','noopener,noreferrer');
 }catch(error){if(viewer)viewer.document.body.textContent='Cannot open private research: '+(error.message||String(error));else alert(error.message||String(error))}
};
async function fetchResearch(t){
const status=document.getElementById('v60research-status'),target=document.getElementById('v60research-list');if(!target)return;
if(!state.profile?.loggedIn||!state.profile.userId||!window.supabaseClient){status.textContent='Sign in to view research previously uploaded through Uploads.';return}
try{
 const c=window.supabaseClient,uid=state.profile.userId;
 const result={data:[]};for(let offset=0;;offset+=200){const page=await c.from('fishos_files').select('id,original_name,category,notes,created_at').eq('user_id',uid).order('created_at',{ascending:false}).range(offset,offset+199);if(page.error)throw page.error;if(t!==token||state.profile.userId!==uid)return;result.data.push(...(page.data||[]));if((page.data||[]).length<200)break;}
 if(result.error)throw result.error;if(t!==token||state.page!=='research'||!target.isConnected||state.profile.userId!==uid)return;
 const selected=window.fishosResearchCategory62?.()||'All';const shown=(result.data||[]).filter(x=>selected==='All'||String(x.category||'Other').toLowerCase()===selected.toLowerCase());
 status.textContent=shown.length+' saved research files (stored privately in Supabase).';
 target.innerHTML=shown.map(x=>'<div class="row"><div><b>'+E(x.original_name||'Research file')+'</b><div class="meta">'+E([x.category,x.notes,x.created_at?.slice(0,10)].filter(Boolean).join(' · '))+'</div></div><button class="btn" data-v60research-id="'+E(x.id)+'">OPEN</button></div>').join('')||'<p class="muted">No uploaded files in this category. Choose a category on Uploads.</p>';
 target.querySelectorAll('[data-v60research-id]').forEach(el=>el.onclick=()=>window.fishos60OpenResearchFile(el.dataset.v60researchId));
 }catch(err){if(t===token&&status)status.textContent='Research catalog unavailable: '+(err.message||String(err))}
}
function setUploadCategory(){
 if(state.page!=='upload'&&state.page!=='uploads')return;
 for(const id of ['f40category','v34Category']){const select=document.getElementById(id);if(!select)continue;
  for(const category of ['Research','Fishing Opportunities'])if(![...select.options].some(o=>o.value===category)){const option=document.createElement('option');option.value=category;option.textContent=category==='Research'?'Research (visible in Research tab)':category;select.add(option)}
 }
 const main=document.getElementById('main');if(!main||main.querySelector('#v60uploadResearchBtn'))return;
 const category=main.querySelector('#f40category')||main.querySelector('#v34Category');if(!category)return;
 const quick=document.createElement('button');quick.id='v60uploadResearchBtn';quick.className='btn';quick.textContent='UPLOAD RESEARCH';quick.title='Select Research category for your next private upload';
 quick.onclick=()=>{const c=document.getElementById('f40category')||document.getElementById('v34Category');if(!c)return;c.value='Research';if(document.getElementById('f40mode')&&typeof window.fishos40Mode==='function')window.fishos40Mode('upload');const file=main.querySelector('#f40files')||main.querySelector('#fishos37Files');file?.scrollIntoView({behavior:'smooth',block:'center'});file?.focus();};
 const toolbar=category.closest('.card')?.querySelector('.toolbar');if(toolbar)toolbar.appendChild(quick);else category.after(quick);
}
const prior=window.render;
window.render=function(...args){
 if(state.page==='research'){
  if(typeof side==='function')side();if(typeof mobile==='function')mobile();if(typeof topAuth==='function')topAuth();
  const root=document.getElementById('main');if(root)root.innerHTML=hub();
  wire();fetchResearch(++token);return;
 }
 const result=prior.apply(this,args);
 setUploadCategory();return result;
};
setTimeout(()=>{if(state.page==='research'){window.render()}else setUploadCategory()},100);
})();
