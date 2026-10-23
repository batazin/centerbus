import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.CENTER_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.CENTER_PREVIEW_URL||'http://localhost:3100';
const routes=Object.keys(JSON.parse(fs.readFileSync('.next/prerender-manifest.json','utf8')).routes).filter(route=>!['/_global-error','/_not-found','/favicon.ico','/home-2','/scroll-lab','/webgpu-lab','/sobre'].includes(route));
fs.mkdirSync('review/october',{recursive:true});
const browser=await chromium.launch({headless:true,channel:'msedge'});const results=[];
try{
 for(const [width,height] of [[1440,900],[390,844],[320,740],[844,390]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:width<1024,hasTouch:width<1024});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const route of width===320||width===844?['/','/vendedores']:routes){
   const response=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:120000});
   assert.equal(response.status(),200);
   await page.waitForFunction(()=>document.querySelector('.forge-menu-trigger')?.disabled===false);
   if(route==='/')await page.locator('.forge-preloader.loaded').waitFor({state:'attached'});
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('.branch-whatsapp-toggle').count(),1);
   assert.equal(await page.locator('.office-map').count(),3);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${route} ${width} overflow`);
   const logo=await page.locator('.forge-header img').evaluate(el=>el.getBoundingClientRect().width);
   assert.ok(logo>= (width<=380?146:width<1024?164:210)-1,`logo ${logo}`);
   assert.equal(await page.locator('.branch-whatsapp-toggle').evaluate(el=>{const r=el.getBoundingClientRect();return Math.abs(r.width-r.height)<1&&getComputedStyle(el).borderRadius==='50%';}),true,'Round WhatsApp button');
   await page.getByRole('button',{name:'WhatsApp: escolher unidade'}).click();
   const panel=page.locator('.branch-whatsapp-panel');await panel.waitFor();
   assert.equal(await panel.locator('a').count(),3);
   for(const digits of ['551129673002','557199822458','5521972012525'])assert.equal(await panel.locator(`a[href^="https://wa.me/${digits}?"]`).count(),1);
   assert.equal(await panel.evaluate(el=>el.getBoundingClientRect().left>=0&&el.getBoundingClientRect().right<=innerWidth+1),true);
   await page.keyboard.press('Escape');assert.equal(await panel.count(),0);
   assert.equal(await page.locator('a[href="mailto:"],a[href="tel:"],a[href="https://wa.me/"]').count(),0);
   if(route==='/'){
    assert.match(await page.locator('h1').innerText(),/Com a Center,[\s\S]*o ônibus nunca para/);
    assert.equal(await page.locator('#ordinary,.forge-statement-section').count(),0);
    assert.equal(await page.locator('#hero .center-manufacturer-group').count(),2);
    const pause=page.locator('#hero .center-manufacturer-access button');await pause.click();assert.equal(await pause.getAttribute('aria-pressed'),'true');await pause.click();
    await page.screenshot({path:`review/october/${width}-home.png`,caret:'initial'});
    await page.locator('#equipe').scrollIntoViewIfNeeded();await page.locator('.center-team-units button').filter({hasText:'Rio de Janeiro'}).click();
    assert.equal(await page.locator('.center-team-card').count(),4);
    await page.screenshot({path:`review/october/${width}-team-rj.png`,caret:'initial'});
    await page.locator('.institutional-footer').scrollIntoViewIfNeeded();await page.waitForTimeout(300);
    if(width===1440){await page.waitForFunction(()=>document.querySelectorAll('.center-map.is-ready').length===3,{},{timeout:60000});assert.equal(await page.locator('.center-map-pin').count(),3);}
    await page.screenshot({path:`review/october/${width}-footer.png`,caret:'initial'});
   }
   if(route==='/vendedores'){
    assert.equal(await page.locator('.seller-card').count(),21);
    for(const [name,count] of [['Center Ônibus SP',14],['Center Bahia',3],['Center RJ',4]]){
     await page.locator('.state-filter-tabs button').filter({hasText:name}).click();assert.equal(await page.locator('.seller-card').count(),count);
    }
    await page.locator('.state-filter-tabs button').filter({hasText:'Todos os estados'}).click();
    await page.getByLabel('Buscar vendedor').fill('cátia');assert.equal(await page.locator('.seller-card').count(),1);
    assert.equal(await page.locator('#vendedor-catia a').count(),0);
    await page.getByLabel('Buscar vendedor').fill('inexistente-zz');await page.getByRole('button',{name:'Ver todos os vendedores'}).click();
    await page.locator('.sellers-grid').scrollIntoViewIfNeeded();
    await page.screenshot({path:`review/october/${width}-sellers.png`,caret:'initial'});
    assert.equal(await page.locator('.seller-avatar-img').evaluateAll(images=>images.filter(img=>img.complete&&!img.naturalWidth).length),0);
   }
   assert.equal(errors.length,0,errors.join('\n'));results.push({route,width,status:response.status(),whatsapp:true,maps:3,overflow:false});
  }
  await page.close();
 }
 fs.writeFileSync('review/october/results.json',JSON.stringify(results,null,2));console.log(`Passed ${results.length} page/viewport checks; 21 portraits and all branch filters verified.`);
}finally{await browser.close();}
