// Google Docs stores links as absolute URIs. The Docs → EDS pipeline emits
// them verbatim, including the `http:///path` shape produced when an author
// types a root-relative path. Normalize internal demo links back to relative
// paths so navigation stays inside the preview/live site.

const DEMO_HOSTS = new Set([
  'www.pravana.com',
  'pravana.com',
  'main--pravana--hulk66.aem.page',
  'main--pravana--hulk66.aem.live',
]);

function normalizePath(pathname) {
  return pathname
    .split('/')
    .map((seg) => seg.replace(/_/g, '-').replace(/-{2,}/g, '-').replace(/^-+|-+$/g, ''))
    .join('/');
}

export default function normalizeLinks(root = document) {
  root.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href) return;

    if (/^https?:\/\/\//i.test(href)) {
      const path = href.replace(/^https?:\/\//i, '');
      a.setAttribute('href', normalizePath(path));
      return;
    }

    if (href.startsWith('/')) {
      a.setAttribute('href', normalizePath(href));
      return;
    }

    try {
      const url = new URL(href, window.location.href);
      if (DEMO_HOSTS.has(url.hostname)) {
        a.setAttribute('href', `${normalizePath(url.pathname)}${url.search}${url.hash}`);
      }
    } catch (e) {
      // leave malformed links untouched
    }
  });
}
