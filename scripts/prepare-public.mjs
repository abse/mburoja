// Export an inspectable snapshot without Git history or local development state.
import {cp,mkdir,mkdtemp,readdir} from 'node:fs/promises';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const localDir=join(root,'.wrangler');
await mkdir(localDir,{recursive:true});
const target=await mkdtemp(join(localDir,'public-release-'));
const excluded=name=>['.git','.wrangler','node_modules','.codex','.agents'].includes(name)||/^\.(env|dev\.vars)(\.|$)/.test(name)||/\.(log|pem|key|pfx|p12)$/i.test(name);
const filter=async source=>!excluded(source.split(/[\\/]/).at(-1));
for(const name of ['.gitignore','README.md','package.json','package-lock.json','audio-report.json','wrangler.jsonc','scripts','shared','worker','v1','v2']){
 await cp(join(root,name),join(target,name),{recursive:true,filter});
}
async function count(dir){let n=0;for(const entry of await readdir(dir,{withFileTypes:true}))n+=entry.isDirectory()?await count(join(dir,entry.name)):1;return n;}
console.log(`Prepared ${await count(target)} files at ${target}`);
console.log('No Git metadata, history, tags, author identity, credentials, or local tool state was copied by name. Review file contents and redistribution rights before publishing.');
console.log('This does not initialize Git, commit, push, delete history, or change repository visibility.');
