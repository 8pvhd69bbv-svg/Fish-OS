/* V1.069 review fixes: focused search, visible flows and map presentation. */
(function(){
'use strict';
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const excluded=k=>/^(links?|resources?|resource_links|research_links)$/i.test(k);
const routes={trips:'trips',journal:'journal',locations:'locations',rivers:'locations',flies:'fly-patterns',destinations:'destinations',rods:'rod-list',packing:'packing',buy:'purchases',knots:'knots',species:'fish-tracker',fish:'fish-tracker',trip_sessions:'tracking'};
const labels={trips:'Trip',journal:'Journal',locations:'Water',rivers:'Water',flies:'Fly',destinations:'Destination',rods:'Rod',packing:'Packing',buy:'Purchase',knots:'Knot',species:'Species',fish:'Fish',trip_sessions:'Session'};
function searchHits(data,query){
 const q=String(query??'').trim().toLowerCase(),hits=[],seen=new Set();if(!q)return hits;
 function add(kind,title,page,content){const text=String(content??'').replace(/\s+/g,' ').trim(),at=text.toLowerCase().indexOf(q);if(at<0)return;const type=labels[kind]||'Fish OS',key=type+'|'+title+'|'+page;if(seen.has(key))return;seen.add(key);const from=Math.max(0,at-65);let excerpt=text.slice(from,from+250);if(from)excerpt='…'+excerpt.slice(0,249);if(from+250<text.length)excerpt=excerpt.slice(0,249)+'…';hits.push({type,title:String(title??'Untitled').slice(0,100),page,excerpt:excerpt.slice(0,250)})}
 function scan(value,kind='DATA',depth=0){if(excluded(kind)||value==null||depth>6||hits.length>=250)return;
 if(Array.isArray(value)){value.forEach((v,i)=>{if(typeof v==='string')add(kind,v,routes[kind]||'research',v);else if(v&&typeof v==='object'){const title=String(v.id||v.name||v.title||v.place||v.location||'Record '+(i+1)),page=kind==='trips'?'trip-'+String(v.id||title).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''):routes[kind]||'research';const content=Object.entries(v).filter(([k,x])=>!excluded(k)&&(typeof x==='string'||typeof x==='number')).map(([,x])=>x).join(' • ');add(kind,title,page,title+' • '+content);Object.entries(v).forEach(([k,x])=>{if(x&&typeof x==='object')scan(x,k,depth+1)})}});return}
 if(typeof value==='object')Object.entries(value).forEach(([k,v])=>scan(v,k,depth+1));else if(typeof value==='string')add(kind,value,routes[kind]||'research',value)}
 scan(data);return hits.slice(0,30);
}
window.search=function(query){const box=document.getElementById('searchResults');if(!box)return;const q=String(query??'').trim();if(!q){box.classList.remove('show');box.innerHTML='';return}const hits=searchHits(DATA,q);box.innerHTML=hits.map(h=>'<div class="result" data-review69-hit><span class="tag">'+E(h.type)+'</span> <b>'+E(h.title)+'</b><div class="muted small">'+E(h.excerpt)+'</div></div>').join('')||'<div class="result muted">No indexed result.</div>';box.querySelectorAll('[data-review69-hit]').forEach((el,i)=>el.onclick=()=>{go(hits[i].page);box.classList.remove('show')});box.classList.add('show')};
function uniqueNames(names){const seen=new Set();return names.filter(name=>{const key=String(name).trim().replace(/\s+/g,' ').toLowerCase();if(seen.has(key))return false;seen.add(key);return true})}
function tidyMap(){window.fishMap?.eachLayer?.(layer=>{const popup=layer.getPopup?.(),content=popup?.getContent?.();if(typeof content!=='string'||!/^<b>\d+ saved locations?<\/b>/.test(content))return;const root=document.createElement('div');root.innerHTML=content;const list=root.querySelector('div');if(!list)return;const names=uniqueNames(list.innerHTML.split(/<br\s*\/?>/i));list.innerHTML=names.join('<br>');root.querySelector('b').textContent=names.length+' saved location'+(names.length===1?'':'s');popup.setContent(root.innerHTML)})}
const oldMap=window.initFishMap;window.initFishMap=function(...args){const result=oldMap?.apply(this,args);tidyMap();return result};
function arrange(){const release=document.getElementById('fishos-release-global');if(release)release.textContent='FISH OS V1.069';document.querySelectorAll('#main .tag').forEach(el=>{if(/^PAGE V[\d.]+ \/ /.test(el.textContent))el.textContent=el.textContent.replace(/^PAGE V[\d.]+/,'PAGE V1.069')});if(state.page!=='home')return;const main=document.getElementById('main'),flows=main?.querySelector('#fishos59flows'),map=main?.querySelector('#fishMap')?.closest('.ui68-map');if(flows&&map&&flows.previousElementSibling!==map)map.after(flows);tidyMap()}
const oldRender=window.render;window.render=function(...args){const result=oldRender.apply(this,args);arrange();return result};
window.fishosReview69={searchHits,uniqueNames,arrange};
document.addEventListener('DOMContentLoaded',arrange,{once:true});if(document.readyState!=='loading')arrange();
})();
