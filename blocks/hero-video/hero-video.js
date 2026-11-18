export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;
  const [videoCell, logoCell, subtitleCell, ctaCell, posterCell] = row.children;
  const title = videoCell?.querySelector('a')?.textContent.trim() || '';
  const logo = logoCell?.querySelector('img');
  const subtitle = subtitleCell?.textContent.trim() || '';
  const cta = ctaCell?.querySelector('a');
  const poster = posterCell?.querySelector('img');

  block.textContent = '';
  const hero = document.createElement('div');
  hero.className = 'hero-video-inner';

  if (poster) {
    const img = document.createElement('img');
    img.src = poster.src;
    img.alt = poster.alt;
    img.className = 'hero-video-poster';
    hero.append(img);
  }

  const overlay = document.createElement('div');
  overlay.className = 'hero-video-overlay';

  if (title) {
    const h1 = document.createElement('h1');
    h1.className = 'hero-video-title';
    h1.textContent = title;
    overlay.append(h1);
  }

  if (logo) {
    const img = document.createElement('img');
    img.src = logo.src;
    img.alt = logo.alt;
    img.className = 'hero-video-logo';
    overlay.append(img);
  }

  if (subtitle) {
    const p = document.createElement('p');
    p.className = 'hero-video-subtitle';
    p.textContent = subtitle;
    overlay.append(p);
  }

  if (cta) {
    const a = document.createElement('a');
    a.href = cta.href;
    a.textContent = cta.textContent;
    a.className = 'button primary';
    overlay.append(a);
  }

  hero.append(overlay);
  block.append(hero);
}
