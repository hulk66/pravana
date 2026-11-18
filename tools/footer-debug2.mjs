import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const info = await page.evaluate(() => {
  const f = document.querySelector('footer .footer');
  const out = [];
  const walk = (el, depth = 0) => {
    if (!el || depth > 6) return;
    const cs = getComputedStyle(el);
    out.push(`${'  '.repeat(depth)}<${el.tagName.toLowerCase()} class="${el.className}"> display=${cs.display} cols=${cs.gridTemplateColumns} pad=${cs.padding}`);
    [...el.children].forEach((c) => walk(c, depth + 1));
  };
  walk(f);
  return out;
});
console.log(info.join('\n'));
await browser.close();
