import {createRequire} from 'node:module';
import fs from 'node:fs';
const {chromium}=createRequire(import.meta.url)(process.env.CENTER_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.CENTER_PREVIEW_URL||'http://localhost:3100';
const browser=await chromium.launch({headless:true,channel:'msedge'});
const results=[];
try {
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base,{waitUntil:'domcontentloaded',timeout:120000});
  await page.locator('.forge-preloader.loaded').waitFor({state:'attached'});
  const initialLogo=await page.getByRole('link',{name:'Center Ônibus Início'}).locator('img').getAttribute('src');
  const top=await page.locator('.forge-approach-track').evaluate(el=>el.getBoundingClientRect().top+scrollY);
  await page.evaluate(y=>window.scrollTo(0,y),top+innerSafe(viewport.height));
  await page.waitForTimeout(900);
  const clip=await page.locator('.forge-approach-aperture-slot').evaluate(el=>getComputedStyle(el).clipPath);
  await page.locator('.center-manufacturer-group').first().locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(async im=>{im.loading='eager';await im.decode();}));});
  const logos=await page.locator('.center-manufacturer-group').first().locator('img').evaluateAll(imgs=>imgs.map(im=>({src:im.getAttribute('src'),valid:im.complete&&im.naturalWidth>0})));
  await page.getByRole('button',{name:'Pausar marcas'}).click();
  const paused=await page.locator('.forge-marquee-track').evaluate(el=>getComputedStyle(el).animationPlayState==='paused');
  await page.locator('#equipe').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const lightLogo=await page.getByRole('link',{name:'Center Ônibus Início'}).locator('img').getAttribute('src');
  await page.getByRole('button',{name:'Rio de Janeiro · Filial'}).click();
  const rj=await page.locator('.center-rj-team').isVisible();
  const rjWhatsApp=await page.getByRole('link',{name:'Falar com a equipe RJ'}).getAttribute('href');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  await page.screenshot({path:`review/refinement-${viewport.width}-rj.png`});
  await page.getByRole('button',{name:'São Paulo · Matriz'}).click();
  const sp=await page.locator('.center-team-card').count();
  await page.getByRole('button',{name:'Bahia · Filial'}).click();
  const ba=await page.locator('.center-team-card').count();
  await page.locator('#services').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const serviceLogo=await page.getByRole('link',{name:'Center Ônibus Início'}).locator('img').getAttribute('src');
  results.push({viewport,errors,initialLogo,lightLogo,serviceLogo,clip,logos,paused,rj,rjWhatsApp,overflow,sp,ba});
  await page.close();
 }
 fs.writeFileSync('review/refinement-results.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 if(results.some(r=>r.errors.length||r.overflow||!r.rj||!r.paused||r.sp!==12||r.ba!==2||r.logos.length!==4||r.logos.some(l=>!l.valid||!l.src.endsWith('.png'))||r.clip!==(r.viewport.width<1024?'none':'inset(0%)')||!r.initialLogo.includes('partial-negative')||!r.lightLogo.includes('color')||!r.serviceLogo.includes('color')))throw Error('Refinement verification failed');
} finally {await browser.close();}
function innerSafe(height){return height*.55;}
