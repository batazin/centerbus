import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=createRequire(import.meta.url)(process.env.CENTER_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.CENTER_PREVIEW_URL||'http://localhost:3100';
const browser=await chromium.launch({channel:'msedge',headless:true});
const results=[];
try{
 for(const [width,height] of [[320,740],[360,800],[390,844],[430,932],[768,1024],[844,390]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true});
  const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.locator('.forge-preloader.loaded').waitFor({state:'attached'});
  for(const id of ['approach','steps','equipe','services','ordinary','builds']){
   await page.locator('#'+id).scrollIntoViewIfNeeded();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${width}: overflow at ${id}`);
  }
  const state=await page.evaluate(()=>{
   const header=document.querySelector('.forge-header');
   const style=getComputedStyle(header);
   const slot=getComputedStyle(document.querySelector('.forge-approach-aperture-slot'));
   return {last:[...document.querySelectorAll('.forge-body>section')].at(-1)?.id,removed:!!document.querySelector('#stock,#contact,.forge-footer-section'),clip:slot.clipPath,position:slot.position,shadow:style.boxShadow,background:style.backgroundImage};
  });
  assert.equal(state.last,'builds');assert.equal(state.removed,false);assert.equal(state.clip,'none');assert.equal(state.position,'relative');assert.equal(state.shadow,'none');assert.equal(state.background,'none');
  assert.equal(errors.length,0);assert.equal(requests.some(url=>url.includes('/bus-drive-flow-v5/')),false);
  assert.ok(requests.some(url=>url.includes('/bus-drive-flow-mobile-v5/')));
  for(const route of ['/produtos','/vendedores','/fale-conosco']){
   await page.goto(base+route,{waitUntil:'domcontentloaded'});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${width}: ${route}`);
  }
  results.push({width,height,...state,errors,passed:true});await page.close();
 }
 fs.writeFileSync('review/mobile-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}
