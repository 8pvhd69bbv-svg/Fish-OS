/* Read-only source audit. Historical releases are recovery inputs, not deletion candidates. */
import {readFile,readdir} from 'node:fs/promises';import vm from 'node:vm';
const root=new URL('../',import.meta.url),entry=await readFile(new URL('index.html',root),'utf8'),files=await readdir(root),releases=files.filter(x=>/^Fish_OS_.*\.html$/.test(x));
const refs=s=>[...s.matchAll(/(?:src|href)=["']((?:assets|icons)\/[^"']+)["']/g)].map(m=>m[1]);
const current=refs(entry),all=new Set(current),failures=[];for(const file of releases)for(const ref of refs(await readFile(new URL(file,root),'utf8')))all.add(ref);
// Follow the public dependencies of embedded HTML games as well as the app shell.
for(const ref of all)if(ref.startsWith('assets/')&&ref.endsWith('.html')){
 try{const frame=await readFile(new URL(ref,root),'utf8');for(const m of frame.matchAll(/(?:src|href)=["'](stillwater-(?:game\.(?:js|css)|brown-trout\.png))["']/g)){const child='assets/'+m[1];all.add(child);const source=await readFile(new URL(child,root),'utf8');if(child.endsWith('.js'))new vm.Script(source)}}catch(e){failures.push(ref+': '+e.message)}
}
for(const ref of new Set(current)){try{const source=await readFile(new URL(ref,root),'utf8');if(ref.endsWith('.js'))new vm.Script(source)}catch(e){failures.push(ref+': '+e.message)}}
const duplicates=current.filter((ref,i)=>current.indexOf(ref)!==i),assets=(await readdir(new URL('assets/',root))).map(x=>'assets/'+x),unreferenced=assets.filter(x=>!all.has(x));
const output={currentReferences:current.length,uniqueCurrentReferences:new Set(current).size,duplicateCurrentReferences:duplicates,historicalReleases:releases.length,assetsReferencedByCurrentOrHistorical:all.size,assetsWithoutStaticReference:unreferenced,legacyInlineRenderWrappers:(entry.match(/window\.render\s*=\s*function/g)||[]).length,currentDesignRenderer:current.filter(x=>/fishos-design-v/.test(x)),currentStylesheet:current.filter(x=>/fishos-ui-.*\.css$/.test(x)),failures};
console.log(JSON.stringify(output,null,2));if(failures.length||duplicates.length)process.exitCode=1;
