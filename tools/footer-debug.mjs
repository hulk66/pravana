import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const info = await page.evaluate(() => {
  const f = document.querySelector('footer .footer');
  const walk = (el, depth = 0) => {
    if (!el || depth > 4) return [];
    const rows = [`${'  '.repeat(depth)}<${el.tagName.toLowerCase()} class="${el.className}">`];
    [...el.children].forEach((c) => rows.push(...walk(c, depth + 1)));
    return rows;
  };
  return walk(f);
});
console.log(info.join('\n'));
await browser.close();
