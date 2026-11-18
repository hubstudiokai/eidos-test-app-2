import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { after, before, test } from 'node:test';

import { handle } from '../src/app.js';

let server;
let base;

before(async () => {
  server = createServer(handle);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

test('has the correct background color and heading color style', async () => {
  const response = await fetch(`${base}/`);
  const html = await response.text();
  assert.match(html, /background-color: var\(--bg-color\);/);
  assert.match(html, /h1\s*{\s*background:\s*linear-gradient/);
});

test('has a Contact link in the footer', async () => {
  const response = await fetch(`${base}/`);
  const html = await response.text();
  assert.match(html, /<footer>\s*<a href="\/contact">Contact<\/a>\s*<\/footer>/);
});

test('uses a premium gold and black theme', async () => {
  const response = await fetch(`${base}/`);
  const html = await response.text();
  assert.match(html, /--primary-color:\s*#d4af37;/);
  assert.match(html, /--bg-color:\s*#0b0b0e;/);
  assert.match(html, /class="premium-badge"/);
});

test('displays a PC hero image on the home page', async () => {
  const response = await fetch(`${base}/`);
  const html = await response.text();
  assert.match(html, /<img\s+[^>]*class="hero-image"[^>]*alt="[^"]*PC[^"]*"[^>]*>/i);
});
