import { createOptimizedPicture } from '../../scripts/aem.js';
import { cellImage, cellText, isDriveImage, isUrl } from '../../scripts/content-cells.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const [imageCell, titleCell, descriptionCell, urlCell] = row.children;
    const li = document.createElement('li');

    const image = cellImage(imageCell);
    if (image) {
      const imageDiv = document.createElement('div');
      imageDiv.className = 'cards-card-image';
      if (isDriveImage(image.src)) {
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt;
        img.loading = 'lazy';
        imageDiv.append(img);
      } else {
        imageDiv.append(createOptimizedPicture(image.src, image.alt, false, [{ width: '750' }]));
      }
      li.append(imageDiv);
    }

    const body = document.createElement('div');
    body.className = 'cards-card-body';

    const title = cellText(titleCell);
    const href = cellText(urlCell);
    if (title) {
      const h3 = document.createElement('h3');
      if (isUrl(href)) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = title;
        h3.append(a);
      } else {
        h3.textContent = title;
      }
      body.append(h3);
    }

    const description = cellText(descriptionCell);
    if (description) {
      const p = document.createElement('p');
      p.textContent = description;
      body.append(p);
    }

    li.append(body);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
