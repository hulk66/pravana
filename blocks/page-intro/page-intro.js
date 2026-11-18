import { cellImage, cellText, isUrl } from '../../scripts/content-cells.js';

export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const [imageCell, titleCell, paragraphCell, ctaLabelCell, ctaUrlCell] = row.children;
  const image = cellImage(imageCell);
  const title = cellText(titleCell);
  const paragraph = cellText(paragraphCell);
  const ctaLabel = cellText(ctaLabelCell);
  const ctaHref = cellText(ctaUrlCell);

  const layout = document.createElement('div');
  layout.className = 'page-intro-layout';

  const media = document.createElement('div');
  media.className = 'page-intro-media';
  if (image) {
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    media.append(img);
  }

  const content = document.createElement('div');
  content.className = 'page-intro-content';

  if (title) {
    const h1 = document.createElement('h1');
    h1.textContent = title;
    content.append(h1);
  }

  if (paragraph) {
    const p = document.createElement('p');
    p.textContent = paragraph;
    content.append(p);
  }

  if (isUrl(ctaHref)) {
    const a = document.createElement('a');
    a.href = ctaHref;
    a.textContent = ctaLabel || 'Learn more';
    a.className = 'button primary';
    content.append(a);
  }

  layout.append(media, content);
  block.textContent = '';
  block.append(layout);
}
