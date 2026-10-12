// Local preview only. Supports audio range requests, with no packages.
import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {resolve,join,extname,dirname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {networkInterfaces} from 'node:os';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../v2');
const lan=process.argv.includes('--lan'),host=lan?'0.0.0.0':'127.0.0.1';
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.ico':'image/x-icon','.svg':'image/svg+xml','.woff2':'font/woff2','.mp3':'audio/mpeg','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
createServer(async(req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});return res.end();}
  let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),path=resolve(root,'.'+pathname),status=200;
  if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);return res.end();}
  let info;try{info=await stat(path);if(info.isDirectory()){path=join(path,'index.html');info=await stat(path);}if(!info.isFile())throw Error();}catch{path=join(root,'404.html');info=await stat(path);status=404;}
  const headers={'Content-Type':mime[extname(path)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
  let start=0,end=info.size-1;
  if(req.headers.range&&status===200){const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
   if(!match||(!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end();}
   if(match[1]){start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),end):end;}else{start=Math.max(0,info.size-Number(match[2]));}
   if(start>end||start>=info.size){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end();}
   status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
  }
  headers['Content-Length']=Math.max(0,end-start+1);res.writeHead(status,headers);
  if(req.method==='HEAD'||info.size===0)return res.end();const stream=createReadStream(path,{start,end});stream.on('error',()=>res.destroy());stream.pipe(res);
 }catch{res.writeHead(400);res.end('Bad request');}
}).listen(4173,host,()=>{
 console.log('Static preview: http://localhost:4173 — Ctrl+C to stop.');
 if(lan)for(const entries of Object.values(networkInterfaces()))for(const address of entries||[]){
  if(address.family==='IPv4'&&!address.internal)console.log(`Phone / LAN preview: http://${address.address}:4173`);
 }
});
