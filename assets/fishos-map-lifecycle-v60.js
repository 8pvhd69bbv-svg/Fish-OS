/* FishOS V60 — resilient Leaflet mount after route transitions (no manual refresh). */
(function(){
'use strict';
let watchId=0,frame=0;
function relevant(){return state.page==='maps'||state.page==='home'}
function mount(){
 if(!relevant())return;
 const el=document.getElementById('fishMap');
 if(!el)return;
 if(!window.L||typeof window.initFishMap!=='function'){
   el.dataset.mapWait='1';
   if(!window.L)el.textContent='Loading map engine…';
   return;
 }
 if(el.dataset.ready==='v46'&&window.fishMap?._container===el){
  requestAnimationFrame(()=>window.fishMap?.invalidateSize());
  return;
 }
 if(el.dataset.ready==='v46'&&window.fishMap?._container!==el)delete el.dataset.ready;
 try{
   window.initFishMap();
   if(window.fishMap?._container===el){
     delete el.dataset.mapWait;
     for(const n of [90,350,900])setTimeout(()=>{if(el.isConnected&&window.fishMap?._container===el)window.fishMap.invalidateSize()},n);
   }
 }catch(error){
   console.warn('FishOS map initialization',error);
   if(!el.querySelector('.leaflet-container'))el.textContent='Map is not available yet. Open Maps to retry.';
 }
}
function schedule(){
 const token=++watchId;
 for(const delay of [0,60,150,350,800,1500,2800]){
  setTimeout(()=>{if(token!==watchId||!relevant())return;mount()},delay);
 }
}
const renderBefore=window.render;
window.render=function(...args){const result=renderBefore.apply(this,args);schedule();return result};
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&relevant())schedule()});
window.addEventListener('load',schedule,{once:true});
setTimeout(schedule,100);
})();