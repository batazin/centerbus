import fs from 'node:fs';
import sharp from 'sharp';
(async()=>{
 const legacy=JSON.parse(fs.readFileSync('public/images/center-v2/manifest.json','utf8'));
 const source=fs.readFileSync('src/app/home-2/page.tsx','utf8')+fs.readFileSync('src/app/_components/center-rj-team.tsx','utf8');
 const active=[...new Set([...source.matchAll(/\/images\/center-v[23]\/[^"\s]+\.webp/g)].map(match=>match[0]))];
 const list=await Promise.all(active.map(async file=>{const prior=legacy.find(row=>row.file===file);if(prior)return prior;const meta=await sharp('public'+file).metadata();return {file,width:meta.width,height:meta.height};}));
 if(!active.some(file=>file.includes('center-v3/service-')))throw Error('Missing daylight service photographs');
 for(const row of list){
  const file='public'+row.file,meta=await sharp(file).metadata();
  if(meta.width!==row.width||meta.height!==row.height)throw Error('Dimensions: '+row.file);
  const budget=row.file.includes('bus-aerial')||row.file.includes('step-')?250:row.file.includes('service-')?280:row.file.includes('statement')?300:350;
  if(fs.statSync(file).size>budget*1024)throw Error('Budget: '+row.file);
  if(row.file.includes('bus-aerial')){const {data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});if(!meta.hasAlpha||data[3]!==0||data[(info.width*info.height-1)*4+3]!==0)throw Error('Alpha: '+row.file);}
 }
 for(const name of ['busscar','comil','caio','mascarello']){
  const file=`public/brand/manufacturers/${name}.png`,meta=await sharp(file).metadata();
  const {data}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  if(!meta.hasAlpha||data[3]>10)throw Error('Manufacturer background must be transparent: '+name);
 }
 let bytes=0;
 for(let index=1;index<=241;index++){
  const file=`public/sequences/bus-drive-v2/frame_${String(index).padStart(4,'0')}.webp`;
  const meta=await sharp(file).metadata();if(meta.width!==1920||meta.height!==1080)throw Error(file);
  const size=fs.statSync(file).size;if(size>180*1024)throw Error('Frame too large: '+file);bytes+=size;
 }
 console.log(`Validated ${list.length} images, alpha cutouts and 241 continuous frames (${(bytes/1048576).toFixed(2)} MB).`);
})().catch(e=>{console.error(e);process.exit(1)});
