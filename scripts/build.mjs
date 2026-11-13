import {cp,rm,readFile,writeFile} from 'node:fs/promises';
const config=JSON.parse(await readFile('site.config.json','utf8'));
let origin=null;
if(config.url){
  const url=new URL(config.url);
  if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||url.pathname!=='/')throw new Error('site.config.json url must be your HTTPS site origin.');
  origin=url.origin+'/';
}
await rm('dist',{recursive:true,force:true});
await cp('public','dist',{recursive:true});
let html=await readFile('dist/index.html','utf8');
html=html.replace('<!-- SITE_METADATA -->',origin?`<link rel="canonical" href="${origin}">\n    <meta property="og:url" content="${origin}">`:'');
await writeFile('dist/index.html',html);
if(origin){
  await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}</loc></url></urlset>\n`);
  await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${origin}sitemap.xml\n`);
}
console.log('Built the standalone academic homepage.');
