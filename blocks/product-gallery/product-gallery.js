import { cellImage } from '../../scripts/content-cells.js';

export default function decorate(block) {
  const images = [...block.children]
    .map((row) => cellImage(row.children[0]))
    .filter(Boolean);

  if (!images.length) return;

  const main = document.createElement('div');
  main.className = 'product-gallery-main';
  const mainImage = document.createElement('img');
  mainImage.src = images[0].src;
  mainImage.alt = images[0].alt;
  main.append(mainImage);

  const thumbs = document.createElement('div');
  thumbs.className = 'product-gallery-thumbs';

  images.forEach((image, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'product-gallery-thumb';
    if (index === 0) button.classList.add('active');
    button.setAttribute('aria-label', `View image ${index + 1}`);

    const thumb = document.createElement('img');
    thumb.src = image.src;
    thumb.alt = image.alt;
    button.append(thumb);

    button.addEventListener('click', () => {
      mainImage.src = image.src;
      mainImage.alt = image.alt;
      [...thumbs.children].forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
    });

    thumbs.append(button);
  });

  block.textContent = '';
  block.append(main, thumbs);
}
