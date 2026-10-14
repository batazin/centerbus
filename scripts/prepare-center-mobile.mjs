import fs from 'node:fs/promises';
import sharp from 'sharp';

await fs.mkdir('public/images/center-v4',{recursive:true});
await fs.mkdir('public/images/mobile-v4',{recursive:true});
await fs.mkdir('public/sequences/bus-drive-mobile-v4',{recursive:true});
const masters={
 'bus-aerial-coach':'exec-5ff5429b-9b0e-469a-9ab6-7847540cf679.png',
 'bus-aerial-urban':'exec-b993853f-05d6-4550-ab0b-15177c0dee0f.png',
 'bus-aerial-mini':'exec-1de97526-62be-4472-800f-13dee36c3a2a.png',
 'catalog-detail':'exec-c3a291fe-7add-46b6-a91b-8abed5a8d872.png',
};
await fs.mkdir('asset-sources/v4',{recursive:true});
const manifest=[];
for(const [name,filename] of Object.entries(masters)){
 const master=`asset-sources/v4/${name}.png`;
 try{await fs.access(master);}catch{await fs.copyFile(`C:/Users/DELL/.codex/generated_images/01a1200f-87db-7fb3-8ed3-2149e9a6a987/${filename}`,master);}
 const image=sharp(master);
 if(name.startsWith('bus-'))image.trim({threshold:10}).extend({top:16,bottom:16,left:16,right:16,background:{r:0,g:0,b:0,alpha:0}}).resize({height:1800,withoutEnlargement:true});
 else image.resize(1920,1080,{fit:'cover'});
 const file=`/images/center-v4/${name}.webp`;
 await image.webp({quality:88}).toFile('public'+file);
 const meta=await sharp('public'+file).metadata();
 manifest.push({file,width:meta.width,height:meta.height,hasAlpha:meta.hasAlpha,master,origin:'New AI concept photograph; no real fleet or SKU claim'});
}
const source=await fs.readFile('src/app/home-2/page.tsx','utf8');
const images=[...new Set([...source.matchAll(/\/images\/center-v[234]\/[^"\s]+\.webp/g)].map(match=>match[0]))];
for(const file of images){
 const target=`public/images/mobile-v4/${file.split('/').pop()}`;
 await sharp('public'+file).resize({width:file.includes('bus-aerial')?240:960,withoutEnlargement:true}).webp({quality:80}).toFile(target);
}
let frameBytes=0;
for(let index=1;index<=241;index++){
 const filename=`frame_${String(index).padStart(4,'0')}.webp`;
 const output=`public/sequences/bus-drive-mobile-v4/${filename}`;
 await sharp(`public/sequences/bus-drive-v2/${filename}`).resize(960,540).webp({quality:74}).toFile(output);
 frameBytes+=(await fs.stat(output)).size;
}
await fs.writeFile('public/images/center-v4/manifest.json',JSON.stringify({assets:manifest,mobileImages:images.length,mobileFrameBytes:frameBytes},null,2)+'\n');
console.log(`Prepared ${manifest.length} new assets, ${images.length} mobile photos and 241 mobile frames (${(frameBytes/1048576).toFixed(2)} MB).`);
