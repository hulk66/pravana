export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;
  const [imageCell, textCell] = row.children;
  const image = imageCell?.querySelector('img');
  const heading = textCell?.querySelector('h1');
  const paragraph = textCell?.querySelector('p');
  const link = textCell?.querySelector('a');

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

  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent;
    content.append(h1);
  }

  if (paragraph) {
    const p = document.createElement('p');
    p.textContent = paragraph.textContent;
    content.append(p);
  }

  if (link) {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent;
    a.className = 'button primary';
    content.append(a);
  }

  layout.append(media, content);
  block.textContent = '';
  block.append(layout);
}
