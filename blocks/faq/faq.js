export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  rows.forEach((row) => {
    const [questionCell, answerCell] = row.children;
    const question = questionCell?.textContent.trim() || '';
    const answer = answerCell?.textContent.trim() || '';
    if (!question) return;

    const details = document.createElement('details');
    details.className = 'faq-item';

    const summary = document.createElement('summary');
    summary.className = 'faq-question';
    summary.textContent = question;

    const content = document.createElement('div');
    content.className = 'faq-answer';
    content.textContent = answer;

    details.append(summary, content);
    block.append(details);
  });
}
