import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(e.message));

await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
console.log('pages:', await page.locator('.page-link').count());
console.log('sections:', await page.locator('.section-card').count());

await page.locator('.page-link', { hasText: 'About' }).click();
await page.waitForTimeout(800);
console.log('about title:', await page.textContent('#page-title'));
console.log('about sections:', await page.locator('.section-card').count());

const editable = page.locator('.editable').filter({ hasText: 'About' }).first();
await editable.click();
await page.keyboard.press('End');
await page.keyboard.type(' Us');
await page.waitForTimeout(200);
await page.click('#save');
await page.waitForTimeout(600);
console.log('status:', await page.textContent('#status'));
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
