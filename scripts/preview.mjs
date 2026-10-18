import http from 'node:http';
import { readFile } from 'node:fs/promises';
const html = new URL('../index.html', import.meta.url);
const source=await readFile(html,'utf8');
const publicAssets=new Set([...source.matchAll(/(?:src|href)=["']((?:assets|icons)\/[^"']+)["']/g)].map(m=>m[1]));
// The standalone Stillwater frame has its own local stylesheet and game script.
for(const name of ['wyatt-wizard.png','fly-rod.png','fly-rod-detail.png','stillwater-game.html','stillwater-game.css','stillwater-game.js','stillwater-brown-trout.png'])publicAssets.add('assets/'+name);
// Icons may be referenced by the application at runtime.
const {readdir}=await import('node:fs/promises');
for(const name of await readdir(new URL('../icons/',import.meta.url)))if(/^[a-z0-9_-]+\.svg$/i.test(name))publicAssets.add('icons/'+name);
const port=Number(process.env.PORT||4173);
http.createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  const review=path==='/__design-review';
  const isHTML=review||['/', '/index.html', '/Fish-OS/', '/Fish-OS/index.html'].includes(path);
  const asset=path.replace(/^\/Fish-OS\//,'').replace(/^\//,'');
  if (!isHTML&&!publicAssets.has(asset)) { res.writeHead(404); res.end('Not found'); return; }
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  try {
    let body = await readFile(isHTML?html:new URL('../'+asset,import.meta.url));
    if(review){
      const fixture=JSON.parse(await readFile(new URL('./fixtures/design-review.json',import.meta.url),'utf8'));
      const injection=`<script>document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{if(state.profile?.loggedIn)return;Object.assign(DATA,${JSON.stringify(fixture).replace(/</g,'\\u003c')});state.fishCaught=['Brown trout','Rainbow trout'];state.packingByTrip={'Synthetic river weekend':{FIELD:[{name:'Synthetic pack item',done:true,qty:1,weight:4},{name:'Synthetic fly box',done:false,qty:1,weight:6}]}};render()},500),{once:true});</script>`;
      body=Buffer.from(body.toString('utf8').replace('</body>',injection+'</body>'));
    }
    const type=isHTML||asset.endsWith('.html')?'text/html':asset.endsWith('.png')?'image/png':asset.endsWith('.svg')?'image/svg+xml':asset.endsWith('.js')?'text/javascript':'text/css';
    res.writeHead(200, {'Content-Type':type+'; charset=utf-8','Cache-Control':'no-store'});
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(500); res.end('Unable to read app'); }
}).listen(port, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:'+port+'/Fish-OS/#dashboard'));
