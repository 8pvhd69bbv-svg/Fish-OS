/* FishOS V59: consolidate private files and their catalog, keep every original control. */
(function(){
function page(){
 const main=document.getElementById('main');if(!main||!['upload','uploads','upload-guide'].includes(state.page))return;
 const cards=[...main.querySelectorAll('.card')];
 const title=c=>String(c.querySelector(':scope > .titlebar')?.textContent||'').trim().toUpperCase();
 const files=cards.find(c=>title(c)==='PRIVATE FISH OS FILES'||title(c)==='YOUR PRIVATE FILES'||title(c)==='PRIVATE FILES');
 const catalog=cards.find(c=>title(c)==='PRIVATE FILE CATALOG');
 if(!catalog)return;
 if(files&&files!==catalog){
  const header=files.querySelector(':scope > .titlebar');if(header)header.textContent='PRIVATE FILES & CATALOG';
  const subsection=document.createElement('div');subsection.className='toolbar';subsection.style.marginTop='14px';
  subsection.innerHTML='<h3>FILE CATALOG / SEARCH / VERIFY</h3>';
  files.appendChild(subsection);
  while(catalog.firstChild){files.appendChild(catalog.firstChild)}
  catalog.remove();
 }else{
  const first=catalog.querySelector(':scope > .titlebar');if(first)first.textContent='PRIVATE FILES & CATALOG';
 }
}
const prior=window.render;window.render=function(...args){const res=prior.apply(this,args);page();setTimeout(page,115);return res};
setTimeout(page,150);
})();