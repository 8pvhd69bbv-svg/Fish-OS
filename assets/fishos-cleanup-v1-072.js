/* Small navigation and existing-page refinements; saved records are untouched. */
(() => {
'use strict';
function systemLast(){
 const root=document.getElementById('side');if(!root)return;
 const buttons=Array.from(root.querySelectorAll('button.nav'));
 // Move the actual groups so their existing account/upload handlers survive.
 for(const name of ['Account','Upload']){
  const button=buttons.find(node=>node.textContent.trim()===name);
  const group=button?.closest('.navgroup');
  if(group&&group.parentElement===root)root.append(group);
 }
}
function refinePage(){
 const main=document.getElementById('main');if(!main)return;
 if(state.page==='home'){
  for(const card of main.querySelectorAll('.ui68-stats > .stat')){
   const label=card.querySelector('span')?.textContent.trim().toLowerCase();
   if(!['miles fished','miles traveled'].includes(label)||card.matches('a'))continue;
   const link=document.createElement('a');link.className=card.className+' cleanup72-distance';
   link.href='#tracking';link.title='View fishing and travel details in Tracking';
   while(card.firstChild)link.append(card.firstChild);
   link.onclick=event=>{
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();go('tracking');
   };
   card.replaceWith(link);
  }
 }
 if(state.page==='resources'){
  for(const button of main.querySelectorAll('button')){
   if(button.textContent.trim()==='STILLWATER GAME'&&/go\(['"]fishing-game['"]\)/.test(button.getAttribute('onclick')||''))button.remove();
  }
 }
}
const priorSide=window.side;
window.side=function(...args){const result=priorSide.apply(this,args);systemLast();return result};
const priorRender=window.render;
window.render=function(...args){const result=priorRender.apply(this,args);systemLast();refinePage();return result};
if(document.readyState!=='loading'){systemLast();refinePage()}
})();
