import { cellImage, cellText } from '../../scripts/content-cells.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const heroRow = rows[0];
  const [imageCell, titleCell, descriptionCell] = heroRow.children;
  const image = cellImage(imageCell);
  const title = cellText(titleCell);
  const description = cellText(descriptionCell);

  const layout = document.createElement('div');
  layout.className = 'event-detail-layout';

  const media = document.createElement('div');
  media.className = 'event-detail-media';
  if (image) {
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    media.append(img);
  }

  const content = document.createElement('div');
  content.className = 'event-detail-content';

  if (title) {
    const h1 = document.createElement('h1');
    h1.textContent = title;
    content.append(h1);
  }

  if (description) {
    const p = document.createElement('p');
    p.textContent = description;
    content.append(p);
  }

  const info = document.createElement('dl');
  info.className = 'event-detail-info';

  rows.slice(1).forEach((row) => {
    const [labelCell, valueCell] = row.children;
    const label = cellText(labelCell);
    const value = cellText(valueCell);
    if (!label || !value) return;

    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    info.append(dt, dd);
  });

  content.append(info);
  layout.append(media, content);
  block.textContent = '';
  block.append(layout);
}
