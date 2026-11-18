export default function decorate(block) {
  const [titleCell, textCell] = block.children[0]?.children || [];
  const title = titleCell?.textContent.trim() || '';
  const text = textCell?.textContent.trim() || '';

  const box = document.createElement('div');
  box.className = 'callout-box';

  const label = document.createElement('p');
  label.className = 'callout-label';
  label.textContent = title;

  const body = document.createElement('p');
  body.className = 'callout-text';
  body.textContent = text;

  box.append(label, body);
  block.textContent = '';
  block.append(box);
}
