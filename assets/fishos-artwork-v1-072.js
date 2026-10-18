/* Browser feedback: supplied navigation art and functional gear illustration. */
(()=>{'use strict';
function navigation(){
 document.querySelectorAll('#side button.nav').forEach(button=>{
 const label=button.textContent.trim();let markup='';
 if(label==='Fish Tracker')markup='<span class="nav-brown72" aria-hidden="true"></span>';
 else if(/^(Fly Pattern Index|Fly Patterns)$/.test(label))markup='<span class="nav-fly72" aria-hidden="true"></span>';
 else {const icons={'Water Profile':'map','Season Recap':'trophy','Pre-trip Check':'backpack'};if(icons[label])markup='<img src="icons/'+icons[label]+'.svg" alt="" width="26" height="26">'}
 if(!markup)return;
 let icon=button.querySelector('.ico');if(!icon){icon=document.createElement('span');icon.className='ico';button.prepend(icon)}
 icon.innerHTML=markup;icon.classList.add('nav-art72');
 });
}
function arrange(){
 navigation();const wizard=document.querySelector('#fishAIBar button');
 if(wizard){wizard.innerHTML='<img src="assets/wyatt-cutout-v1-072.png" alt="">';wizard.title='Wyatt the Wizard AI Help';wizard.setAttribute('aria-label','Wyatt the Wizard AI Help')}
 if(state.page==='gear'){
 document.querySelector('#main .fishos-rods71')?.remove();
 const scene=document.querySelector('#main .rodscene'),svg=scene?.querySelector(':scope > svg');
 if(svg){const img=document.createElement('img');img.src='assets/fly-rod-detail.png';img.alt='Fly rod anatomy: butt cap, reel seat, cork handle, rod blank, guide and fly reel';img.className='rod-anatomy72';svg.replaceWith(img)}
 }
 const release=document.getElementById('fishos-release-global');if(release)release.textContent='FISH OS V1.072';
 document.querySelectorAll('#main .tag').forEach(el=>{if(/^PAGE V[\d.]+ \/ /.test(el.textContent))el.textContent=el.textContent.replace(/^PAGE V[\d.]+/,'PAGE V1.072')});
}
const oldSide=window.side;window.side=function(...args){const result=oldSide.apply(this,args);navigation();return result};
const oldRender=window.render;window.render=function(...args){const result=oldRender.apply(this,args);arrange();return result};
document.addEventListener('DOMContentLoaded',arrange,{once:true});if(document.readyState!=='loading')arrange();
})();
