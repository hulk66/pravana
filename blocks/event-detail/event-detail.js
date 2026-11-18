export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const heroRow = rows[0];
  const [imageCell, textCell] = heroRow.children;
  const image = imageCell?.querySelector('img');
  const heading = textCell?.querySelector('h1');
  const description = textCell?.querySelector('p');

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

  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent;
    content.append(h1);
  }

  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent;
    content.append(p);
  }

  const info = document.createElement('dl');
  info.className = 'event-detail-info';

  rows.slice(1).forEach((row) => {
    const [labelCell, valueCell] = row.children;
    const label = labelCell?.textContent.trim();
    const value = valueCell?.textContent.trim();
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
