import { cellImage, cellText, isUrl } from '../../scripts/content-cells.js';

export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const [linkCell, posterCell] = row.children;
  const href = cellText(linkCell);
  const poster = cellImage(posterCell);
  if (!isUrl(href)) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'video-embed';

  if (poster) {
    const img = document.createElement('img');
    img.src = poster.src;
    img.alt = poster.alt;
    img.className = 'video-poster';
    wrapper.append(img);
  }

  const play = document.createElement('a');
  play.href = href;
  play.textContent = '▶ Watch the technique';
  play.className = 'video-play';
  play.target = '_blank';
  play.rel = 'noopener';
  wrapper.append(play);

  block.textContent = '';
  block.append(wrapper);
}
