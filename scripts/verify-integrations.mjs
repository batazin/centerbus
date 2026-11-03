// Exercises the built Next.js server against an isolated local feed, without publishing content.
import assert from 'node:assert/strict';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';

const id='0c9ef7c4-a5ed-4690-9323-225dc8a63faf';
let published=false,connected=false,items=true;
const product={slug:'mlb12345678',name:'Produto de integração isolado',shortName:'Produto de integração isolado',code:'TEST',category:'componentes',categoryLabel:'Componentes técnicos',description:'Descrição original',application:'Consultar anúncio',dimensions:'Consultar anúncio',reference:'TEST',availability:'Disponível no Mercado Livre',visualMark:'ML',image:'https://http2.mlstatic.com/test.jpg',imageAlt:'Peça de teste',features:['Dado do anúncio'],identification:['Conferir aplicação'],marketplaceUrl:'https://produto.mercadolivre.com.br/MLB-12345678-teste',price:123.45};
const feed=http.createServer((req,res)=>{
  res.setHeader('Content-Type','application/json');
  if(req.url==='/public/posts')res.end(JSON.stringify({version:1,posts:published?[{id,at:new Date().toISOString(),article:{title:'Publicação de integração isolada',description:'Texto de teste',paragraphs:['Introdução segura','Conteúdo <script>alert(1)</script>'],sources:[{title:'Fonte de teste',url:'https://example.com/manual'}]}}]:[]}));
  else res.end(JSON.stringify({version:1,connected,updatedAt:new Date().toISOString(),products:items?[product]:[]}));
});
await new Promise(resolve=>feed.listen(0,'127.0.0.1',resolve));
const upstream=`http://127.0.0.1:${feed.address().port}`;
const port=4317,origin=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p',String(port)],{cwd:process.cwd(),env:{...process.env,CENTER_ECOSYSTEM_ORIGIN:upstream},stdio:['ignore','pipe','pipe']});
let logs='';server.stdout.on('data',data=>logs+=data);server.stderr.on('data',data=>logs+=data);
async function page(path){return fetch(origin+path,{signal:AbortSignal.timeout(15000)});}
try{
  let ready=false;for(let i=0;i<60;i++){try{if((await page('/blog')).ok){ready=true;break;}}catch{}await delay(500);}
  assert.ok(ready,logs);
  assert.equal((await page('/blog/'+id)).status,404,'draft cannot be read');
  published=true;
  assert.match(await(await page('/blog')).text(),/Publicação de integração isolada/);
  const article=await page('/blog/'+id);assert.equal(article.status,200,'new slug works without rebuild');
  const html=await article.text();assert.match(html,/Fontes da pesquisa/);assert.match(html,/Conteúdo &lt;script&gt;/);assert.ok(!html.includes('<script>alert(1)</script>'));
  connected=true;
  assert.match(await(await page('/produtos')).text(),/Produto de integração isolado/);
  const detail=await page('/produtos/'+product.slug);assert.equal(detail.status,200);
  const offer=await detail.text();assert.match(offer,/123,45/);assert.match(offer,/Comprar no Mercado Livre/);
  assert.match(await(await page('/sitemap.xml')).text(),new RegExp(id));
  items=false;
  assert.equal((await page('/produtos/'+product.slug)).status,404,'removed listing is no longer purchasable');
  assert.ok(!(await(await page('/produtos')).text()).includes('Produto de integração isolado'));
  console.log('PASS: rascunho privado, publicação sem rebuild, fontes e escape HTML, catálogo dinâmico, preço, link de compra, sitemap e remoção de produto.');
}finally{
  server.kill();feed.close();
}
