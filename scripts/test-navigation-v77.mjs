import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
test('Research moves directly after Resources without replacing button handlers',()=>{
  const action=()=>{}, research={textContent:'Research',onclick:action},resources={textContent:'Resources'},game={textContent:'Stillwater Game'};
  const fishing=[research],references=[resources,game];let moves=0;
  Object.defineProperty(resources,'nextElementSibling',{get:()=>references[1]});
  resources.after=node=>{moves++;fishing.splice(fishing.indexOf(node),1);references.splice(1,0,node)};
  const hooks=[],document={getElementById:()=>({querySelectorAll:()=>[...fishing,...references]}),addEventListener(){}};
  const context=vm.createContext({document,fishosRender725:{register:h=>hooks.push(h)}});context.window=context;
  vm.runInContext(readFileSync(new URL('../assets/fishos-navigation-v1-077.js',import.meta.url),'utf8'),context);
  hooks[0].after();hooks[0].after();assert.equal(moves,1);assert.equal(references[1],research);assert.equal(research.onclick,action);assert.equal(fishing.length,0);
});
