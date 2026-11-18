import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(e.message));

await page.goto('http://localhost:3000/learn/blog/digital-purple', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
console.log('blog article section:', await page.evaluate(() => ({
  articleClass: document.querySelector('.article')?.className,
  h1: document.querySelector('h1')?.textContent?.trim(),
  images: document.querySelectorAll('.article img').length,
})));
await page.screenshot({ path: '../docs/demo/screenshots/blog-desktop.png', fullPage: true });

await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.fill('input[type="email"]', 'demo@example.com');
await page.fill('input[type="text"]', 'Demo');
await page.click('button[type="submit"]');
await page.waitForTimeout(300);
console.log('home form status:', await page.textContent('.form-status'));

await page.goto('http://localhost:3000/l/introkit', { waitUntil: 'networkidle' });
await page.fill('input[type="text"][name="first-name"]', 'Demo');
await page.fill('input[type="text"][name="last-name"]', 'User');
await page.fill('input[type="email"]', 'demo@example.com');
await page.check('input[type="checkbox"]');
await page.click('button[type="submit"]');
await page.waitForTimeout(300);
console.log('landing form status:', await page.textContent('.form-status'));
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
