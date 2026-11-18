import { chromium } from 'playwright';
const browser = await chromium.launch();
const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
desktop.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
desktop.on('pageerror', (e) => errors.push(e.message));
await desktop.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await desktop.waitForTimeout(2500);
console.log('desktop video:', JSON.stringify(await desktop.evaluate(() => {
  const v = document.querySelector('.hero-video-desktop');
  return v ? { paused: v.paused, t: v.currentTime, w: v.videoWidth, h: v.videoHeight } : null;
})));
await desktop.screenshot({ path: '../docs/demo/screenshots/home-desktop.png', fullPage: true });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await mobile.waitForTimeout(2500);
console.log('mobile video:', JSON.stringify(await mobile.evaluate(() => {
  const v = document.querySelector('.hero-video-mobile');
  return v ? { paused: v.paused, t: v.currentTime, w: v.videoWidth, h: v.videoHeight } : null;
})));
await mobile.screenshot({ path: '../docs/demo/screenshots/home-mobile.png', fullPage: true });
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
