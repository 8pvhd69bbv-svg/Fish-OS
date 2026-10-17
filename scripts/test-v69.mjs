import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../assets/fishos-review-v1-069.js',import.meta.url),'utf8');
function review(document={readyState:'loading',addEventListener(){}}){const context=vm.createContext({window:{},document,state:{page:'account'}});vm.runInContext(source,context);return context.window.fishosReview69}

test('global search excludes resource collections before the result cap and preserves records',()=>{
 const m=review(),data={links:Array.from({length:300},(_,i)=>({title:'Sample River resource '+i})),resources:[{title:'Sample River resource'}],resource_links:[{title:'Sample River resource'}],research_links:[{title:'Sample River resource'}],trips:[{id:'Sample River outing',notes:'Sample River trout',links:[{title:'Sample River nested resource'}]}],journal:[{title:'Evening Sample River',notes:'Sample River observations'}]},before=JSON.stringify(data);
 const hits=m.searchHits(data,'Sample River');assert.equal(hits.length,2);assert.equal(hits[0].page,'trip-sample-river-outing');assert.equal(hits[1].type,'Journal');assert.equal(m.searchHits(data,'resource').length,0);assert.equal(m.searchHits(data,'   ').length,0);assert.equal(JSON.stringify(data),before);
});

test('map labels collapse case and whitespace duplicates without changing saved labels',()=>{
 const names=['Sample River',' sample river ','Sample   River','Wilson'],before=JSON.stringify(names),result=review().uniqueNames(names);
 assert.deepEqual(Array.from(result),['Sample River','Wilson']);assert.equal(JSON.stringify(names),before);
});

test('release badges update on ordinary routes without changing unrelated tags',()=>{
 const release={textContent:'FISH OS V1.068'},page={textContent:'PAGE V1.068 / JOURNAL'},ordinary={textContent:'Brown trout'};
 const document={readyState:'loading',addEventListener(){},getElementById(id){return id==='fishos-release-global'?release:null},querySelectorAll(){return [page,ordinary]}};
 review(document).arrange();assert.equal(release.textContent,'FISH OS V1.069');assert.equal(page.textContent,'PAGE V1.069 / JOURNAL');assert.equal(ordinary.textContent,'Brown trout');
});
