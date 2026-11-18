import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);

  const newsletter = block.querySelector('.footer-newsletter');
  const status = block.querySelector('.footer-newsletter-status');
  if (newsletter && status) {
    newsletter.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = newsletter.querySelector('input[type="email"]');
      if (!email?.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
        status.textContent = 'Please enter a valid email address.';
        email?.focus();
        return;
      }
      status.textContent = 'Thanks — this is a demo. No data was sent.';
      newsletter.reset();
    });
  }
}
