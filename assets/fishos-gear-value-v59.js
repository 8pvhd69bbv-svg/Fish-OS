/* FishOS V59 inventory valuation fix: rod prices are index 8 in the 9-column private inventory. */
(function(){
const money=v=>{const n=Number(String(v??'').replace(/[$,]/g,''));return Number.isFinite(n)&&n>0?n:0};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function update(){
 if(state.page!=='gear')return;
 const main=document.getElementById('main'),card=main?.querySelector('.rodvalueclick');if(!card)return;
 const rods=(Array.isArray(DATA.rods)?DATA.rods:[]).map(r=>({name:Array.isArray(r)?[r[2],r[3],r[0]].filter(Boolean).join(' '):r.name||r.model||'Rod',value:money(Array.isArray(r)?r.length>=10?r[9]:r[8]:r.price||r.cost)}));
 const rodTotal=rods.reduce((n,r)=>n+r.value,0);
 const gear=DATA.component_gear||{},components=Object.values(gear).flatMap(x=>Array.isArray(x)?x:[]);
 const componentTotal=components.reduce((n,x)=>n+money(x?.cost??x?.price),0);
 const total=rodTotal+componentTotal;
 const stat=card.querySelector('.stat');if(stat){stat.innerHTML='<b>$'+total.toLocaleString(undefined,{maximumFractionDigits:2})+'</b><span>Entered rod + component value</span><small class="muted">Rods $'+rodTotal.toLocaleString()+' · Reels, lines and other components $'+componentTotal.toLocaleString()+'</small>'}
 const chart=card.querySelector('.rodchart');if(chart){
 const top=rods.sort((a,b)=>b.value-a.value).slice(0,6),max=Math.max(1,...top.map(x=>x.value));
 chart.innerHTML=top.map(x=>'<div class="rodbar"><span>'+esc(x.name)+'</span><i style="width:'+Math.max(3,Math.round(x.value/max*100))+'%"></i><b>$'+x.value.toLocaleString()+'</b></div>').join('');
 }
 const note=[...card.querySelectorAll('p')].find(x=>x.textContent.includes('rod inventory'));if(note)note.textContent='Sum of entered rod prices and separately recorded component costs; blanks are excluded. This is listed value, not resale appraisal.';
}
const old=window.render;window.render=function(...args){const r=old.apply(this,args);update();setTimeout(update,110);return r};setTimeout(update,125);
})();