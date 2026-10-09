/* FishOS V60 USGS flows: 30-day discharge charts, configurable stations. */
(function(){
'use strict';
const stations=[
{id:'14303600',name:'Nestucca — Beaver'},
{id:'14092500',name:'Deschutes — Madras'},
{id:'14301500',name:'Wilson — Tillamook'},
{id:'14103000',name:'Deschutes — Moody'},
{id:'14305500',name:'Siletz — Siletz'},
{id:'14137000',name:'Sandy — Marmot'},
{id:'14091500',name:'Metolius — Grandview'},
{id:'14301300',name:'Miami — Garibaldi (historical site)'},
{id:'kilchis',name:'Kilchis — no USGS discharge gauge'}
];
const defaults=['14303600','14092500','14301500'];
const idList=new Set(stations.map(x=>x.id));
let serial=0;
function settings(){
 const fs=DATA.field_settings||{};
 const current=fs.flow_stations;
 if(Array.isArray(current)&&current.length===3)return current.map((x,i)=>idList.has(String(x))?String(x):defaults[i]);
 try{const saved=JSON.parse(fishStorage.getItem('fishos_flow_stations'));if(Array.isArray(saved)&&saved.length===3)return saved.map((x,i)=>idList.has(String(x))?String(x):defaults[i]);}catch(e){}
 return defaults.slice();
}
function controls(){
 if(state.page!=='home')return;
 const main=document.getElementById('main');if(!main)return;
 let box=main.querySelector('#fishos59flows');if(!box){box=document.createElement('section');box.className='card';box.id='fishos59flows';box.style.marginTop='14px';}
 if(!box.querySelector('#f59gaugegrid'))box.innerHTML='<h3>LOCAL RIVER FLOWS / USGS</h3><p class="muted">Measured discharge (cfs), last 30 days. Provisional observations; some stations may report late or have no data. Choose a different river in each panel.</p><div class="grid g3" id="f59gaugegrid"></div>';
 const today=Array.from(main.querySelectorAll('.card')).find(x=>x.querySelector('h3')?.textContent?.trim()==='Today');
 if(!box.isConnected){if(today)today.before(box);else main.appendChild(box);}
 const cfg=settings(),grid=box.querySelector('#f59gaugegrid');if(!grid||grid.dataset.initialized==='1')return;grid.dataset.initialized='1';grid.innerHTML='';
 cfg.forEach((id,i)=>{const pane=document.createElement('div');pane.className='card';pane.style.margin='0';
 pane.innerHTML='<label class="small">STATION <select aria-label="USGS river station" id="f59-select-'+i+'">'+stations.map(x=>'<option value="'+x.id+'" '+(id===x.id?'selected':'')+'>'+x.name+'</option>').join('')+'</select></label><div class="small" id="f59-value-'+i+'">Loading USGS…</div><canvas id="f59-graph-'+i+'" width="340" height="122" style="width:100%;height:122px" role="img" aria-label="30-day USGS discharge graph"></canvas><p class="small muted" id="f59-msg-'+i+'"></p><a class="btn" id="f59-link-'+i+'" target="_blank" rel="noopener">OPEN USGS STATION</a>';
 grid.appendChild(pane);pane.querySelector('select').onchange=e=>{const next=settings();next[i]=e.target.value;fishStorage.setItem('fishos_flow_stations',JSON.stringify(next));if(state.profile?.loggedIn&&state.privateHydrated){DATA.field_settings=DATA.field_settings||{};DATA.field_settings.flow_stations=next;persistData()}load(i,e.target.value,serial)}});
 const token=++serial;
 cfg.forEach((id,i)=>load(i,id,token));
}
function plot(canvas,series){
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const w=canvas.width,h=canvas.height;
 ctx.clearRect(0,0,w,h);ctx.fillStyle='#e7efe9';ctx.fillRect(0,0,w,h);
 if(series.length<2){ctx.fillStyle='#586b65';ctx.font='12px sans-serif';ctx.fillText('Not enough observations to graph',12,62);return}
 let lo=Math.min(...series.map(x=>x.v)),hi=Math.max(...series.map(x=>x.v));if(hi===lo)hi=lo+1;
 const t0=series[0].time,t1=series.at(-1).time;
 ctx.strokeStyle='#b5c5be';ctx.lineWidth=1;for(let j=1;j<=3;j++){ctx.beginPath();ctx.moveTo(34,7+(h-26)*j/4);ctx.lineTo(w-7,7+(h-26)*j/4);ctx.stroke()}
 ctx.fillStyle='#506e63';ctx.font='11px sans-serif';ctx.fillText(Math.round(hi).toLocaleString(),2,15);ctx.fillText(Math.round(lo).toLocaleString(),2,h-8);
 ctx.beginPath();series.forEach((x,j)=>{const px=35+(w-44)*(x.time-t0)/(t1-t0||1),py=8+(h-29)*(1-(x.v-lo)/(hi-lo));if(!j)ctx.moveTo(px,py);else ctx.lineTo(px,py)});ctx.lineWidth=2;ctx.strokeStyle='#477f9c';ctx.stroke();
}
async function load(i,id,token){
 const value=document.getElementById('f59-value-'+i),note=document.getElementById('f59-msg-'+i),canvas=document.getElementById('f59-graph-'+i),link=document.getElementById('f59-link-'+i);
 if(!value||!canvas)return;link.href='https://waterdata.usgs.gov/monitoring-location/USGS-'+id+'/';value.textContent='Loading USGS…';note.textContent='';
 if(id==='kilchis'){value.textContent='No USGS discharge station found';note.textContent='Kilchis is not measured by the Wilson gauge. Check the Oregon fishing report; select Wilson separately for nearby measured conditions.';link.href='https://myodfw.com/recreation-report/fishing-report/northwest-zone';link.textContent='OPEN OREGON FISHING REPORT';plot(canvas,[]);return}
 link.textContent='OPEN USGS STATION';
 const url='https://waterservices.usgs.gov/nwis/iv/?format=json&sites='+id+'&parameterCd=00060&period=P30D';
 try{
 const ctl=new AbortController(),timeout=setTimeout(()=>ctl.abort(),12000);
 let res;try{res=await fetch(url,{signal:ctl.signal})}finally{clearTimeout(timeout)}
 if(!res.ok)throw Error('USGS HTTP '+res.status);
 const json=await res.json();
 const series=(json.value?.timeSeries||[]).filter(x=>x.variable?.variableCode?.some(y=>y.value==='00060')).flatMap(x=>x.values?.flatMap(o=>o.value||[])||[])
 .map(x=>({time:Date.parse(x.dateTime),v:Number(x.value)})).filter(x=>Number.isFinite(x.time)&&Number.isFinite(x.v)&&x.v>=0).sort((a,b)=>a.time-b.time);
 if(token!==serial||!canvas.isConnected||document.getElementById('f59-select-'+i)?.value!==id)return;
 if(!series.length){value.textContent='No recent discharge readings';note.textContent='USGS returned no usable cfs observations for this station in the last 30 days.';plot(canvas,[]);return}
 const latest=series.at(-1),age=(Date.now()-latest.time)/3600000,stale=age>48;
 value.textContent=latest.v.toLocaleString()+' cfs '+(stale?'— STALE':'— latest observation');
 note.textContent=new Date(latest.time).toLocaleString()+' · '+(stale?'Reading is more than 48 hours old; not current.':'USGS provisional data.');
 plot(canvas,series);
 }catch(e){if(token!==serial||!canvas.isConnected)return;value.textContent='USGS data temporarily unavailable';note.textContent='Open station for current measurements. '+(e?.name==='AbortError'?'Request timed out.':'Live chart could not load.');plot(canvas,[])}
}
const prior=window.render;
window.render=function(...args){const r=prior.apply(this,args);controls();return r};
setTimeout(controls,100);
})();