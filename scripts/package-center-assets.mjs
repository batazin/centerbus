import fs from 'node:fs';
import path from 'node:path';
const destination=path.resolve('review/kit-v5');fs.mkdirSync(destination,{recursive:true});
const source=fs.readFileSync('src/app/home-2/page.tsx','utf8')+fs.readFileSync('src/app/_components/center-rj-team.tsx','utf8');
const photos=[...new Set([...source.matchAll(/\/images\/center-v[234]\/[^"\s]+\.webp/g)].map(match=>'public'+match[0]))];
const files=[...photos,'public/brand','public/images/mobile-v4','public/sequences/bus-drive-flow-v5','public/sequences/bus-drive-flow-mobile-v5','public/sequences/flow-v5-manifest.json','outputs/Center-Onibus-Flow','outputs/Center-Onibus-Entrada-Omni-1080p.mp4','outputs/Center-Onibus-Entrada-Omni-Original-720p.mp4','docs/center-flow-v5.md','docs/center-mobile-v4.md'];
for(const file of fs.readdirSync('src/app/fonts').filter(file=>file.endsWith('.woff2')))files.push('src/app/fonts/'+file);
for(const file of files){const target=path.join(destination,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.cpSync(file,target,{recursive:true});}
fs.writeFileSync(path.join(destination,'LEIA-ME.md'),'# Center Ônibus — assets ativos v5\n\nFotografias ativas da home, logos transparentes, fontes WOFF2, versões móveis e nova entrada do Flow. Os vídeos originais, quadros de referência e a proveniência acompanham o pacote. A fonte do projeto continua no repositório batazin/centerbus.\n');
console.log(`Prepared ${photos.length} active photos, brand assets, fonts and the Flow sequence in ${destination}`);
