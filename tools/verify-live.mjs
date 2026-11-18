import { chromium } from 'playwright';
const base='https://main--pravana--hulk66.aem.live';
const paths=['','about','products/chromasilk-vivids-pastels','learn/blog/digital-purple','events/mastering-gray-coverage','l/introkit','resources/faq'];
const browser=await chromium.launch();
const out=[];
for(const p of paths){
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const errors=[]; page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const resp=await page.goto(`${base}/${p}`,{waitUntil:'networkidle',timeout:60000});
  await page.waitForTimeout(1500);
  const data=await page.evaluate(()=>{
    const imgs=[...document.images];
    return {
      title:document.title,
      h1:document.querySelector('h1')?.textContent.trim()||'',
      header:!!document.querySelector('header'),
      footer:!!document.querySelector('footer'),
      sections:document.querySelectorAll('main > div').length,
      images:imgs.length,
      broken:imgs.filter(i=>i.complete&&i.naturalWidth===0).length,
      emptyAlt:imgs.filter(i=>!i.alt).length,
      deadLinks:[...document.querySelectorAll('a[href="#"]')].length,
    };
  });
  out.push({path:'/'+p,status:resp.status(),...data,errors:errors.slice(0,3)});
  await page.screenshot({path:`/tmp/preview-${p.replace(/\//g,'_')||'home'}.png`,fullPage:true});
  await page.close();
}
await browser.close();
console.log(JSON.stringify(out,null,1));
