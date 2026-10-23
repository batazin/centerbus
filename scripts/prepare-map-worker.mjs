import fs from 'node:fs/promises';
await fs.mkdir('public/brand',{recursive:true});
const worker=await fs.readFile('node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs','utf8');
await fs.writeFile('public/brand/maplibre-gl-worker.js',worker.replace(/\n\/\/# sourceMappingURL=.*$/,''));
await fs.copyFile('node_modules/maplibre-gl/LICENSE.txt','public/brand/maplibre-LICENSE.txt');
