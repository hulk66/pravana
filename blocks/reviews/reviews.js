function stars(rating) {
  const full = Math.round(rating);
  return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full);
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const summaryRow = rows[0];
  const rating = parseFloat(summaryRow?.children[0]?.textContent.trim() || '0');
  const count = summaryRow?.children[1]?.textContent.trim() || '';

  block.textContent = '';

  const layout = document.createElement('div');
  layout.className = 'reviews-layout';

  const summary = document.createElement('div');
  summary.className = 'reviews-summary';

  const score = document.createElement('p');
  score.className = 'reviews-score';
  score.textContent = Number.isNaN(rating) ? '—' : rating.toFixed(1);

  const starLine = document.createElement('p');
  starLine.className = 'reviews-stars';
  starLine.textContent = stars(rating);

  const countLine = document.createElement('p');
  countLine.className = 'reviews-count';
  countLine.textContent = count;

  const write = document.createElement('button');
  write.type = 'button';
  write.className = 'button primary reviews-write';
  write.textContent = 'Write a review';
  write.addEventListener('click', () => {
    write.textContent = 'Demo only — reviews are not submitted.';
    write.disabled = true;
  });

  summary.append(score, starLine, countLine, write);

  const list = document.createElement('div');
  list.className = 'reviews-list';

  rows.slice(1).forEach((row) => {
    const [ratingCell, textCell, authorCell] = row.children;
    const review = document.createElement('article');
    review.className = 'review';

    const reviewStars = document.createElement('p');
    reviewStars.className = 'review-stars';
    reviewStars.textContent = stars(parseFloat(ratingCell?.textContent.trim() || '0'));

    const reviewText = document.createElement('p');
    reviewText.className = 'review-text';
    reviewText.textContent = textCell?.textContent.trim() || '';

    const reviewAuthor = document.createElement('p');
    reviewAuthor.className = 'review-author';
    reviewAuthor.textContent = authorCell?.textContent.trim() || '';

    review.append(reviewStars, reviewText, reviewAuthor);
    list.append(review);
  });

  layout.append(summary, list);
  block.append(layout);
}
