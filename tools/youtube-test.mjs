import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto('https://www.youtube.com/embed/FA9AkhzX348?autoplay=1&mute=1&loop=1&playlist=FA9AkhzX348&controls=0&modestbranding=1', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
await page.waitForTimeout(3000);
console.log((await page.locator('body').innerText().catch(() => '')).replace(/\s+/g,' ').trim().slice(0, 300));
await page.screenshot({ path: '../docs/demo/screenshots/youtube-test.png' });
await browser.close();
