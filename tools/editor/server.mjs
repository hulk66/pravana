import http from 'node:http';
import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const contentRoot = path.join(root, 'content');
const editorFile = path.join(__dirname, 'index.html');
const port = Number(process.env.EDITOR_PORT || 3001);
const demoUrl = process.env.DEMO_URL || 'http://localhost:3000';

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

async function serveStatic(res, rel) {
  const abs = path.resolve(root, rel);
  if (!abs.startsWith(root + path.sep)) throw new Error('Invalid static path');
  const stat = await fs.stat(abs);
  if (!stat.isFile()) throw new Error('Not a file');
  const ext = path.extname(abs).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  createReadStream(abs).pipe(res);
}

function json(res, status, value) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(value));
}

function text(res, status, value, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type });
  res.end(value);
}

async function walk(dir, base = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(abs, rel));
    else if (entry.name.endsWith('.plain.html')) files.push(rel);
  }
  return files;
}

function titleFor(rel) {
  if (rel === 'index.plain.html') return 'Homepage';
  if (rel === 'nav.plain.html') return 'Navigation';
  if (rel === 'footer.plain.html') return 'Footer';
  return rel
    .replace('.plain.html', '')
    .split('/')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '))
    .join(' / ');
}

function routeFor(rel) {
  if (rel === 'index.plain.html' || rel === 'nav.plain.html' || rel === 'footer.plain.html') return '/';
  return `/${rel.replace('.plain.html', '')}`;
}

async function listPages() {
  const files = await walk(contentRoot);
  return files
    .map((rel) => ({ name: titleFor(rel), path: `content/${rel}`, route: routeFor(rel) }))
    .sort((a, b) => (a.name === 'Homepage' ? -1 : b.name === 'Homepage' ? 1 : a.name.localeCompare(b.name)));
}

function resolveContentPath(rel) {
  if (!rel || typeof rel !== 'string') throw new Error('Missing content path');
  const abs = path.resolve(root, rel);
  if (!abs.startsWith(contentRoot + path.sep) || !abs.endsWith('.plain.html')) {
    throw new Error('Content path must be a .plain.html file under content/');
  }
  return abs;
}

function readBody(req, limit = 2 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > limit) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  try {
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const html = await fs.readFile(editorFile, 'utf8');
      text(res, 200, html, 'text/html; charset=utf-8');
      return;
    }

    if (url.pathname.startsWith('/images/') || url.pathname.startsWith('/icons/') || url.pathname.startsWith('/fonts/') || url.pathname === '/favicon.ico') {
      const rel = url.pathname === '/favicon.ico' ? 'favicon.ico' : url.pathname.slice(1);
      await serveStatic(res, rel);
      return;
    }

    if (url.pathname === '/api/pages') {
      json(res, 200, { pages: await listPages(), demoUrl });
      return;
    }

    if (url.pathname === '/api/content' && req.method === 'GET') {
      const abs = resolveContentPath(url.searchParams.get('path'));
      const content = await fs.readFile(abs, 'utf8');
      text(res, 200, content, 'text/html; charset=utf-8');
      return;
    }

    if (url.pathname === '/api/content' && req.method === 'POST') {
      const abs = resolveContentPath(url.searchParams.get('path'));
      const body = await readBody(req);
      await fs.writeFile(abs, body, 'utf8');
      json(res, 200, { ok: true, path: url.searchParams.get('path') });
      return;
    }

    text(res, 404, 'Not found');
  } catch (error) {
    json(res, 400, { error: error.message });
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Local authoring demo: http://localhost:${port}/`);
  console.log(`Content root: ${contentRoot}`);
  console.log(`Demo preview: ${demoUrl}`);
});
