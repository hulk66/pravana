import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on('console', (m) => console.log(`CONSOLE[${m.type()}]`, m.text()));
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
page.on('requestfailed', (r) => console.log('REQFAIL', r.url(), r.failure()?.errorText));
page.on('response', (r) => { if (r.status() >= 400) console.log('HTTP', r.status(), r.url()); });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1500);
const info = await page.evaluate(() => {
  const main = document.querySelector('main');
  const blocks = [...main.querySelectorAll('[class]')].filter((el) => el.className && !el.className.includes('wrapper') && !el.className.includes('section') && !el.className.includes('default-content')).slice(0, 20);
  return {
    bodyClass: document.body.className,
    mainHtml: main.innerHTML.slice(0, 1200),
    blockEls: blocks.map((el) => ({ cls: el.className, status: el.dataset.blockStatus || '', tag: el.tagName })),
    hlx: window.hlx ? Object.keys(window.hlx) : null,
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
