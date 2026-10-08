/* FishOS V60: Dashboard design V9, preserving original V8 layout with integrated USGS flow chart slots. */
(function(){
const A=x=>Array.isArray(x)?x:[];
const E=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function page(){
const trips=A(DATA.trips),journal=A(DATA.journal),sessions=A(DATA.trip_sessions),locations=A(DATA.locations),today=new Date();
const hours=[...trips,...sessions].reduce((n,x)=>n+(Number(x.hours)||0),0);
const miles=[...trips,...sessions].reduce((n,x)=>n+(Number(x.miles_logged??x.miles_fished??x.distance_miles??0)||0),0);
const days=new Set([...journal,...sessions].map(x=>x.date).filter(Boolean)).size;
function spanDays(raw){
 const str=String(raw||'').replace(/[–—]/g,'-').trim();
 if(/^\d{4}$/.test(str))return 0;
 let m=str.match(/^(\d{4}-\d{2}-\d{2})\s*-\s*(\d{4}-\d{2}-\d{2})$/);
 if(m){const a=new Date(m[1]),b=new Date(m[2]);return Math.max(0,Math.min(30,Math.round((b-a)/86400000)+1))}
 if(/^\d{4}-\d{2}-\d{2}$/.test(str))return 1;
 m=str.match(/^([A-Za-z]{3,9})\s+(\d{1,2})\s*-\s*([A-Za-z]{3,9})?\s*(\d{1,2}),?\s*(20\d{2})$/);
 if(m){const a=new Date(m[1]+' '+m[2]+', '+m[5]),b=new Date((m[3]||m[1])+' '+m[4]+', '+m[5]);return Math.max(0,Math.min(30,Math.round((b-a)/86400000)+1))}
 m=str.match(/^[A-Za-z]{3,9}\s+\d{1,2},?\s+20\d{2}$/);
 if(m)return 1;
 return 0;
}
const estDays=trips.filter(x=>/completed|historical/i.test(String(x.status||''))).reduce((n,x)=>n+spanDays(x.date||x.start_date),0);
const estHours=estDays*6;
const waters=new Set(locations.map(x=>String(x.name||'').toLowerCase().trim()).filter(Boolean)).size;
const future=trips.map(x=>({x,d:new Date(x.start_date||x.date||'')})).filter(z=>Number.isFinite(+z.d)&&z.d>=new Date(today.toDateString())).sort((a,b)=>a.d-b.d);
const next=future[0]?.x;
const stat=[[trips.length,'Trips','trips'],[days,'Days fished','journal',estDays+' estimated from completed trip spans'],[hours.toFixed(1),'Hours fished','tracking',estHours+' estimated at 6h/day'],[miles?miles.toFixed(1):'—','Miles logged','trips'],[A(DATA.fish).length,'Fish logged','tracking'],[A(state.fishCaught).length,'Species caught','fish-tracker'],[waters,'Waters','locations']];
const cards=[['NEXT TRIP',next?.id||'No upcoming trip',next?[next.date,next.place].filter(Boolean).join(' • '):'Plan the next trip','trips'],['FISH','Fish Tracker','Species checklist and field notes','fish-tracker'],['RESEARCH','World Destination Atlas','Country research and destinations','destinations'],['SPECIES','Species Checklist',A(state.fishCaught).length+' marked caught','fish-list'],['GEAR','Rod Vault',A(DATA.rods).length+' rods recorded','rod-list'],['FIELD','Packing & Planning','Prepare your next fishing day','packing']];
const btn=(label,route)=>'<button class="btn" data-v58route="'+route+'">'+label+'</button>';
return '<div class="hero"><div><div class="eyebrow">PRIVATE FISHING COMMAND CENTER / DASHBOARD V9</div><h1>FISH OS</h1><p>A wormhole into the entire FLYS FOR FISH world: trips, fish, waters, flies, gear, research and future destinations.</p></div><button class="btn gold" onclick="quick()">+ QUICK ADD</button></div>'+
'<div class="stats dashstats">'+stat.map(x=>'<div class="stat link" role="button" tabindex="0" data-v58route="'+x[2]+'"><b>'+E(x[0])+'</b><span>'+E(x[1])+'</span>'+(x[3]?'<small style="display:block;font-size:10px;color:#376e60;line-height:1.3">Reported '+E(x[0])+' · Est. '+E(x[3])+'</small>':'')+'</div>').join('')+'</div>'+
'<div class="grid g3" style="margin-top:14px">'+cards.map(x=>'<div class="door" role="button" tabindex="0" data-v58route="'+x[3]+'"><div class="kicker">'+E(x[0])+'</div><h3>'+E(x[1])+'</h3><p>'+E(x[2])+'</p></div>').join('')+'</div>'+
'<div class="grid g2" style="margin-top:14px"><div class="card"><h3>Live fishing map</h3><div id="fishMap" class="map" style="min-height:330px"></div>'+btn('OPEN MAPS','maps')+'</div><div class="card"><h3>Big fish / recent</h3>'+
(journal.length?journal.slice(-3).reverse().map(x=>'<div class="row"><div><b>'+E(x.title||x.id||x.place||'Journal entry')+'</b><div class="meta">'+E([x.date,x.location||x.place].filter(Boolean).join(' · '))+'</div></div></div>').join(''):'<p class="muted">No journal entries yet.</p>')+btn('OPEN JOURNAL','journal')+'</div></div>'+
'<section class="card" id="fishos59flows" style="margin-top:14px"><h3>LOCAL RIVER FLOWS / USGS</h3><p class="muted">Nestucca, Deschutes and Wilson river charts. Select any available station in each panel.</p><div class="grid g3" id="f59gaugegrid"><div class="muted">Loading river charts…</div></div></section>'+'<div class="card" style="margin-top:14px"><h3>Today</h3><p>'+E(today.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'}))+' · '+future.length+' upcoming trips</p>'+btn('OPEN LIVE CALENDAR','calendar')+'</div>';
}
const prior=window.render;
window.render=function(...args){
if(state.page!=='home')return prior.apply(this,args);
if(typeof side==='function')side();if(typeof mobile==='function')mobile();if(typeof topAuth==='function')topAuth();
document.getElementById('main').innerHTML=page();
document.querySelectorAll('#main [data-v58route]').forEach(el=>{const fn=()=>go(el.dataset.v58route);el.onclick=fn;el.onkeydown=ev=>{if(ev.key==='Enter'){ev.preventDefault();fn()}}});
setTimeout(()=>{if(state.page==='home')try{window.initFishMap?.()}catch(e){console.warn('Dashboard map',e)}},160);
};
setTimeout(()=>{if(state.page==='home')window.render()},90);
})();