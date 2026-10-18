import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../assets/fishos-upload-v1-071.js',import.meta.url),'utf8');
function harness(){
 const elements=new Map(),events=[],modes=[];let opened=0;
 const ctx=vm.createContext({URL,Event,state:{page:'home',profile:{loggedIn:true,userId:'synthetic-owner'},privateHydrated:true},
  document:{readyState:'complete',getElementById:id=>elements.get(id),querySelector:()=>elements.get('uploadButton'),createElement:()=>({})},
  DataTransfer:class{constructor(){this.files=[];this.items={add:file=>this.files.push(file)}}},
  render(){},fishos40Mode:mode=>modes.push(mode),fishos39AddLink:()=>{opened++}
 });ctx.window=ctx;vm.runInContext(source,ctx);
 for(const id of ['f40category','v34Category'])elements.set(id,{options:[{value:'General'}],value:'General',add(option){this.options.push(option)}});
 elements.set('f40files',{files:[{name:'previous.json'}],dispatchEvent:event=>events.push(event.type)});
 elements.set('uploadButton',{hidden:true,textContent:'Review JSON import',focus(){this.focused=true}});
 elements.set('f40result',{textContent:''});
 for(const id of ['v39LinkUrl','v39LinkCategory','v39LinkName'])elements.set(id,{value:'',focus(){this.focused=true}});
 return {api:ctx.fishosUpload71,ctx,elements,events,modes,get opened(){return opened}};
}
test('research document drop accepts all advertised extensions and prioritizes files over local URI',()=>{
 const h=harness(),files=['one.PDF','two.doc','three.docx','four.txt'].map(name=>({name}));
 const parsed=h.api.dropped({files,getData(){throw Error('must not read local file URLs')}});
 assert.deepEqual(Array.from(parsed.files),files);
});
test('URI-list comments and plain-text links resolve without fetching or running their contents',()=>{
 const h=harness();
 assert.equal(h.api.dropped({getData:type=>type==='text/uri-list'?'# browser bookmark\r\nhttps://example.org/fishing?q=1':''}).url,'https://example.org/fishing?q=1');
 assert.equal(h.api.dropped({getData:type=>type==='text/plain'?'  https://example.org  ':''}).url,'https://example.org/');
 for(const value of ['javascript:alert(1)','file:///private/report.pdf','data:text/html,hello','https://user:password@example.org','https://','hello','https://example.org\nhttps://example.net'])assert.throws(()=>h.api.webLink(value));
 assert.throws(()=>h.api.dropped({getData:()=>''}));
});
test('staging replaces selection, returns from import mode and routes both categories to Research without uploading',()=>{
 const h=harness(),files=[{name:'synthetic.pdf',size:10},{name:'synthetic.docx',size:20}];
 assert.equal(h.api.stage(files),2);
 assert.deepEqual(h.elements.get('f40files').files,files);
 assert.deepEqual(h.modes,['upload']);assert.deepEqual(h.events,['change']);
 for(const id of ['f40category','v34Category'])assert.equal(h.elements.get(id).value,'Research');
 assert.equal(h.elements.get('uploadButton').textContent,'Upload');assert.equal(h.elements.get('uploadButton').hidden,false);
 assert.match(h.elements.get('f40result').textContent,/choose Upload/);
 assert.equal(h.api.stage(files),2);assert.equal(h.elements.get('f40category').options.length,2);
});
test('unsupported mixed files and unavailable FileList preserve previous selection and mode',()=>{
 const h=harness();assert.throws(()=>h.api.stage([{name:'valid.pdf'},{name:'backup.json'}]),/Unsupported research file/);
 assert.equal(h.elements.get('f40files').files[0].name,'previous.json');assert.equal(h.modes.length,0);
 h.ctx.DataTransfer=class{constructor(){throw Error('Unavailable')}};
 assert.throws(()=>h.api.stage([{name:'valid.pdf'}]),/Unavailable/);assert.equal(h.modes.length,0);
});
test('link review prefills existing resource editor and requires loaded signed-in account',()=>{
 const h=harness();assert.equal(h.api.reviewLink('https://example.org/research'),'https://example.org/research');
 assert.equal(h.opened,1);assert.equal(h.elements.get('v39LinkUrl').value,'https://example.org/research');
 assert.equal(h.elements.get('v39LinkCategory').value,'Research');assert.ok(h.elements.get('v39LinkName').focused);
 h.ctx.state.privateHydrated=false;assert.throws(()=>h.api.reviewLink('https://example.org'),/Sign in/);
 h.ctx.state.privateHydrated=true;h.ctx.state.profile.loggedIn=false;assert.throws(()=>h.api.reviewLink('https://example.org'),/Sign in/);
 assert.equal(h.opened,1);
});
test('missing existing controls and malformed link fail without opening an editor',()=>{
 const h=harness();h.elements.delete('f40files');assert.throws(()=>h.api.stage([{name:'valid.txt'}]),/unavailable/);
 assert.throws(()=>h.api.reviewLink('javascript:alert(1)'));assert.equal(h.opened,0);
});
test('mounted drop and picker controls stage files, announce errors and prevent browser navigation',()=>{
 const h=harness();let clicks=0,prevented=0,stopped=0;
 h.ctx.state.page='upload';
 const shortcut={replaceWith(panel){this.panel=panel}};h.elements.set('v60uploadResearchBtn',shortcut);
 h.ctx.document.createElement=tag=>tag==='section'?{append(){},set innerHTML(html){
  for(const [,id] of html.matchAll(/id="([^"]+)"/g))h.elements.set(id,{value:'',textContent:'',files:[],click(){clicks++},classList:{add(){},remove(){}},contains(){return false}});
 }}:{};
 h.api.mount();assert.ok(shortcut.hidden);
 h.elements.get('research71-choose').onclick();assert.equal(clicks,1);
 const picker=h.elements.get('research71-files');picker.files=[{name:'picker.txt'}];picker.onchange();
 assert.equal(h.elements.get('f40files').files[0].name,'picker.txt');assert.match(h.elements.get('research71-status').textContent,/ready in Upload/);
 const drop=h.elements.get('research71-drop');
 drop.ondrop({preventDefault(){prevented++},stopPropagation(){stopped++},dataTransfer:{files:[{name:'dropped.doc'}]}});
 assert.equal(prevented,1);assert.equal(stopped,1);assert.equal(h.elements.get('f40files').files[0].name,'dropped.doc');
 drop.ondrop({preventDefault(){},stopPropagation(){},dataTransfer:{getData:()=>'<script>bad</script>'}});
 assert.match(h.elements.get('research71-status').textContent,/Not completed/);
 assert.equal(h.elements.get('f40files').files[0].name,'dropped.doc');assert.equal(h.opened,0);
 h.elements.get('research71-url').value='https://example.org/review';h.elements.get('research71-link').onclick();
 assert.equal(h.opened,1);assert.match(h.elements.get('research71-status').textContent,/opened for review/);
});
