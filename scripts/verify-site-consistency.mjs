import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.CENTER_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.CENTER_PREVIEW_URL||'http://localhost:3100';
const routes=Object.keys(JSON.parse(fs.readFileSync('.next/prerender-manifest.json','utf8')).routes).filter(route=>!['/_global-error','/_not-found','/favicon.ico','/home-2','/scroll-lab','/webgpu-lab','/sobre'].includes(route));
fs.mkdirSync('review/consistency',{recursive:true});
const browser=await chromium.launch({headless:true,channel:'msedge'});const results=[];
try{for(const width of [1440,390,320]){
 const page=await browser.newPage({viewport:{width,height:900},hasTouch:width<1024,isMobile:width<1024});let errors=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error'&&/hydrat|did not match|React error #4(?:18|23|25)/i.test(message.text()))errors.push(message.text());});let footerText;
 for(const route of routes){
  errors=[];const response=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:120000});
  await page.locator('.forge-header').waitFor();if(route==='/')await page.locator('.forge-preloader.loaded').waitFor({state:'attached'});
  await page.waitForFunction(()=>!document.querySelector('.forge-menu-trigger').disabled);
  await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(200);
  const data=await page.evaluate(()=>{
   const header=document.querySelector('.forge-header'),footer=document.querySelector('.institutional-footer'),h1=document.querySelector('h1');
   return {headers:document.querySelectorAll('.forge-header').length,legacyHeaders:document.querySelectorAll('.institutional-header').length,footers:document.querySelectorAll('.institutional-footer').length,logoWidth:header.querySelector('img').getBoundingClientRect().width,background:getComputedStyle(header).backgroundColor,h1Font:getComputedStyle(h1).fontFamily,footerLogo:footer.querySelector('img').getAttribute('src'),footerText:footer.textContent.replace(/\s+/g,' ').trim(),offices:footer.querySelectorAll('.footer-office').length,overflow:document.documentElement.scrollWidth>innerWidth+1};
  });
  assert.equal(response.status(),200,route);assert.equal(data.headers,1,route);assert.equal(data.legacyHeaders,0,route);assert.equal(data.footers,1,route);assert.equal(data.offices,3,route);assert.equal(data.overflow,false,route);
  assert.equal(data.background,'rgba(0, 0, 0, 0)',route);assert.equal(Math.round(data.logoWidth),width<1024?124:150,route);assert.ok(data.h1Font.toLowerCase().includes('archivo'),route);assert.ok(data.footerLogo.includes('partial-negative'),route);
  footerText??=data.footerText;assert.equal(data.footerText,footerText,route);
  const key=route==='/'?'home':route.slice(1).replaceAll('/','-');
  await page.screenshot({caret:'initial',path:`review/consistency/${width}-${key}.png`});
  if(route==='/'){await page.locator('.institutional-footer').scrollIntoViewIfNeeded();await page.waitForTimeout(250);await page.screenshot({caret:'initial',path:`review/consistency/${width}-home-footer.png`});await page.evaluate(()=>scrollTo(0,0));await page.locator('.forge-header').waitFor({state:'visible'});}
  try {
   await page.getByRole('button',{name:'Abrir menu de navegação',exact:true}).click();
   await page.locator('.forge-nav-overlay.open').waitFor({state:'visible',timeout:10000});
  } catch(error) {
   console.error({route,width,errors,header:await page.locator('.forge-header').getAttribute('class')});
   await page.screenshot({caret:'initial',path:'review/consistency/menu-failure.png'});throw error;
  }
  assert.equal(await page.locator('.forge-nav-overlay.open').count(),1,route);assert.equal(await page.locator('.forge-nav-main a').count(),6,route);assert.equal(await page.locator('.center-nav-about a').count(),5,route);
  await page.keyboard.press('Escape');assert.equal(await page.getByRole('button',{name:'Abrir menu de navegação',exact:true}).getAttribute('aria-expanded'),'false',route);
  await page.locator('.institutional-footer').scrollIntoViewIfNeeded();await page.waitForTimeout(100);
  assert.ok((await page.locator('.forge-header img').getAttribute('src')).includes('partial-negative'),`${route}: footer header contrast`);
  if(width<1024)assert.equal(await page.locator('.forge-header').evaluate(el=>getComputedStyle(el).visibility),'hidden',`${route}: mobile footer must stay unobstructed`);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,route);
  assert.equal(errors.length,0,`${route}: ${errors.join(', ')}`);
  results.push({width,route,status:response.status(),header:true,footer:true,menu:true,overflow:false,errors});
 }
 await page.goto(base,{waitUntil:'domcontentloaded'});await page.locator('.forge-preloader.loaded').waitFor({state:'attached'});
 await page.getByRole('button',{name:'Abrir menu de navegação',exact:true}).click();await page.locator('.forge-nav-main a[href="/produtos"]').click();await page.waitForURL('**/produtos');
 await page.locator('.catalog-hero').waitFor();await page.waitForFunction(()=>document.querySelector('.forge-header img').getAttribute('src').includes('partial-negative'));
 await page.getByRole('button',{name:'Abrir menu de navegação',exact:true}).click();await page.locator('.forge-nav-main a[href="/blog"]').click();await page.waitForURL('**/blog');await page.locator('.blog-featured-card').click();await page.waitForURL('**/blog/*');
 await page.locator('.article-header').waitFor();await page.waitForFunction(()=>document.querySelector('.forge-header img').getAttribute('src').includes('color'));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 if(width===1440){
  await page.goto(base+'/produtos',{waitUntil:'networkidle'});await page.waitForFunction(()=>!document.querySelector('.forge-menu-trigger').disabled);
  await page.getByLabel('Buscar no catálogo').fill('11084');await page.waitForFunction(()=>document.querySelectorAll('.catalog-card-link').length===1);
  await page.getByLabel('Buscar no catálogo').fill('produto-inexistente-zz');await page.locator('.catalog-empty').waitFor();await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('.catalog-card-link').length===8);
  await page.goto(base+'/vendedores',{waitUntil:'networkidle'});await page.waitForFunction(()=>!document.querySelector('.forge-menu-trigger').disabled);await page.getByRole('tab',{name:/Bahia/}).click();await page.waitForFunction(()=>document.querySelectorAll('.seller-card').length===2);
  await page.getByRole('tab',{name:/Rio de Janeiro/}).click();await page.locator('.center-rj-team').waitFor();await page.getByRole('tab',{name:/São Paulo/}).click();await page.waitForFunction(()=>document.querySelectorAll('.seller-card').length===12);
  await page.getByLabel('Buscar vendedor').fill('Ferreira');await page.waitForFunction(()=>document.querySelectorAll('.seller-card').length===1);
 }
 await page.close();
}fs.writeFileSync('review/consistency/results.json',JSON.stringify(results,null,2));console.log(`Passed ${results.length} route/viewport checks across ${routes.length} public pages.`);}finally{await browser.close();}
