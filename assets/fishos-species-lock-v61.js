/* FishOS V59 checklist safety lock. Locked by default to prevent accidental edits. */
(function(){
'use strict';
function locked(){
 const cloud=DATA.field_settings?.species_checklist_locked;
 if(typeof cloud==='boolean')return cloud;
 const local=fishStorage.getItem('fishos_species_checklist_locked');
 return local===null?true:local!=='false';
}
window.fishos59SetChecklistLocked=function(v){
 DATA.field_settings=DATA.field_settings||{};
 DATA.field_settings.species_checklist_locked=!!v;
 fishStorage.setItem('fishos_species_checklist_locked',String(!!v));
 if(state.profile?.loggedIn&&state.privateHydrated&&typeof persistData==='function')persistData();
 render();
};
function decorate(){
 if(!['fish-list','fish-tracker'].includes(state.page))return;
 const main=document.getElementById('main');if(!main)return;
 const bar=[...main.querySelectorAll('.toolbar')].find(el=>[...el.querySelectorAll('button')].some(btn=>/add species/i.test(btn.textContent)));
 const old=main.querySelector('#f51species');
 if(old)old.remove();
 if(!bar)return;
 let toggle=bar.querySelector('#f59-checklist-lock');
 if(!toggle){toggle=document.createElement('button');toggle.id='f59-checklist-lock';toggle.className='btn';toggle.type='button';const add=[...bar.querySelectorAll('button')].find(btn=>/add species/i.test(btn.textContent));if(add)add.after(toggle);else bar.prepend(toggle)}
 const isLocked=locked();
 toggle.textContent=isLocked?'EDIT SPECIES CHECKLIST — UNLOCK':'FINISH EDITING — LOCK';
 toggle.title=isLocked?'Enable species caught/target checkboxes temporarily':'Prevent accidental species caught/target changes';
 toggle.setAttribute('aria-pressed',String(!isLocked));
 toggle.onclick=()=>window.fishos59SetChecklistLocked(!locked());
 for(const checkbox of main.querySelectorAll('.fishgrid input[type="checkbox"],.fishrow input[type="checkbox"]')){checkbox.disabled=isLocked;checkbox.title=isLocked?'Checklist locked — use Unlock Checklist beside Add Species':''}
 let note=bar.querySelector('#f59-species-note');
 if(!note){note=document.createElement('small');note.id='f59-species-note';note.className='muted';bar.appendChild(note)}
 note.textContent=isLocked?'Caught/target checklist locked':'Editing enabled — lock when finished';
 if(!isLocked&&typeof window.fishos51Species==='function'&&!bar.querySelector('#f59-edit-custom')){
  const edit=document.createElement('button');edit.id='f59-edit-custom';edit.className='btn';edit.textContent='MANAGE CUSTOM SPECIES';edit.onclick=()=>window.fishos51Species();bar.appendChild(edit);
 }
 if(isLocked)bar.querySelector('#f59-edit-custom')?.remove();
}
const oldToggle=window.toggleFish;
window.toggleFish=function(...args){if(locked()){decorate();return}if(typeof oldToggle==='function')return oldToggle.apply(this,args)};
const prior=window.render;window.render=function(...args){const r=prior.apply(this,args);decorate();setTimeout(decorate,110);return r};
setTimeout(decorate,140);
})();