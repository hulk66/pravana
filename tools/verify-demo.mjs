import { chromium } from 'playwright';

const base = 'http://localhost:3000';
const pages = [
  ['/', 'home'],
  ['/products/chromasilk-vivids-pastels', 'pdp'],
  ['/learn/blog/digital-purple', 'blog'],
  ['/events/mastering-gray-coverage', 'event'],
  ['/l/introkit', 'landing'],
  ['/about', 'about'],
  ['/resources/faq', 'faq'],
];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));

for (const [path, name] of pages) {
  errors.length = 0;
  await page.goto(base + path, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1200);
  const info = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector('main h1')?.textContent?.trim() || '',
    header: !!document.querySelector('header .nav-brand'),
    footer: !!document.querySelector('footer .footer'),
    sections: document.querySelectorAll('main > .section').length,
    images: document.querySelectorAll('main img').length,
    brokenImages: [...document.querySelectorAll('main img')].filter((img) => !img.complete || img.naturalWidth === 0).length,
  }));
  console.log(`${name}: ${JSON.stringify(info)}`);
  if (errors.length) console.log(`${name} errors:\n${errors.join('\n')}`);
  await page.screenshot({ path: `../docs/demo/screenshots/${name}-desktop.png`, fullPage: true });
}

await page.setViewportSize({ width: 390, height: 844 });
for (const [path, name] of pages) {
  await page.goto(base + path, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `../docs/demo/screenshots/${name}-mobile.png`, fullPage: true });
  console.log(`${name}: mobile captured`);
}

await browser.close();
