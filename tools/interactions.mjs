import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(e.message));

await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.click('.nav-hamburger button');
await page.waitForTimeout(400);
console.log('mobile nav expanded:', await page.getAttribute('nav#nav', 'aria-expanded'));
console.log('nav sections visible:', await page.isVisible('.nav-sections'));
await page.screenshot({ path: '../docs/demo/screenshots/home-mobile-nav.png' });

await page.goto('http://localhost:3000/products/chromasilk-vivids-pastels', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const before = await page.getAttribute('.product-gallery-main img', 'src');
await page.click('.product-gallery-thumb:nth-child(2)');
await page.waitForTimeout(300);
const after = await page.getAttribute('.product-gallery-main img', 'src');
console.log('gallery changed:', before !== after);
await page.click('.accordion-summary');
console.log('accordion open:', await page.evaluate(() => document.querySelector('.accordion-item')?.open));

await page.goto('http://localhost:3000/l/introkit', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.fill('input[name="firstName"]', 'Demo');
await page.fill('input[name="lastName"]', 'User');
await page.fill('input[name="email"]', 'demo@example.com');
await page.check('input[name="consent"]');
await page.click('button[type="submit"]');
await page.waitForTimeout(300);
console.log('form status:', await page.textContent('.form-status'));

await page.goto('http://localhost:3000/resources/faq', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.click('.faq-question');
console.log('faq open:', await page.evaluate(() => document.querySelector('.faq-item')?.open));

console.log('errors:', errors.length ? errors : 'none');
await browser.close();
