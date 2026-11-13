import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,dirname,extname} from 'node:path';

const root=resolve('public');
async function walk(directory){
 const files=[];
 for(const item of await readdir(directory,{withFileTypes:true})){
  const path=resolve(directory,item.name);
  if(item.isDirectory())files.push(...await walk(path));else files.push(path);
 }
 return files;
}
const files=await walk(root);
let refs=0;
for(const file of files.filter(f=>['.html','.css'].includes(extname(f)))){
 const text=await readFile(file,'utf8');
 const references=extname(file)==='.html'?[...text.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]):[...text.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map(m=>m[1]);
 const ids=[...text.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,'Duplicate IDs: '+file);
 for(const reference of references){
  if(/^(https?:|mailto:|data:)/.test(reference))continue;
  if(reference.startsWith('#')){assert(ids.includes(reference.slice(1)),'Missing anchor: '+reference);continue;}
  const clean=reference.split(/[?#]/)[0];
  let target=clean.startsWith('/')?resolve(root,clean.slice(1)):resolve(dirname(file),clean);
  if(clean.endsWith('/'))target=resolve(target,'index.html');
  assert(target.startsWith(root+'/'),'Asset escapes public: '+reference);
  assert((await stat(target)).isFile(),'Missing asset: '+reference);
  refs++;
 }
 if(extname(file)==='.css')assert(!/url\(['"]?https?:/.test(text),'Fonts/styles must load locally.');
}
const html=await readFile(root+'/index.html','utf8');
assert(!/<script|<iframe|playground|dev-login|dev-logout|Outside research|bgcolor=|class="highlight"/.test(html),'Production must stay static and academic-only.');
assert(html.includes('id="news"'),'News must be retained.');
const bytes=(await Promise.all(files.map(async file=>(await stat(file)).size))).reduce((a,b)=>a+b,0);
console.log(`Verified ${refs} local asset/link references, unique anchors, self-hosted fonts, and academic-only content. ${files.length} files, ${(bytes/1024).toFixed(0)} KB total.`);
