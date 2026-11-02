/* V1.076 map research tools use the shared renderer dispatcher. */
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
window.fishosRender725.register({after:add});setTimeout(add,70);
})();
