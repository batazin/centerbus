import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const sources=JSON.parse(await fs.readFile('scripts/seller-photo-sources.json','utf8'));
const source='C:/Users/DELL/Downloads/wetransfer_vendedores_2026-10-14_1832';
const output='public/images/vendedores/retratos-2026';
await fs.mkdir(output,{recursive:true});
for(const [id,file] of Object.entries(sources)){
 await sharp(path.join(source,file)).rotate().resize({width:900,withoutEnlargement:true}).webp({quality:90,effort:6}).toFile(`${output}/${id}.webp`);
}
console.log(`Prepared ${Object.keys(sources).length} real portraits.`);
