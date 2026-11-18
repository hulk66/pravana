import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const base = 'https://main--pravana--hulk66.aem.live';
const out = '../docs/demo/screenshots/live';
mkdirSync(out, { recursive: true });
const pages = [
  ['', 'home'], ['products/chromasilk-vivids-pastels', 'pdp'],
  ['learn/blog/digital-purple', 'blog'], ['events/mastering-gray-coverage', 'event'],
  ['about', 'about'], ['l/introkit', 'landing'], ['resources/faq', 'faq'],
];
const browser = await chromium.launch();
for (const [path, name] of pages) {
  for (const [suffix, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport });
    await page.goto(`${base}/${path}`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${out}/${name}-${suffix}.png`, fullPage: true });
    await page.close();
    console.log(`${name}-${suffix}`);
  }
}
await browser.close();
