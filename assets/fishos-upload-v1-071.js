/* FISH-025: stage research documents and review links through existing account flows. */
(() => {
'use strict';
const ACCEPT='.pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain';
function documents(files){
 const items=Array.from(files||[]);
 if(!items.length)throw Error('Choose a PDF, DOC, DOCX or TXT file.');
 const unsupported=items.filter(file=>! /\.(pdf|docx?|txt)$/i.test(file.name||''));
 if(unsupported.length)throw Error('Unsupported research file: '+unsupported.map(file=>file.name).join(', ')+'. Choose PDF, DOC, DOCX or TXT. Other files can use the main Upload area.');
 return items;
}
function webLink(text){
 const lines=String(text||'').split(/\r?\n/).map(line=>line.trim()).filter(line=>line&&!line.startsWith('#'));
 if(lines.length!==1)throw Error('Add one website link at a time, starting with https:// or http://.');
 let url;try{url=new URL(lines[0])}catch{throw Error('Enter a valid website link starting with https:// or http://.');}
 if(!['https:','http:'].includes(url.protocol)||!url.hostname||url.username||url.password)throw Error('Use an http:// or https:// website link without embedded sign-in details.');
 return url.href;
}
function dropped(transfer){
 // Files take priority: browsers may also provide their local file URL as text.
 if(transfer?.files?.length)return {files:documents(transfer.files)};
 const text=transfer?.getData('text/uri-list')||transfer?.getData('text/plain')||'';
 return {url:webLink(text)};
}
function stage(files){
 const selected=documents(files),input=document.getElementById('f40files');
 if(!input||typeof window.fishos40Mode!=='function')throw Error('Private upload controls are unavailable. Reopen Upload and try again.');
 // Build a FileList before changing the mode or existing selection.
 const transfer=new DataTransfer();selected.forEach(file=>transfer.items.add(file));
 window.fishos40Mode('upload');input.files=transfer.files;
 for(const id of ['f40category','v34Category']){
  const select=document.getElementById(id);if(!select)continue;
  if(!Array.from(select.options).some(option=>option.value==='Research')){const option=document.createElement('option');option.value='Research';option.textContent='Research';select.add(option)}
  select.value='Research';
 }
 input.dispatchEvent(new Event('change',{bubbles:true}));
 const button=document.querySelector('[onclick="fishos40Do()"]');
 if(button){button.hidden=false;button.textContent='Upload';button.focus()}
 const status=document.getElementById('f40result');
 if(status)status.textContent=selected.length+' research document(s) selected. Review category and notes, then choose Upload to save privately.';
 return selected.length;
}
function reviewLink(text){
 const url=webLink(text);
 if(!state.profile?.loggedIn||!state.profile.userId||!state.privateHydrated)throw Error('Sign in and wait for your account to load before adding a research link.');
 if(typeof window.fishos39AddLink!=='function')throw Error('Resource link editor is unavailable. Reopen Upload and try again.');
 window.fishos39AddLink();
 const input=document.getElementById('v39LinkUrl'),category=document.getElementById('v39LinkCategory');
 if(!input)throw Error('Resource link editor could not be opened.');
 input.value=url;if(category)category.value='Research';
 document.getElementById('v39LinkName')?.focus();
 return url;
}
function mount(){
 if(!['upload','uploads'].includes(state.page))return;
 const shortcut=document.getElementById('v60uploadResearchBtn');
 if(!shortcut||document.getElementById('research71-drop'))return;
 const panel=document.createElement('section');panel.id='research71-panel';
 panel.innerHTML='<div class="ui68-dropzone" id="research71-drop" role="group" aria-label="Research documents and website links" aria-describedby="research71-help"><strong>Drop research documents or a website link here</strong><span id="research71-help">PDF, DOC, DOCX or TXT · Files are stored intact, not imported as records.</span><button type="button" class="btn" id="research71-choose">Choose research files</button><input type="file" id="research71-files" hidden multiple accept="'+ACCEPT+'" aria-label="Choose research documents"></div><div class="ui68-form"><label for="research71-url">Website link</label><input id="research71-url" type="url" placeholder="https://…"><button type="button" class="btn" id="research71-link">Review resource link</button></div><p id="research71-status" role="status" aria-live="polite">Select documents, then use Upload above. Website links open the resource editor for review and Save Link.</p>';
 shortcut.replaceWith(panel);shortcut.hidden=true;panel.append(shortcut);
 const get=id=>document.getElementById(id),drop=get('research71-drop'),picker=get('research71-files'),status=get('research71-status');
 const run=action=>{try{status.textContent=action()}catch(error){status.textContent='Not completed: '+String(error.message||error)}};
 const select=files=>{const count=stage(files);return count+' research document(s) ready in Upload above. Review notes and choose Upload to save.'};
 get('research71-choose').onclick=()=>picker.click();
 picker.onchange=()=>{if(picker.files.length)run(()=>select(picker.files));picker.value=''};
 const link=text=>{reviewLink(text);return 'Link opened for review. Choose Save Link in the editor to save it.'};
 get('research71-link').onclick=()=>run(()=>link(get('research71-url').value));
 get('research71-url').onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();run(()=>link(event.currentTarget.value))}};
 drop.ondragover=event=>{event.preventDefault();event.stopPropagation();drop.classList.add('drag');if(event.dataTransfer)event.dataTransfer.dropEffect='copy'};
 drop.ondragleave=event=>{if(!drop.contains(event.relatedTarget))drop.classList.remove('drag')};
 drop.ondrop=event=>{event.preventDefault();event.stopPropagation();drop.classList.remove('drag');run(()=>{const payload=dropped(event.dataTransfer);return payload.files?select(payload.files):link(payload.url)})};
}
window.fishosUpload71={documents,webLink,dropped,stage,reviewLink,mount};
const previous=window.render;
window.render=function(...args){const result=previous.apply(this,args);mount();return result};
if(document.readyState!=='loading')mount();
})();
