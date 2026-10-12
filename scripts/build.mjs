import {readFile,writeFile,mkdir,readdir,rm} from 'node:fs/promises';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {render,chapterPath,escapeHTML as E} from '../shared/render.js';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const chapters=JSON.parse(await readFile(join(root,'shared/chapters.json'),'utf8'));
const config=JSON.parse(await readFile(join(root,'shared/site.config.json'),'utf8'));
if(config.origin){const u=new URL(config.origin);if(u.protocol!=='https:'||u.pathname!=='/'||u.search||u.hash)throw new Error('origin must be an HTTPS origin without path/query/hash');config.origin=u.origin;}
const publicDir=join(root,'v2'),audioDir=join(publicDir,'audio');await mkdir(audioDir,{recursive:true});
const audioNames=(await readdir(audioDir,{withFileTypes:true})).filter(f=>f.isFile()&&f.name.toLowerCase().endsWith('.mp3')).map(f=>f.name);
const audioFiles=new Set(audioNames),expected=new Set(chapters.flatMap(c=>c.blocks.filter(b=>b.type==='audio').map(b=>b.file)));
const assetFiles={},assets=[];
for(const name of ['kitab-regular.woff2','KITAB-LICENSE.txt','diyanet-abay.woff2','diyanet-hamdullah.woff2','lateef-regular.woff2','LATEEF-LICENSE.txt','DIYANET-NOTICE.txt','roboto.woff2','open-sans.woff2','ROBOTO-LICENSE.txt','OPENSANS-LICENSE.txt','lato-regular.woff2','lato-bold.woff2','poppins-regular.woff2','poppins-semibold.woff2','montserrat.woff2','noto-naskh-arabic.woff2','LATO-LICENSE.txt','POPPINS-LICENSE.txt','MONTSERRAT-LICENSE.txt','NOTONASKHARABIC-LICENSE.txt'])assets.push([name,await readFile(join(root,'shared/assets',name))]);
assetFiles.font='amiri-arabic.woff2';
assets.push([assetFiles.font,await readFile(join(root,'shared/assets/amiri-arabic-400-normal.woff2'))],['FONT-LICENSE.txt',await readFile(join(root,'shared/assets/FONT-LICENSE.txt'))]);
for(const [key,name] of Object.entries({css:'style.css',app:'app.js',theme:'theme.js',icon:'favicon.svg',heroIcon:'logo-ornament.svg'})){
 let bytes=await readFile(join(root,'shared/assets',name));
 if(key==='css')bytes=Buffer.from(bytes.toString().replace('amiri-arabic-400-normal.woff2',assetFiles.font));
 assetFiles[key]=name;assets.push([name,bytes]);
}
const write=async(path,data)=>{await mkdir(dirname(path),{recursive:true});await writeFile(path,data);};
{
 const target=publicDir;
 // Only generated subdirectories are replaced. Existing audio is preserved.
 for(const f of await readdir(target).catch(()=>[])){if(/^\d+-[a-z0-9-]+\.html$/.test(f))await rm(join(target,f));}
 for(const directory of ['duate','assets'])await rm(join(target,directory),{recursive:true,force:true});
 for(const [file,bytes] of assets)await write(join(target,'assets',file),bytes);
 await write(join(target,'favicon.ico'),await readFile(join(root,'shared/assets/favicon.ico')));
 await write(join(target,'index.html'),render({config,chapters,assetFiles,audioFiles}));
 for(const chapter of chapters)await write(join(target,chapterPath(chapter)),render({config,chapters,chapter,assetFiles,audioFiles}));
 await write(join(target,'404.html'),render({config,chapters,assetFiles,notFound:true}));
 const indexable=Boolean(config.origin);
 const urls=['/',...chapters.map(c=>`/${c.slug}.html`)];
 await write(join(target,'_redirects'),'/ /index.html 200\n');
 await write(join(target,'robots.txt'),indexable?`User-agent: *\nAllow: /\nDisallow: /audio/\nSitemap: ${config.origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
 await write(join(target,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexable?urls.map(p=>`<url><loc>${E(config.origin+p)}</loc></url>`).join(''):''}</urlset>`);
 await write(join(target,'_headers'),`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Content-Security-Policy: default-src 'self'; script-src 'self' https://static.cloudflareinsights.com/beacon.min.js https://static.cloudflareinsights.com/beacon.min.js/; style-src 'self'; font-src 'self'; img-src 'self'; media-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'\n${indexable?'':'  X-Robots-Tag: noindex\n'}/assets/*\n  Cache-Control: public, max-age=0, must-revalidate\n/audio/*\n  Cache-Control: public, max-age=86400\n`);
}
const missing=[...expected].filter(f=>!audioFiles.has(f));
await write(join(root,'audio-report.json'),JSON.stringify({expectedFiles:expected.size,availableFiles:audioNames.length,missing,unreferenced:audioNames.filter(f=>!expected.has(f)),note:'230 unique recordings expected.'},null,2));
console.log(`Built shared static site: ${chapters.length} chapters; ${audioNames.length} audio files present; ${missing.length} missing.`);
if(!config.origin)console.log('Test mode: indexing disabled. Set shared/site.config.json origin to your final HTTPS domain before production, then rebuild.');
