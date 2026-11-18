import { cellLink, cellText } from '../../scripts/content-cells.js';

export default function decorate(block) {
  const list = document.createElement('div');
  list.className = 'distributor-links-list';

  [...block.children].forEach((row) => {
    const [labelCell, urlCell] = row.children;
    const label = cellText(labelCell);
    const link = cellLink(urlCell, label);
    if (!link) return;

    const item = document.createElement('div');
    item.className = 'distributor-link';

    const labelEl = document.createElement('span');
    labelEl.className = 'distributor-link-label';
    labelEl.textContent = label;

    link.textContent = 'Shop now';
    link.className = 'button secondary';
    link.target = '_blank';
    link.rel = 'noopener';

    item.append(labelEl, link);
    list.append(item);
  });

  block.textContent = '';
  block.append(list);
}
