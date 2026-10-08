import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
let count=0, failures=0;
for(const match of html.matchAll(/<script src="(assets\/[^\"]+)"/g)){
  count++;
  try{new vm.Script(readFileSync(new URL('../'+match[1],import.meta.url),'utf8'));}
  catch(e){failures++;console.error(match[1]+': '+e.message);}
}
for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  if (/\bsrc\s*=/.test(m[1]) || !m[2].trim() || /application\//.test(m[1])) continue;
  count++;
  try { new vm.Script(m[2]); } catch(e) { failures++; console.error('Script '+count+': '+e.message); }
}
for (const [i,line] of html.split('\n').entries()) {
  if (/sb_secret_[A-Za-z0-9_-]+|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(line)) {
    failures++; console.error('Potential privileged secret at index.html:'+(i+1));
  }
  for (const t of line.matchAll(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g)) {
    try { if(JSON.parse(Buffer.from(t[0].split('.')[1], 'base64url')).role==='service_role') {
      failures++; console.error('Privileged JWT at index.html:'+(i+1));
    }} catch {}
  }
}
console.log('Checked '+count+' inline and referenced scripts; '+failures+' issues. Not a complete security or browser test.');
process.exitCode=failures?1:0;
