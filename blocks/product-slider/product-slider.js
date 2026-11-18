import { cellImage, cellText, isUrl } from '../../scripts/content-cells.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const track = document.createElement('div');
  track.className = 'product-slider-track';

  rows.forEach((row) => {
    const [imageCell, titleCell, descriptionCell, urlCell] = row.children;
    const image = cellImage(imageCell);
    const title = cellText(titleCell);
    const description = cellText(descriptionCell);
    const href = cellText(urlCell);

    const item = document.createElement('article');
    item.className = 'product-slider-item';

    if (image) {
      const img = document.createElement('img');
      img.src = image.src;
      img.alt = image.alt;
      img.loading = 'lazy';
      item.append(img);
    }

    const body = document.createElement('div');
    body.className = 'product-slider-body';

    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title;
      body.append(h3);
    }

    if (description) {
      const p = document.createElement('p');
      p.textContent = description;
      body.append(p);
    }

    if (isUrl(href)) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = 'Explore';
      a.className = 'product-slider-link';
      body.append(a);
    }

    item.append(body);
    track.append(item);
  });

  block.textContent = '';
  block.append(track);

  if (rows.length > 2) {
    const controls = document.createElement('div');
    controls.className = 'product-slider-controls';

    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'product-slider-prev';
    prev.setAttribute('aria-label', 'Previous products');
    prev.textContent = '←';

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'product-slider-next';
    next.setAttribute('aria-label', 'Next products');
    next.textContent = '→';

    const scrollByItem = (direction) => {
      const item = track.querySelector('.product-slider-item');
      const amount = item ? item.getBoundingClientRect().width + 20 : 320;
      track.scrollBy({ left: direction * amount, behavior: 'smooth' });
    };

    prev.addEventListener('click', () => scrollByItem(-1));
    next.addEventListener('click', () => scrollByItem(1));
    controls.append(prev, next);
    block.append(controls);
  }
}
