// Helpers for reading block cells authored in Google Docs.
// Google Docs delivers table cells as plain text, inline images, or plain
// text URLs — not as the nested <h3>/<p>/<a> markup local drafts can use.

const IMAGE_URL_RE = /^(https?:\/\/|\/)\S+\.(jpe?g|png|webp|gif|avif|svg)(\?\S*)?$/i;
// Drive-hosted images (used for assets Google Docs can't hotlink) have no
// file extension, so accept their URL shapes explicitly.
const DRIVE_IMAGE_RE = /^https:\/\/(lh3\.googleusercontent\.com\/d\/|drive\.google\.com\/(uc\?[^ ]*id=|file\/d\/))[\w-]+/i;
const IMAGE_FALLBACK_RE = /^\[image:\s*(.+?)\]$/i;
const URL_RE = /^(https?:\/\/|\/|#|mailto:|tel:)/i;

export function isDriveImage(url) {
  return DRIVE_IMAGE_RE.test(String(url || '').trim());
}

export function cellText(cell) {
  return cell?.textContent.replace(/\s+/g, ' ').trim() || '';
}

export function isUrl(value) {
  return URL_RE.test(String(value || '').trim());
}

// Returns an <img> for a cell that holds an inline image, an image URL, or
// the `[image: url]` fallback the Docs writer leaves when Google can't fetch
// the source image.
export function cellImage(cell) {
  const img = cell?.querySelector('img');
  if (img) return img;

  const text = cellText(cell);
  const fallback = text.match(IMAGE_FALLBACK_RE);
  const url = fallback ? fallback[1].trim() : text;
  if (!IMAGE_URL_RE.test(url) && !DRIVE_IMAGE_RE.test(url)) return null;

  const el = document.createElement('img');
  el.src = url;
  el.alt = '';
  return el;
}

// Returns an <a> for a cell that holds a link element or a plain-text URL.
export function cellLink(cell, label) {
  const a = cell?.querySelector('a');
  if (a) return a;

  const text = cellText(cell);
  if (!isUrl(text)) return null;

  const el = document.createElement('a');
  el.href = text;
  el.textContent = label || text;
  return el;
}
