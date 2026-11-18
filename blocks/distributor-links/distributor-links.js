export default function decorate(block) {
  const list = document.createElement('div');
  list.className = 'distributor-links-list';

  [...block.children].forEach((row) => {
    const [labelCell, linkCell] = row.children;
    const link = linkCell?.querySelector('a');
    if (!link) return;

    const item = document.createElement('div');
    item.className = 'distributor-link';

    const label = document.createElement('span');
    label.className = 'distributor-link-label';
    label.textContent = labelCell?.textContent.trim() || '';

    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.textContent = link.textContent;
    anchor.className = 'button secondary';
    anchor.target = '_blank';
    anchor.rel = 'noopener';

    item.append(label, anchor);
    list.append(item);
  });

  block.textContent = '';
  block.append(list);
}
