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

test('shows the services page', async () => {
  const response = await fetch(`${base}/services`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<h1>Nos Services<\/h1>/);
  assert.match(html, /Découvrez notre gamme complète de services/);
});

test('shows the news page', async () => {
  const response = await fetch(`${base}/actualites`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<h1>Actualités<\/h1>/);
  assert.match(html, /Suivez les dernières nouveautés/);
});

test('navigation bar contains all portal links', async () => {
  const response = await fetch(`${base}/`);
  const html = await response.text();
  assert.match(html, /href="\/services">Services<\/a>/);
  assert.match(html, /href="\/actualites">Actualités<\/a>/);
});

test('footer contains multiple columns', async () => {
  const response = await fetch(`${base}/`);
  const html = await response.text();
  assert.match(html, /class="footer-column"/);
  assert.match(html, /<h3>Navigation<\/h3>/);
  assert.match(html, /<h3>Informations<\/h3>/);
  assert.match(html, /<h3>Contact<\/h3>/);
});
