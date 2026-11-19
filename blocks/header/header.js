import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import normalizeLinks from '../../scripts/links.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Closes the open nav dropdown (desktop) or the nav menu (mobile) on Escape
 * @param {KeyboardEvent} e keydown event
 */
function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
  const MEGA_MENUS = {
    Products: {
      title: 'Products',
      cards: [
        { img: 'https://www.pravana.com/wp-content/uploads/2026/04/6RV-Red-Violet-Dark-Blonde-Model-Image-345x345.jpg', label: 'ChromaSilk HydraGloss', href: '/products/color/demi-permanent/chromasilk-hydragloss', alt: 'Woman with PRAVANA HydraGloss color' },
        { img: 'https://www.pravana.com/wp-content/uploads/2022/08/PRAVANA-VIVIDS-Collection-345x345.jpg', label: 'ChromaSilk VIVIDS Original', href: '/products/color/semi-permanent/chromasilk-vivids-original/black', alt: 'VIVIDS Original model' },
        { img: 'https://www.pravana.com/wp-content/uploads/2026/09/ChromaSilk-Creme-Color-345x345.jpg', label: 'ChromaSilk Creme Color', href: '/products/color/permanent/chromasilk-creme-color-dark-intense-brown', alt: 'ChromaSilk Creme Color model' },
      ],
    },
    Learn: {
      title: 'Learn',
      cards: [
        { img: 'https://www.pravana.com/wp-content/uploads/2024/02/GTL_Pouring_on_the_Style_Mastering_the_Copper_Cola_Color_Craze_Grid-345x345.jpg', label: 'ChromaSilk Copper Cola', href: '/learn/blog/pouring-on-the-style-mastering-the-copper-cola-craze', alt: 'Copper Cola hair color' },
        { img: 'https://www.pravana.com/wp-content/uploads/2024/04/GTL_The_Latest_Hair_Color_Trend_Where_Copper_Meets_Brunette_Grid-345x345.jpg', label: 'HydraGloss Crunette', href: '/learn/blog/hydragloss-crunette-the-latest-hair-color-trend-where-copper-meets-brunette', alt: 'Crunette hair color' },
        { img: 'https://www.pravana.com/wp-content/uploads/2024/05/GTL_VIVIDS_Pride_Neon_Rainbow_Hair_Color_Grid-345x345.jpg', label: 'VIVIDS Neon Rainbow', href: '/learn/blog/vivids-pride-month-neon-rainbow-hair-color', alt: 'Neon Rainbow hair color' },
      ],
    },
    'Pravana PRO': {
      title: 'PRAVANA Pro',
      cards: [
        { img: 'https://www.pravana.com/wp-content/uploads/2025/09/Color-Certification-2025.jpg', label: 'FREE Online Color Certification', href: '/pro/color-masterclasses', alt: 'Online color certification', wide: true },
      ],
    },
  };
  const navMega = document.createElement('div');
  navMega.className = 'nav-mega';
  const headerEl = block.closest('header') || block;
  const closeMega = () => {
    headerEl.classList.remove('mega-open');
    navMega.querySelectorAll('.nav-mega-panel.is-active').forEach((panel) => panel.classList.remove('is-active'));
  };
  const openMega = (label) => {
    if (!isDesktop.matches) return;
    const panel = navMega.querySelector(`.nav-mega-panel[data-menu="${label}"]`);
    if (!panel) return;
    navMega.querySelectorAll('.nav-mega-panel.is-active').forEach((p) => p.classList.remove('is-active'));
    panel.classList.add('is-active');
    headerEl.classList.add('mega-open');
  };

  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      const subList = navSection.querySelector(':scope > ul');
      if (!subList) return;
      navSection.classList.add('nav-drop');
      // wrap the dropdown label in a button so it is announced as expandable
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-expanded', false);
      [...navSection.childNodes].forEach((node) => {
        if (node !== subList) button.append(node);
      });
      navSection.prepend(button);
      const label = button.textContent.trim();
      const menu = MEGA_MENUS[label];
      if (menu) {
        const panel = document.createElement('div');
        panel.className = 'nav-mega-panel';
        panel.dataset.menu = label;
        const linksCol = document.createElement('div');
        linksCol.className = 'nav-mega-links';
        const title = document.createElement('h2');
        title.textContent = menu.title;
        const list = document.createElement('ul');
        subList.querySelectorAll(':scope > li > a').forEach((anchor) => {
          const li = document.createElement('li');
          const link = document.createElement('a');
          link.href = anchor.getAttribute('href');
          link.textContent = anchor.textContent.trim();
          li.append(link);
          list.append(li);
        });
        linksCol.append(title, list);
        const featured = document.createElement('div');
        featured.className = 'nav-mega-featured';
        if (menu.cards.length === 1) featured.classList.add('single');
        menu.cards.forEach((card) => {
          const link = document.createElement('a');
          link.className = 'nav-mega-card';
          link.href = card.href;
          const img = document.createElement('img');
          img.src = card.img;
          img.alt = card.alt;
          img.loading = 'lazy';
          if (card.wide) img.classList.add('wide');
          const caption = document.createElement('span');
          caption.textContent = card.label;
          link.append(img, caption);
          featured.append(link);
        });
        panel.append(linksCol, featured);
        navMega.append(panel);
      }
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        if (isDesktop.matches) {
          button.focus();
          toggleAllNavSections(navSections);
        }
        button.setAttribute('aria-expanded', !expanded);
        if (!expanded) openMega(label);
        else closeMega();
      });
      navSection.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          button.setAttribute('aria-expanded', 'true');
          openMega(label);
        }
      });
      navSection.addEventListener('focusin', () => {
        if (isDesktop.matches) {
          button.setAttribute('aria-expanded', 'true');
          openMega(label);
        }
      });
      navSection.addEventListener('focusout', (event) => {
        if (isDesktop.matches && !nav.contains(event.relatedTarget)) {
          button.setAttribute('aria-expanded', 'false');
          closeMega();
        }
      });
    });
    nav.append(navMega);
    nav.addEventListener('mouseleave', () => {
      if (isDesktop.matches) closeMega();
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
