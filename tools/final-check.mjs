import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const video = await page.evaluate(() => {
  const v = document.querySelector('.hero-video-desktop');
  return v ? { tag: v.tagName, paused: v.paused, currentTime: v.currentTime, readyState: v.readyState, videoWidth: v.videoWidth } : null;
});
console.log('hero media:', JSON.stringify(video));
await page.fill('#footer-email', 'demo@example.com');
await page.click('.footer-newsletter button');
await page.waitForTimeout(300);
console.log('newsletter status:', await page.textContent('.footer-newsletter-status'));
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
