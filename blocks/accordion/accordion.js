export default function decorate(block) {
  const items = [...block.children];
  if (!items.length) return;

  block.textContent = '';

  items.forEach((row) => {
    const [summaryCell, contentCell] = row.children;
    const details = document.createElement('details');
    details.className = 'accordion-item';

    const summary = document.createElement('summary');
    summary.className = 'accordion-summary';
    summary.textContent = summaryCell?.textContent.trim() || '';

    const content = document.createElement('div');
    content.className = 'accordion-content';
    content.textContent = contentCell?.textContent.trim() || '';

    details.append(summary, content);
    block.append(details);
  });
}
