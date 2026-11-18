export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div');
  if (!cell) return;
  block.innerHTML = cell.innerHTML;
  block.classList.add('article-body');
}
