import { chromium } from 'playwright';
const browser = await chromium.launch();
const editor = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await editor.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
await editor.waitForTimeout(700);
await editor.locator('.page-link', { hasText: 'About' }).click();
await editor.waitForTimeout(700);
const h1 = editor.locator('.cell-el').filter({ has: editor.locator('.tag', { hasText: /^h1$/ }) }).locator('.editable').first();
await h1.click();
await editor.keyboard.press('End');
await editor.keyboard.type(' Us');
await editor.click('#save');
await editor.waitForTimeout(700);

const demo = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await demo.goto('http://localhost:3000/about', { waitUntil: 'networkidle' });
await demo.waitForTimeout(700);
console.log('demo h1 after save:', await demo.textContent('h1'));
await browser.close();
