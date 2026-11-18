import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(e.message));

await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.locator('.page-link', { hasText: 'About' }).click();
await page.waitForTimeout(800);

const h1 = page.locator('.cell-el').filter({ has: page.locator('.tag', { hasText: /^h1$/ }) }).locator('.editable').first();
console.log('h1 field text:', await h1.textContent());
await h1.click();
await page.keyboard.press('End');
await page.keyboard.type(' Us');
await page.waitForTimeout(200);
await page.click('#save');
await page.waitForTimeout(600);
console.log('status:', await page.textContent('#status'));
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
