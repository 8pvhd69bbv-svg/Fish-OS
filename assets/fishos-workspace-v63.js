/* Fish OS V63: navigation, editable journals, inventory and page references. */
(function(){
'use strict';
const A=x=>Array.isArray(x)?x:[],E=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categories=[['packs','Packs'],['reels','Reels'],['lines','Lines'],['fly_boxes','Fly Boxes'],['fly_bags','Fly Bags'],['nets','Nets'],['waders','Waders']];
const healthCat={packs:'packs',reels:'reels',lines:'lines',fly_boxes:'boxes',fly_bags:'bags',nets:'nets',waders:'waders'};
function journalRows(){return A(DATA.journal).map((entry,index)=>({entry,index})).sort((a,b)=>(Date.parse(b.entry.date)||0)-(Date.parse(a.entry.date)||0)||a.index-b.index)}
function guard(uid){if((state.profile?.userId||'')!==uid)throw Error('Account changed. Reopen the editor.');if(state.profile?.loggedIn&&!state.privateHydrated)throw Error('Wait for your account to finish loading.');}
async function save(uid){guard(uid);persistData();if(state.profile?.loggedIn){const ok=await syncCloud();guard(uid);if(!ok)throw Error(state.cloudError||'Cloud save failed. Retry saving.');}closeModal();render();}
function input(id,label,value='',type='text'){return '<label>'+E(label)+'<input id="v63-'+id+'" type="'+type+'" value="'+E(value)+'"></label>'}
function area(id,label,value=''){return '<label>'+E(label)+'<textarea id="v63-'+id+'">'+E(value)+'</textarea></label>'}
const read=id=>document.getElementById('v63-'+id).value.trim();
function form(title,body,handler){openModal(title,'<div class="form">'+body+'<button class="btn gold" id="v63-save">SAVE</button><p id="v63-status" role="status"></p></div>');document.getElementById('v63-save').onclick=async()=>{const button=document.getElementById('v63-save');button.disabled=true;try{await handler()}catch(e){const status=document.getElementById('v63-status');if(status)status.textContent=e.message}finally{if(button.isConnected)button.disabled=false}}}
function editJournal(index){
 const uid=state.profile?.userId||'';let original=index==null?null:A(DATA.journal)[index];if(index!=null&&!original)return;
 let x=original||{};const csv=v=>A(v).length?A(v).join(', '):String(v||'');
 form(original?'EDIT JOURNAL ENTRY':'NEW JOURNAL ENTRY',input('title','Title',x.title)+input('date','Date',x.date||localISO(new Date()),'date')+input('location','Water / location',x.location)+input('species','Species (comma separated)',csv(x.species))+input('tactics','Flies / tactics (comma separated)',csv(x.tactics))+area('observed','Observations and conditions',x.observed)+area('result','Result / hypothesis',x.result)+area('notes','Notes and follow-up',x.notes),async()=>{
  guard(uid);if(!read('title'))throw Error('Enter a title.');DATA.journal=A(DATA.journal);if(original&&DATA.journal[index]!==original)throw Error('This record changed. Reopen it before saving.');
  const entry={...x,title:read('title'),date:read('date'),location:read('location'),species:read('species').split(',').map(s=>s.trim()).filter(Boolean),tactics:read('tactics').split(',').map(s=>s.trim()).filter(Boolean),observed:read('observed'),result:read('result'),notes:read('notes')};
  if(original)DATA.journal[index]=entry;else {entry.id=crypto.randomUUID();DATA.journal.unshift(entry);index=0;}original=entry;x=entry;await save(uid);
 });
}
function journalPage(){return shell('Journal','Your field notes, newest dated entries first. Select an entry to edit it. Trips keep their full logs on the Trips page.','<div class="toolbar"><button class="btn gold" id="v63-new-journal">+ NEW ENTRY</button><button class="btn" data-v63-go="trips">TRIP LOGS</button></div><div class="list">'+journalRows().map(({entry:x,index})=>'<button class="row" style="text-align:left;color:inherit" data-v63-journal="'+index+'"><div><div class="title">'+E(x.title||x.id||'Untitled entry')+'</div><div class="meta">'+E([x.date||'Undated',x.location].filter(Boolean).join(' · '))+'</div><p>'+E(String(x.observed||x.notes||'').slice(0,250))+'</p></div></button>').join('')+'</div>'+(!A(DATA.journal).length?'<div class="empty">No journal entries yet.</div>':''))}
function gearRows(){return categories.flatMap(([cat,label])=>A(DATA.component_gear?.[cat]).map((item,index)=>({cat,label,item,index})).filter(x=>x.item&&typeof x.item==='object'&&!Array.isArray(x.item)))}
function editGear(cat,index){
 const uid=state.profile?.userId||'';let original=index==null?null:A(DATA.component_gear?.[cat])[index],x=original||{};
 if(index!=null&&!original)return;
 form(original?'EDIT INVENTORY ITEM':'ADD INVENTORY ITEM','<label>Category<select id="v63-category" '+(original?'disabled':'')+'>'+categories.map(([key,label])=>'<option value="'+key+'" '+(key===(cat||'packs')?'selected':'')+'>'+label+'</option>').join('')+'</select></label>'+input('name','Item / model name',x.name)+input('brand','Brand',x.brand)+input('cost','Purchase cost ($)',x.cost??'','number')+input('line-class','Reel / line class (e.g. 5/6 wt, 7+ wt, 8/9/10 wt)',x.line_class||(typeof x.weight==='string'&&/wt|\//i.test(x.weight)?x.weight:''))+input('weight','Physical weight (oz)',x.weight_oz??(!['reels','lines'].includes(cat)?x.weight??'':''),'number')+input('purchased','Purchase date',x.purchase_date,'date')+input('replacement','Planned replacement date',x.replacement_date,'date')+input('replacement-cost','Expected replacement cost ($)',x.replacement_cost??'','number')+'<label>Condition<select id="v63-condition">'+['Not assessed','Excellent','Good','Fair','Poor','Replace'].map(c=>'<option '+(x.condition===c?'selected':'')+'>'+c+'</option>').join('')+'</select></label>'+area('gear-notes','Notes',x.notes),async()=>{
  guard(uid);if(!read('name'))throw Error('Enter an item name.');for(const id of ['cost','weight','replacement-cost'])if(read(id)!==''&&(!Number.isFinite(Number(read(id)))||Number(read(id))<0))throw Error('Costs and weight must be nonnegative numbers.');
  const key=read('category');DATA.component_gear=DATA.component_gear||{};const arr=DATA.component_gear[key]=A(DATA.component_gear[key]);if(original&&arr[index]!==original)throw Error('This item changed. Reopen it before saving.');
  const entry={...x,id:x.id||'gear63-'+crypto.randomUUID(),name:read('name'),brand:read('brand'),cost:read('cost')===''?'':Number(read('cost')),line_class:read('line-class'),weight_oz:read('weight')===''?'':Number(read('weight')),weight:['reels','lines'].includes(key)?read('line-class'):(read('weight')===''?'':Number(read('weight'))),purchase_date:read('purchased'),replacement_date:read('replacement'),replacement_cost:read('replacement-cost')===''?'':Number(read('replacement-cost')),condition:read('condition'),notes:read('gear-notes')};
  const oldIndex=original?index:arr.length,category=healthCat[key],legacy=category+'|'+oldIndex+'|'+String(x.name||x.title||x.model||category+' '+(oldIndex+1)).toLowerCase().replace(/[^a-z0-9]+/g,'-');
  DATA.field_settings=DATA.field_settings||{};const health=DATA.field_settings.gear_health=DATA.field_settings.gear_health||{},brands=DATA.field_settings.gear_brands=DATA.field_settings.gear_brands||{};
  const nextKey=String(entry.id).startsWith('gear63-')?category+'|'+entry.id:category+'|'+oldIndex+'|'+entry.name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
  health[nextKey]={...(health[legacy]||{}),...(health[nextKey]||{}),condition:entry.condition,brand:entry.brand};brands[nextKey]=entry.brand;if(legacy!==nextKey){delete health[legacy];delete brands[legacy]}
  if(original)arr[index]=entry;else {index=arr.length;arr.push(entry);}original=entry;x=entry;await save(uid);
 });
}
function inventoryPanel(){return '<section class="card" id="v63-inventory"><h3>ADD / EDIT YOUR GEAR</h3><p>Purchase dates, condition and replacement plans appear in Gear Health.</p><div class="toolbar"><button class="btn gold" id="v63-add-gear">+ ADD GEAR</button><button class="btn" data-v63-go="gear-health">GEAR HEALTH</button></div><div class="list">'+gearRows().map(({cat,label,item:x,index})=>'<button class="row" style="text-align:left;color:inherit" data-v63-gear="'+cat+':'+index+'"><span><b>'+E(x.name||x.model||'Unnamed item')+'</b><span class="meta"> · '+E(label+' · '+(x.brand||'Brand unassigned'))+'</span></span><span>EDIT</span></button>').join('')+'</div></section>'}
function toolsPage(){return shell('Owner Tools','Tools for your own account and clear references when discussing changes.','<div class="card"><h3>Page references</h3><label><input type="checkbox" id="v63-reference-toggle" '+(references()?'checked':'')+'> Show a reference on every page</label><p>Example: V63 / journal. Share the reference and the button label when requesting a change.</p><p>Tying Knowledge: #tying-knowledge. Casting pages: #casting-drills, #casting-spey, #casting-saltwater.</p></div><div class="card"><h3>Your workspace</h3><div class="toolbar"><button class="btn" data-v63-go="upload">UPLOAD / BACKUP TOOLS</button><button class="btn" data-v63-go="account-settings">ACCOUNT SETTINGS</button><a class="btn" href="https://github.com/8pvhd69bbv-svg/Fish-OS/blob/main/DEVELOPMENT.md" target="_blank" rel="noopener">CURRENT HANDOFF</a><a class="btn" href="https://github.com/8pvhd69bbv-svg/Fish-OS/blob/main/OPEN_TICKETS.md" target="_blank" rel="noopener">TICKETS</a></div><p>'+E(state.profile?.loggedIn?'Signed in'+(state.privateHydrated?' · Account records loaded':' · Loading account records'):'Signed out · Sign in through Account to manage your private records.')+'</p><p>These tools manage your own account. They do not grant access to another user’s records.</p></div>')}
function references(){return fishStorage.getItem('fishos_page_references')==='1'}
const priorGo=window.go;
history.replaceState({...history.state,fishos63:0},'',location.href);
window.go=function(p){const before=state.page,n=Number(history.state?.fishos63)||0;const result=priorGo.apply(this,arguments);if(state.page!==before)history.replaceState({...history.state,fishos63:n+1},'',location.href);return result};
window.back=function(){if(Number(history.state?.fishos63)>0){history.back();return}if(state.page!=='home')go('home')};
const priorSide=window.side;
window.side=function(...args){const result=priorSide.apply(this,args),root=document.getElementById('side');if(!root)return result;
 const names=['Dashboard','Trips','Journal','Locations','Maps','Calendar','Tracking','Gear Health','Fish Tracker'],buttons=Array.from(root.querySelectorAll('button.nav'));
 const selected=names.map(name=>buttons.find(b=>b.textContent.trim()===name)).filter(Boolean);
 selected.forEach(b=>{const g=b.closest('.navgroup');b.remove();if(g&&!g.querySelector('button'))g.remove()});
 const holder=document.createDocumentFragment();selected.forEach(b=>{const label=b.textContent.trim(),g=document.createElement('div');g.className='navgroup';if(label==='Gear Health')g.id='gh-nav';if(label==='Trips'||label==='Tracking'){const h=document.createElement('div');h.className='navlabel';h.textContent=label==='Trips'?'CORE':'TRACKING';g.append(h)}if(label==='Maps')b.querySelector('span:last-child').textContent='Map';g.append(b);holder.append(g)});root.prepend(holder);
 if(!root.querySelector('#v63-owner-nav')){const g=document.createElement('div');g.className='navgroup';g.id='v63-owner-nav';g.innerHTML='<button class="nav">Owner Tools</button>';g.querySelector('button').onclick=()=>go('owner-tools');root.append(g)}return result;
};
const priorRender=window.render;
window.render=function(...args){if(document.readyState==='loading')return;let result;
 if(state.page==='journal'||state.page==='owner-tools'){side();mobile();window.topAuth?.();document.getElementById('main').innerHTML=state.page==='journal'?journalPage():toolsPage()}else result=priorRender.apply(this,args);
 const main=document.getElementById('main');if(!main)return result;
 if(state.page==='inventory'&&!main.querySelector('#v63-inventory'))main.insertAdjacentHTML('afterbegin',inventoryPanel());
 main.querySelectorAll('[data-v63-go]').forEach(b=>b.onclick=()=>go(b.dataset.v63Go));
 main.querySelectorAll('[data-v63-journal]').forEach(b=>b.onclick=()=>editJournal(Number(b.dataset.v63Journal)));
 main.querySelectorAll('[data-v63-gear]').forEach(b=>b.onclick=()=>{const [cat,i]=b.dataset.v63Gear.split(':');editGear(cat,Number(i))});
 const j=main.querySelector('#v63-new-journal');if(j)j.onclick=()=>editJournal();const g=main.querySelector('#v63-add-gear');if(g)g.onclick=()=>editGear();
 const toggle=main.querySelector('#v63-reference-toggle');if(toggle)toggle.onchange=()=>{fishStorage.setItem('fishos_page_references',toggle.checked?'1':'0');render()};
 if(references()){const badge=document.createElement('div');badge.className='tag';badge.textContent='PAGE V63 / '+state.page;main.prepend(badge)}
 return result;
};
document.addEventListener('DOMContentLoaded',()=>render(),{once:true});setTimeout(()=>render(),0);
})();
