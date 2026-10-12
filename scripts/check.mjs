import {readFile,access,readdir,stat} from 'node:fs/promises';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {chapterPath,escapeHTML} from '../shared/render.js';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),chapters=JSON.parse(await readFile(join(root,'shared/chapters.json'),'utf8'));
assert.equal(chapters.length,132);assert.equal(new Set(chapters.map(c=>c.slug)).size,132);
let audio=0;
for(const [i,c] of chapters.entries()){
 assert.equal(c.id,i+1);assert.ok(c.title&&c.blocks.length);assert.match(c.slug,/^[a-z0-9-]+$/);
 const file=chapterPath(c),a=await readFile(join(root,'v2',file),'utf8');assert.ok(a.includes(escapeHTML(c.title)));
 assert.ok(a.includes('<html lang="sq">'));assert.ok(a.includes('<title>'));assert.ok(!a.includes('jquery'));assert.ok(!a.includes('user-scalable=no'));
 for(const block of c.blocks){
  if(block.type==='audio'){audio++;assert.match(block.file,/^[0-9]+-[0-9]+\.mp3$/);}
  else assert.ok(a.includes(escapeHTML(block.text)),`Missing text in chapter ${c.id}`);
 }
 for(const match of a.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)){
  const url=match[1];if(/^[a-z]+:/.test(url))continue;await access(resolve(dirname(join(root,'v2',file)),url));
 }
}
assert.equal(audio,230);
async function checkAssets(dir){for(const f of await readdir(dir,{withFileTypes:true})){const p=join(dir,f.name);if(f.isDirectory())await checkAssets(p);else assert.ok((await stat(p)).size<=25*1024*1024,`Asset exceeds 25 MiB: ${p}`);}}
await checkAssets(join(root,'v2'));
const config=JSON.parse(await readFile(join(root,'shared/site.config.json'),'utf8'));
const home=await readFile(join(root,'v2/index.html'),'utf8');
const sitemap=await readFile(join(root,'v2/sitemap.xml'),'utf8');
if(config.origin){assert.equal((sitemap.match(/<loc>/g)||[]).length,133);assert.ok(home.includes('rel="canonical"'));assert.ok(!home.includes('content="noindex"'));}
else{assert.ok(home.includes('content="noindex"'));assert.equal((sitemap.match(/<loc>/g)||[]).length,0);}
const references=chapters.flatMap(c=>c.blocks.filter(b=>b.type==='audio').map(b=>b.file));
assert.equal(new Set(references).size,230);
const wrangler=JSON.parse(await readFile(join(root,'wrangler.jsonc'),'utf8'));
assert.equal(wrangler.assets.directory,'./v2');assert.equal(wrangler.assets.run_worker_first,false);
await access(join(root,wrangler.main));
const robots=await readFile(join(root,'v2/robots.txt'),'utf8');
if(config.origin)assert.ok(robots.includes('Disallow: /audio/'));
await access(join(root,'v2/_headers'));
console.log('Passed: 132 chapters, content rendering, relative chapter links, shared static output, 230 audio references, and 25 MiB asset limit.');
