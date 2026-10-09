import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const generated = JSON.parse((await fs.readFile('scripts/center-generated-sources.json','utf8')).replace(/^\uFEFF/,''));
const out='public/images/center-v2';
await fs.mkdir(out,{recursive:true});
await fs.mkdir('asset-sources',{recursive:true});
const photos=process.env.CENTER_PHOTO_SOURCE || 'asset-sources';
const rows=generated.map(item=>({...item,source:item.path,origin:'AI concept illustration (built-in image generation)',size:item.name.startsWith('bus-aerial')?[800,1600]:item.name.startsWith('step')?[1200,1200]:item.name.startsWith('service')?[1600,1200]:[1920,1080],limit:item.name.startsWith('bus-aerial')||item.name.startsWith('step')?250:item.name.startsWith('service')?280:350}));
rows.push(
 {name:'approach-precision-v2',source:`${photos}/approach-precision-v2.jpg`,origin:'Real Center SP expedition photograph A7C03612',size:[1920,1080],limit:350},
 {name:'step-02-precisao-dark',source:`${photos}/step-02-precisao-dark.jpg`,origin:'Real Center SP stock photograph A7C03610',size:[1200,1200],limit:250},
 {name:'statement-craftsman',source:`${photos}/statement-craftsman.jpg`,origin:'Real Center SP checking photograph A7C03529',size:[1000,1500],limit:300},
 {name:'banner-available-stock',source:`${photos}/step-02-precisao-dark.jpg`,origin:'Real Center SP stock photograph A7C03610',size:[1920,1080],limit:350}
);
const manifest=[];
for(const row of rows){
 const source=await fs.readFile(row.source);
 const master=`asset-sources/${row.name}${path.extname(row.source)}`;
 await fs.writeFile(master,source);
 const transparent=row.name.startsWith('bus-aerial');
 const resized=sharp(source).rotate().resize(...row.size,{fit:transparent?'contain':'cover',background:{r:0,g:0,b:0,alpha:0}});
 let quality=88, buffer;
 do { buffer=await resized.clone().webp({quality,effort:6,alphaQuality:100}).toBuffer(); if(buffer.length<=row.limit*1024) break; quality-=4; } while(quality>=60);
 if(buffer.length>row.limit*1024) throw new Error(`Budget exceeded: ${row.name}`);
 const file=`${out}/${row.name}.webp`;await fs.writeFile(file,buffer);
 const info=await sharp(buffer).metadata();
 if(transparent&&!info.hasAlpha) throw new Error(`Missing alpha: ${row.name}`);
 manifest.push({file:'/'+file.replace(/^public\//,''),width:info.width,height:info.height,bytes:buffer.length,quality,alpha:!!info.hasAlpha,origin:row.origin,prompt:row.prompt??null,master});
 console.log(`${row.name}: ${Math.round(buffer.length/1024)} KB`);
}
await fs.writeFile(`${out}/manifest.json`,JSON.stringify(manifest,null,2));
await fs.writeFile('scripts/center-generated-sources.json',JSON.stringify(generated.map(({name,prompt})=>({name,prompt,path:`asset-sources/${name}.png`})),null,2));
