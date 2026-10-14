import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';

const source=path.resolve(process.argv[2]||'asset-sources/flow-v5/omni-enhanced-1080p.mp4');
const ffmpeg=process.env.CENTER_FFMPEG||path.resolve('review/video-tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe');
if(!fs.existsSync(source)||!fs.existsSync(ffmpeg))throw Error('Supply the source video and CENTER_FFMPEG path.');
const variants=[{name:'bus-drive-flow-v5',width:1920,height:1080,quality:78},{name:'bus-drive-flow-mobile-v5',width:960,height:540,quality:72}];
const manifest={source:'Google Flow / Omni 1.1 Flash',scene:'cf054867-d6b6-41b5-a623-5c2d99ab2de9',sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),durationSeconds:8,nativeFps:24,nativeResolution:'1280x720',exportResolution:'1920x1080 enhanced by Flow',sequenceFrames:241,sampling:'30 fps with nearest native-frame sampling; final frame held once. No optical interpolation.',variants:[]};
for(const variant of variants){
 const directory=path.resolve('public/sequences',variant.name);fs.mkdirSync(directory,{recursive:true});
 const result=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',source,'-an','-vf',`fps=30,tpad=stop_mode=clone:stop_duration=0.05,scale=${variant.width}:${variant.height}:flags=lanczos`,'-frames:v','241','-c:v','libwebp','-quality',String(variant.quality),'-compression_level','6',path.join(directory,'frame_%04d.webp')],{encoding:'utf8'});
 if(result.status!==0)throw Error(result.stderr||'Frame extraction failed');
 let bytes=0;
 for(let i=1;i<=241;i++){const file=path.join(directory,`frame_${String(i).padStart(4,'0')}.webp`);const metadata=await sharp(file).metadata();if(metadata.width!==variant.width||metadata.height!==variant.height)throw Error('Invalid frame: '+file);bytes+=fs.statSync(file).size;}
 manifest.variants.push({...variant,bytes});
 console.log(`${variant.name}: 241 frames, ${(bytes/1048576).toFixed(2)} MB`);
}
fs.writeFileSync('public/sequences/flow-v5-manifest.json',JSON.stringify(manifest,null,2)+'\n');
