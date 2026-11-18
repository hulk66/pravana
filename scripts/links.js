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

export default function normalizeLinks(root = document) {
  root.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href) return;

    if (/^https?:\/\/\//i.test(href)) {
      a.setAttribute('href', href.replace(/^https?:\/\//i, ''));
      return;
    }

    try {
      const url = new URL(href, window.location.href);
      if (DEMO_HOSTS.has(url.hostname)) {
        a.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
      }
    } catch (e) {
      // leave malformed links untouched
    }
  });
}
