import fs from 'node:fs/promises';
import sharp from 'sharp';

const categories=['carroceria','iluminacao','retrovisores','vidros','climatizacao','parachoques'];
const jobs=[...categories.map(name=>({name:`service-${name}`,ext:'png',width:1600,height:1200,budget:280,origin:'AI conceptual category photograph, daylight industrial workshop; no specific SKU or compatibility claim'})),
 ...['step-identification','step-dispatch'].map(name=>({name,ext:'jpg',width:1200,height:1200,budget:250,origin:'Real Center Ônibus photograph'})),
 {name:'equipe-rj',ext:'jpg',width:1200,height:800,budget:350,origin:'Real Center Ônibus RJ team photograph, RJ-40.jpg'}];
const manifest=[];
await fs.mkdir('public/images/center-v3',{recursive:true});
for(const job of jobs){
 const master=`asset-sources/v3/${job.name}.${job.ext}`;
 let buffer;
 let quality=90;
 for(;quality>=62;quality-=4){buffer=await sharp(master).rotate().resize(job.width,job.height,{fit:'cover'}).webp({quality}).toBuffer();if(buffer.length<=job.budget*1024)break;}
 if(buffer.length>job.budget*1024)throw Error('Budget exceeded: '+job.name);
 const file=`/images/center-v3/${job.name}.webp`;
 await fs.writeFile('public'+file,buffer);
 manifest.push({file,origin:job.origin,master,width:job.width,height:job.height,bytes:buffer.length,quality});
}
await fs.writeFile('public/images/center-v3/manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Prepared ${manifest.length} refinement photographs from preserved masters.`);
