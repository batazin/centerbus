import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=createRequire(import.meta.url)(process.env.CENTER_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.CENTER_PREVIEW_URL||'http://localhost:3100';
const browser=await chromium.launch({channel:'msedge',headless:true});
const results=[];
try{for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:900},isMobile:width<1024,hasTouch:width<1024});const errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
 await page.goto(base,{waitUntil:'domcontentloaded'});await page.locator('.forge-preloader.loaded').waitFor({state:'attached'});
 const range=await page.locator('.forge-hero-pin-wrapper').evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,length:el.clientHeight-innerHeight}));
 for(const progress of [0,.5,1]){await page.evaluate(y=>scrollTo(0,y),range.top+range.length*progress);await page.waitForTimeout(900);await page.screenshot({path:`review/flow-v5/hero-${width}-${progress}.png`});}
 const newSequence=requests.filter(url=>url.includes(width<1024?'/bus-drive-flow-mobile-v5/':'/bus-drive-flow-v5/'));
 assert.ok(newSequence.length>5);assert.equal(requests.some(url=>/bus-drive-v2|bus-drive-mobile-v4/.test(url)),false);assert.equal(errors.length,0);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 results.push({width,errors,newFrameRequests:newSequence.length,passed:true});await page.close();
}fs.writeFileSync('review/flow-v5/hero-results.json',JSON.stringify(results,null,2));console.log(results);}finally{await browser.close();}
