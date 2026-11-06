import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
function setup(notes){
 const c=vm.createContext({DATA:{destination_notes:notes,links:[]},atlas32:[{country:'Sample Mainland',rating:'Good'}],countries:{'sample-mainland':'Sample Mainland'},ratings:['All','Great','Good','OK','Bust','Unrated'],shell:(name,subtitle,body)=>name+'\n'+subtitle+'\n'+body,h:String,H:String,slug32:s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),norm:s=>String(s??'').toLowerCase().replace(/[^a-z0-9]/g,''),countryMap32:()=>'',render(){},persistData(){},document:{getElementById:id=>c.inputs[id]}});
 c.window=c;
 for(const [start,end] of [['function atlasRows32()', '// Restore original dashboard'],['function lookupCountry(slug)', 'const normalUrl=']]) vm.runInContext(html.slice(html.indexOf(start),html.indexOf(end,html.indexOf(start))),c);
 vm.runInContext(html.match(/^window.atlas32Rate=.*$/m)[0],c);
 return c;
}
test('private countries appear once in initial atlas, text search and rating filter',()=>{
 const notes=[{country:'Sample Islands (North)',notes:'Synthetic trout research',rating:'Great'},{name:'Sample Islands (North)',notes:'duplicate'},{country:'Sample Mainland',rating:'OK'},null,{country:'  '}];
 const c=setup(notes),before=JSON.stringify(notes);
 assert.equal(c.atlasRows32().length,2);assert.match(c.dest32(),/2 country \/ territory records/);
 c.dest32Query='trout';assert.match(c.dest32Cards(),/Sample Islands \(North\)/);assert.doesNotMatch(c.dest32Cards(),/Sample Mainland/);
 c.dest32Query='';c.dest32Rating='Great';assert.match(c.dest32Cards(),/Sample Islands/);assert.doesNotMatch(c.dest32Cards(),/Sample Mainland/);
 assert.equal(JSON.stringify(notes),before);
 c.DATA.destination_notes=[];assert.equal(c.atlasRows32().length,1);
});
test('private profile retains display name, notes, all regions and edits the existing row',()=>{
 const row={country:'Sample Islands (North)',notes:'Synthetic research',rating:'Great',region:'North',regions:['North','South','East']};
 const c=setup([row]);assert.equal(c.lookupCountry('sample-islands-north').name,row.country);
 assert.match(c.countryPage39('destination-sample-islands-north'),/North, South, East/);
 c.inputs={v39CountryRate:{value:'Good'},v39CountryNotes:{value:row.notes},v39CountryRegions:{value:row.regions.join(', ')}};
 c.fishos39CountrySave(encodeURIComponent(row.country));assert.equal(c.DATA.destination_notes.length,1);assert.equal(row.rating,'Good');assert.equal(row.regions.join(','),'North,South,East');
 c.atlas32Rate(row.country,'Bust');assert.equal(c.atlasRows32().find(x=>x.country===row.country).rating,'Bust');
});
