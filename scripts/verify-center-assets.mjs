import fs from 'node:fs';
import sharp from 'sharp';
(async()=>{
 const legacy=JSON.parse(fs.readFileSync('public/images/center-v2/manifest.json','utf8'));
 const source=fs.readFileSync('src/app/home-2/page.tsx','utf8')+fs.readFileSync('src/app/_components/center-rj-team.tsx','utf8');
 const active=[...new Set([...source.matchAll(/\/images\/center-v[234]\/[^"\s]+\.webp/g)].map(match=>match[0]))];
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
 const {data:logo}=await sharp('public/brand/center-onibus-logo-partial-negative.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const colors={white:0,red:0,blue:0};
 for(let i=0;i<logo.length;i+=4){
  if(logo[i+3]<200)continue;
  if(logo[i]>220&&logo[i+1]>220&&logo[i+2]>220)colors.white++;
  if(logo[i]>150&&logo[i+1]<70&&logo[i+2]<100)colors.red++;
  if(logo[i]<100&&logo[i+1]>70&&logo[i+2]>120)colors.blue++;
 }
 if(logo[3]>10||Object.values(colors).some(count=>count<100))throw Error('The supplied partial-negative logo must retain white, red, blue and transparency');
 let bytes=0;
 for(let index=1;index<=241;index++){
  const file=`public/sequences/bus-drive-flow-v5/frame_${String(index).padStart(4,'0')}.webp`;
  const meta=await sharp(file).metadata();if(meta.width!==1920||meta.height!==1080)throw Error(file);
  const size=fs.statSync(file).size;if(size>180*1024)throw Error('Frame too large: '+file);bytes+=size;
 }
 let mobileBytes=0;
 for(let index=1;index<=241;index++){
  const file=`public/sequences/bus-drive-flow-mobile-v5/frame_${String(index).padStart(4,'0')}.webp`;
  const meta=await sharp(file).metadata();
  if(meta.width!==960||meta.height!==540)throw Error('Mobile dimensions: '+file);
  const size=fs.statSync(file).size;if(size>60*1024)throw Error('Mobile frame budget: '+file);mobileBytes+=size;
 }
 if(mobileBytes>=bytes)throw Error('Mobile sequence must be lighter');
 for(const file of active.filter(file=>!file.includes('equipe-rj'))){
  const mobile='public/images/mobile-v4/'+file.split('/').pop();
  const meta=await sharp(mobile).metadata();if(meta.width>960)throw Error('Mobile image too wide: '+file);
 }
 console.log(`Validated ${list.length} images, transparent cutouts, 241 desktop frames (${(bytes/1048576).toFixed(2)} MB) and 241 mobile frames (${(mobileBytes/1048576).toFixed(2)} MB).`);
})().catch(e=>{console.error(e);process.exit(1)});
