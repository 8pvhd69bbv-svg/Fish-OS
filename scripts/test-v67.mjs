import fs from 'node:fs';import vm from 'node:vm';import test from 'node:test';import assert from 'node:assert/strict';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('resource URL grouping retains original edit indexes and conflicting notes',()=>{
 const source=html.match(/function resources\(\)\{\r?\nconst data=array\(DATA.links\)[\s\S]*?(?=window.fishos53LinkNew)/)[0];
 const links=[{title:'One',url:'https://www.example.org/river/?utm_source=x',notes:'First'},{title:'Two',url:'http://example.org/river#section',notes:'Second'},{title:'Distinct',url:'https://example.org/other'}];
 const c=vm.createContext({DATA:{links},window:{},array:x=>x,esc:x=>String(x??''),shell:(_a,_b,body)=>body,URL});vm.runInContext(source,c);const result=c.resources();
 assert.equal((result.match(/f53-resource-card/g)||[]).length,2);assert.match(result,/2 saved versions/);assert.match(result,/First/);assert.match(result,/Second/);assert.match(result,/fishos53LinkEdit\(1\)/);assert.equal(links.length,3);
});
test('every existing atlas country has a shared reference without private data',()=>{
 const c=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(new URL('../assets/fishos-country-references-v1-067.js',import.meta.url),'utf8'),c);vm.runInContext(html.match(/function countryReference32[\s\S]*?(?=function countryMap32)/)[0],c);
 const countries=JSON.parse(html.match(/const atlas32=(\[.*?\]);/)[1]);for(const x of countries){const ref=c.countryReference32(x.country);assert.ok(ref,x.country);assert.ok(Math.abs(ref.lat)<=90&&Math.abs(ref.lon)<=180)}
});
test('resale estimates disclose missing basis and apply age, condition and comparable input',()=>{
 const source=fs.readFileSync(new URL('../assets/fishos-workspace-v1-066.js',import.meta.url),'utf8');const c=vm.createContext({window:{},money:v=>Math.max(0,Number(v)||0)});vm.runInContext(source.match(/function resaleEstimate[\s\S]*?(?=function edit\()/)[0],c);
 assert.equal(c.resaleEstimate({}),null);assert.equal(c.resaleEstimate({retail:400,condition:'Good'},2026),240);assert.ok(c.resaleEstimate({retail:400,condition:'Good',year:2020},2026)<240);assert.equal(c.resaleEstimate({retail:400,condition:'Poor',comparable:175},2026),175);
});
