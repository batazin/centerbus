import { createRequire } from 'node:module';
const load = createRequire(import.meta.url);
const {chromium}=load(process.env.CENTER_PLAYWRIGHT_MODULE || 'playwright');
import fs from 'node:fs';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:"msedge"});
 const results=[];
 for(const config of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'reduced',width:1280,height:800,reducedMotion:'reduce'}]){
  const page=await browser.newPage({viewport:{width:config.width,height:config.height},reducedMotion:config.reducedMotion??'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:3100',{waitUntil:'domcontentloaded',timeout:120000});
  await page.locator('.forge-preloader.loaded').waitFor({state:'attached',timeout:120000}); await page.waitForTimeout(300);
  await page.screenshot({path:`review/${config.name}-hero.png`});
  const overflow=[];
  const height=await page.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<height;y+=650){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(80);const o=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);if(o)overflow.push(y);}
  await page.waitForTimeout(700);
  // Explicitly decode lazy images, including inactive service panels.
  const broken=await page.locator('img').evaluateAll(async imgs=>{const failed=[];await Promise.all(imgs.map(async im=>{im.loading='eager';try{await im.decode();if(!im.naturalWidth)failed.push(im.src);}catch{failed.push(im.src);}}));return failed;});
  for(const id of ['approach','steps','services','ordinary','stock','contact']){
   await page.locator(`#${id}`).scrollIntoViewIfNeeded(); await page.waitForTimeout(450);
   await page.screenshot({path:`review/${config.name}-${id}.png`});
  }
  await page.getByRole('button',{name:'Abrir menu de navegação'}).click();
  await page.waitForTimeout(400);
  const menu=await page.evaluate(()=>({open:document.body.dataset.menuOpen,active:document.activeElement?.textContent,overflow:getComputedStyle(document.body).overflowY}));
  await page.keyboard.press('Escape');await page.waitForTimeout(250);
  const closed=await page.evaluate(()=>document.body.dataset.menuOpen===undefined);
  results.push({viewport:config.name,errors,overflow,broken,menu,closed});await page.close();
 }
 const page=await browser.newPage();
 for(const route of ['/produtos','/sobre/a-center-onibus','/sobre/politica-de-privacidade','/vendedores','/blog','/fale-conosco']){
  const response=await page.goto(`http://localhost:3100${route}`,{waitUntil:'domcontentloaded',timeout:120000});results.push({route,status:response.status(),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)});
 }
 await page.getByRole('button',{name:'Preparar e-mail'}).waitFor();
 await page.getByLabel('Nome ou empresa').fill('Teste de validação');await page.getByLabel('E-mail',{exact:true}).fill('teste@example.com');await page.getByLabel('Telefone / WhatsApp').fill('11999999999');await page.getByLabel('Motivo do contato').selectOption('identificacao');await page.getByLabel('Detalhes da solicitação').fill('Código CO, modelo e quantidade.');
 // Capture mailto without opening or sending a message.
 await page.route('mailto:**',route=>route.abort());
 await page.getByRole('button',{name:'Preparar e-mail'}).click();await page.getByText('Seu e-mail está preparado.').waitFor();
 results.push({formPrepared:await page.getByText('Seu e-mail está preparado.').isVisible(),formHref:await page.getByRole('link',{name:'Abrir aplicativo de e-mail'}).getAttribute('href')});
 await browser.close();fs.writeFileSync('review/browser-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
 if(results.some(r=>(r.errors?.length??0)||(r.broken?.length??0)||(Array.isArray(r.overflow)?r.overflow.length:r.overflow===true)||(r.status&&r.status!==200)||r.closed===false||r.formPrepared===false))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});




