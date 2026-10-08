/* FishOS V60: Upcoming fishing opportunities for the existing Calendar header. */
(function(){
'use strict';
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arr=a=>Array.isArray(a)?a:[];
function dateOf(v){
 if(typeof v!=='string'||!/^\d{4}-\d\d-\d\d/.test(v.trim()))return null;
 const d=new Date(v.trim().slice(0,10)+'T12:00:00');return Number.isFinite(d.getTime())?d:null;
}
function ranking(v){
 const s=String(v||'').toLowerCase();
 if(/prime|excellent|best|peak/.test(s))return 3;
 if(/good|high/.test(s))return 2;
 if(/fair|moderate/.test(s))return 1;
 return 0;
}
function upcoming(){
 const now=new Date();now.setHours(0,0,0,0);
 const fromCalendar=arr(DATA.calendar_entries).filter(x=>x&&(/opportun|window|fish/i.test(String(x.type||x.category||''))||x.rating||x.priority));
 const fromSettings=arr(DATA.field_settings?.fishing_opportunities);
 const events=[...fromCalendar,...fromSettings].map(x=>({...x,_d:dateOf(x.date||x.start_date||'')}))
 .filter(x=>x._d&&x._d>=now).sort((a,b)=>ranking(b.rating||b.priority)-ranking(a.rating||a.priority)||a._d-b._d);
 const seen=new Set();
 return events.filter(x=>{const key=[x.date||x.start_date,x.title||x.name||x.fishery].join('|').toLowerCase();if(seen.has(key))return false;seen.add(key);return true}).slice(0,4);
}
function mount(){
 if(state.page!=='calendar')return;
 const main=document.getElementById('main');if(!main||main.querySelector('#fishos60upcoming'))return;
 const hero=main.querySelector('.hero');if(!hero)return;
 const slot=document.createElement('aside');slot.id='fishos60upcoming';slot.className='card';
 slot.style.cssText='max-width:325px;min-width:250px;flex:0 1 325px;padding:12px;margin:0;border-left:4px solid #527e99';
 const events=upcoming();
 slot.innerHTML='<div class="eyebrow">CALENDAR / UPCOMING</div><h3 style="margin:6px 0">Best Fishing Opportunities</h3>'+
 (events.length?events.map(x=>'<div style="padding:8px 0;border-bottom:1px solid #8bad9d"><b>'+E(x.title||x.name||x.fishery||'Fishing opportunity')+'</b><div class="muted small">'+E([x.date||x.start_date,x.rating||x.priority,x.place||x.location].filter(Boolean).join(' · '))+'</div></div>').join(''):'<p class="muted small">No future fishing opportunities with confirmed dates are saved yet. Upload or add them when ready.</p>')+
 '<button class="btn" id="fishos60addwindow" style="margin-top:7px">+ ADD FISHING WINDOW</button>';
 hero.appendChild(slot);
 slot.querySelector('#fishos60addwindow').onclick=()=>{if(typeof window.fishos42NewWindow==='function')window.fishos42NewWindow();else go('upload')};
}
const previous=window.render;window.render=function(...args){const r=previous.apply(this,args);mount();return r};setTimeout(mount,130);
})();