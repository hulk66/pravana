import { cellImage, cellText, isUrl } from '../../scripts/content-cells.js';

export default function decorate(block) {
  const rows = [...block.children];
  const cell = (r, c) => rows[r]?.children[c];

  const title = cellText(cell(0, 0));
  const logo = cellImage(cell(0, 1));
  const desktopLink = cellText(cell(1, 0));
  const mobileLink = cellText(cell(1, 1));
  const subtitle = cellText(cell(2, 0));
  const ctaLabel = cellText(cell(2, 1));
  const ctaHref = cellText(cell(3, 0));
  const poster = cellImage(cell(3, 1));

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

  const makeMedia = (link, className) => {
    if (!link) return;
    const videoId = link.match(/vimeo\.com\/(\d+)/)?.[1];
    if (videoId) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://player.vimeo.com/video/${videoId}?autopause=0&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0&sidedock=0&controls=0&background=1&quality=720p`;
      iframe.title = 'PRAVANA campaign video';
      iframe.className = `hero-video-frame ${className}`;
      iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      hero.append(iframe);
      return;
    }

    if (/\.(mp4|webm)(\?|$)/.test(link)) {
      const video = document.createElement('video');
      video.src = link;
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.className = `hero-video-frame ${className}`;
      video.setAttribute('aria-label', 'PRAVANA campaign video');
      hero.append(video);
    }
  };

  makeMedia(desktopLink, 'hero-video-desktop');
  makeMedia(mobileLink, 'hero-video-mobile');

  const overlay = document.createElement('div');
  overlay.className = 'hero-video-overlay';

  if (logo) {
    const img = document.createElement('img');
    img.src = logo.src;
    img.alt = logo.alt;
    img.className = 'hero-video-logo';
    overlay.append(img);
  }

  if (title) {
    const h1 = document.createElement('h1');
    h1.className = 'hero-video-title';
    h1.textContent = title;
    overlay.append(h1);
  }

  if (subtitle) {
    const p = document.createElement('p');
    p.className = 'hero-video-subtitle';
    p.textContent = subtitle;
    overlay.append(p);
  }

  if (ctaHref && isUrl(ctaHref)) {
    const a = document.createElement('a');
    a.href = ctaHref;
    a.textContent = ctaLabel || 'Learn more';
    a.className = 'button primary';
    overlay.append(a);
  }

  hero.append(overlay);
  block.append(hero);
}
