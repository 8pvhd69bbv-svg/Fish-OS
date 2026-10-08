/* FishOS V59 external map tools; no private data is transmitted automatically. */
(function(){
const links=[
 ['onX Maps','https://webmap.onxmaps.com/hunt/login'],
 ['Google Earth','https://earth.google.com/web/'],
 ['USGS National Map','https://apps.nationalmap.gov/viewer/']
];
function add(){
 if(state.page!=='maps')return;
 const main=document.getElementById('main');if(!main||main.querySelector('#f59maplinks'))return;
 const group=document.createElement('div');group.id='f59maplinks';group.className='card';group.style.marginBottom='14px';group.innerHTML='<h3>MAP RESEARCH TOOLS</h3><div class="toolbar">'+links.map(([name,url])=>'<a class="btn" href="'+url+'" target="_blank" rel="noopener noreferrer">'+name+'</a>').join('')+'</div><p class="muted small">External mapping tools open in a new tab. FishOS saved pins are not shared automatically.</p>';
 const map=main.querySelector('#fishMap');const card=map?.closest('.card');if(card)card.before(group);else main.appendChild(group);
}
const old=window.render;window.render=function(...a){const r=old.apply(this,a);add();return r};setTimeout(add,70);
})();