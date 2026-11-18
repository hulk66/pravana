export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'product-features-list';

  [...block.children].forEach((row) => {
    const [labelCell, valueCell] = row.children;
    const item = document.createElement('li');

    const label = document.createElement('span');
    label.className = 'product-features-label';
    label.textContent = labelCell?.textContent.trim() || '';

    const value = document.createElement('p');
    value.className = 'product-features-value';
    value.textContent = valueCell?.textContent.trim() || '';

    item.append(label, value);
    list.append(item);
  });

  block.textContent = '';
  block.append(list);
}
