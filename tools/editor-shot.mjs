import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
await page.waitForTimeout(900);
await page.screenshot({ path: '../docs/demo/screenshots/editor.png', fullPage: false });
await browser.close();
