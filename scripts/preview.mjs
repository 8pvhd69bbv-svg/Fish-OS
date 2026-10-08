import http from 'node:http';
import { readFile } from 'node:fs/promises';
const html = new URL('../index.html', import.meta.url);
const source=await readFile(html,'utf8');
const publicAssets=new Set([...source.matchAll(/(?:src|href)=["']((?:assets|icons)\/[^"']+)["']/g)].map(m=>m[1]));
// Icons may be referenced by the application at runtime.
const {readdir}=await import('node:fs/promises');
for(const name of await readdir(new URL('../icons/',import.meta.url)))if(/^[a-z0-9_-]+\.svg$/i.test(name))publicAssets.add('icons/'+name);
const port=Number(process.env.PORT||4173);
http.createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  const isHTML=['/', '/index.html', '/Fish-OS/', '/Fish-OS/index.html'].includes(path);
  const asset=path.replace(/^\/Fish-OS\//,'').replace(/^\//,'');
  if (!isHTML&&!publicAssets.has(asset)) { res.writeHead(404); res.end('Not found'); return; }
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  try {
    const body = await readFile(isHTML?html:new URL('../'+asset,import.meta.url));
    const type=isHTML?'text/html':asset.endsWith('.svg')?'image/svg+xml':asset.endsWith('.js')?'text/javascript':'text/css';
    res.writeHead(200, {'Content-Type':type+'; charset=utf-8','Cache-Control':'no-store'});
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(500); res.end('Unable to read app'); }
}).listen(port, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:'+port+'/Fish-OS/#dashboard'));
