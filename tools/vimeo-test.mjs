import { chromium } from 'playwright';
const ids = ['1184894506','1184893069','1063333918'];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
for (const id of ids) {
  const url = `https://player.vimeo.com/video/${id}?autopause=0&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0&sidedock=0&controls=0&background=1&quality=720p`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const text = (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g,' ').trim();
  console.log(id, '=>', text.slice(0, 200) || '(no text)');
  await page.screenshot({ path: `../docs/demo/screenshots/vimeo-${id}.png` });
}
await browser.close();
