/* FishOS V58: Gear Health — inventory-linked, owner-scoped via field_settings. */
(function(){
const A=x=>Array.isArray(x)?x:[];
const H=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sections=[['Rods','rods','rod-list'],['Reels','reels','gear-reels'],['Lines','lines','gear-lines'],['Tippets','tippets','inventory'],['Fly Boxes','boxes','gear-fly-boxes'],['Fly Bags','bags','inventory'],['Nets','nets','inventory'],['Waders','waders','inventory']];
function items(cat){
 const g=DATA.component_gear||{};
 if(cat==='rods')return A(DATA.rods);
 if(cat==='reels')return A(g.reels);
 if(cat==='lines')return A(g.lines);
 if(cat==='tippets')return A(DATA.tippet_inventory);
 const aliases={boxes:['fly_boxes','flyBoxes','flyboxes'],bags:['fly_bags','flyBags'],nets:['nets','landing_nets'],waders:['waders','wading_gear']};
 for(const name of aliases[cat]||[])if(Array.isArray(g[name]))return g[name];
 return [];
}
function name(cat,x,i){return Array.isArray(x)?x.slice(0,3).filter(Boolean).join(' / ')||cat+' '+(i+1):typeof x==='string'?x:x?.name||x?.title||x?.model||cat+' '+(i+1)}
function code(cat,x,i){return cat+'|'+i+'|'+String(name(cat,x,i)).toLowerCase().replace(/[^a-z0-9]+/g,'-')}
function store(){DATA.field_settings=DATA.field_settings||{};return DATA.field_settings.gear_health||(DATA.field_settings.gear_health={})}
function page(){
const saved=store(),total=sections.reduce((n,s)=>n+items(s[1]).length,0),needs=Object.values(saved).filter(x=>['Poor','Replace'].includes(x.condition)).length;
return shell('Gear Health','Service, condition and replacement tracking linked to your private inventory.',
'<div class="toolbar"><button class="btn" data-f58nav="tracking">BACK TO TRACKING</button><button class="btn" data-f58nav="inventory">OPEN INVENTORY</button></div><div class="stats"><div class="stat"><b>'+total+'</b><span>Inventory records</span></div><div class="stat"><b>'+needs+'</b><span>Assessments marked Poor / Replace</span></div></div>'+
sections.map(([title,cat,route])=>{const rows=items(cat);return '<section class="card" style="margin-top:14px"><div class="toolbar"><h3>'+H(title)+' · '+rows.length+'</h3><button class="btn" data-f58nav="'+route+'">OPEN INVENTORY</button></div>'+
(rows.length?rows.map((x,i)=>{const v=saved[code(cat,x,i)]||{};return '<div class="row"><div><b>'+H(name(cat,x,i))+'</b><div class="meta">'+H([v.condition||'Not assessed',v.next_review?'Next review: '+v.next_review:'',v.replacement_year?'Replacement year: '+v.replacement_year:''].filter(Boolean).join(' · '))+'</div></div><button class="btn" data-f58assess="'+cat+':'+i+'">ASSESS</button></div>'}).join(''):'<p class="muted">No '+H(title.toLowerCase())+' in the linked inventory. Nothing has been invented; add items through Inventory first.</p>')+'</section>'}).join(''));
}
window.fishos58Assess=(cat,i)=>{
const item=items(cat)[i];if(item==null)return;
const k=code(cat,item,i),v=store()[k]||{};
openModal('GEAR ASSESSMENT — '+H(name(cat,item,i)),
'<div class="form"><label>CONDITION<select id="gh-condition">'+['Not assessed','Excellent','Good','Fair','Poor','Replace'].map(s=>'<option '+(v.condition===s?'selected':'')+'>'+s+'</option>').join('')+'</select></label><label>LAST SERVICED<input id="gh-serviced" type="date" value="'+H(v.last_serviced||'')+'"></label><label>NEXT REVIEW<input id="gh-review" type="date" value="'+H(v.next_review||'')+'"></label><label>REPLACEMENT YEAR<input id="gh-year" value="'+H(v.replacement_year||'')+'"></label><label>NOTES<textarea id="gh-notes">'+H(v.notes||'')+'</textarea></label><button class="btn gold" id="gh-save">SAVE ASSESSMENT</button></div>');
document.getElementById('gh-save').onclick=()=>{
const read=k=>document.getElementById('gh-'+k).value.trim();
store()[code(cat,item,i)]={condition:read('condition'),last_serviced:read('serviced'),next_review:read('review'),replacement_year:read('year'),notes:read('notes')};
if(typeof persistData==='function')persistData();closeModal();window.render();
};
};
function decorate(){
const main=document.getElementById('main');
if(main){
 main.querySelectorAll('[data-f58nav]').forEach(el=>el.onclick=()=>go(el.dataset.f58nav));
 main.querySelectorAll('[data-f58assess]').forEach(el=>el.onclick=()=>{const [cat,i]=el.dataset.f58assess.split(':');window.fishos58Assess(cat,Number(i))});
 if(state.page==='tracking'){
  let btn=main.querySelector('#gh-review-gear');
  if(!btn){btn=document.createElement('button');btn.id='gh-review-gear';btn.className='btn gold';btn.textContent='REVIEW GEAR';const bar=main.querySelector('.toolbar');if(bar)bar.appendChild(btn);else main.prepend(btn)}
  btn.onclick=()=>go('gear-health');
  const old=main.querySelector('#f51gear button');if(old){old.textContent='REVIEW GEAR';old.onclick=()=>go('gear-health')}
 }
}
const nav=document.getElementById('side');
if(nav&&!nav.querySelector('#gh-nav')){
const existing=[...nav.querySelectorAll('.nav')].find(x=>x.textContent.trim()==='Tracking');
if(existing){const group=document.createElement('div');group.id='gh-nav';group.className='navgroup';group.innerHTML='<button class="nav"><span class="ico"><img alt="" src="icons/rod.svg" width="18" height="18"></span><span>Gear Health</span></button>';group.querySelector('button').onclick=()=>go('gear-health');existing.closest('.navgroup')?.after(group)}
}
}
const prior=window.render;
window.render=function(...args){
 if(state.page==='gear-health'){
  if(typeof side==='function')side();if(typeof mobile==='function')mobile();if(typeof topAuth==='function')topAuth();
  const main=document.getElementById('main');if(main)main.innerHTML=page();decorate();return;
 }
 const res=prior.apply(this,args);decorate();if(state.page==='tracking')setTimeout(decorate,100);return res;
};
setTimeout(decorate,90);
})();