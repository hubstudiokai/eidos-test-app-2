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

test('shows the greeting page', async () => {
  const response = await fetch(`${base}/?name=Ada`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /<h1>Bonjour, Ada !<\/h1>/);
});

test('never lets a name inject markup', async () => {
  const response = await fetch(`${base}/?name=${encodeURIComponent('<script>x</script>')}`);
  const html = await response.text();
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;x&lt;\/script&gt;/);
});

test('answers the greeting as JSON', async () => {
  const response = await fetch(`${base}/api/greeting?name=Grace`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { greeting: 'Bonjour, Grace !' });
});

test('says it is up', async () => {
  const response = await fetch(`${base}/health`);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'ok');
});

test('answers 404 to an unknown path and 405 to another method', async () => {
  assert.equal((await fetch(`${base}/nowhere`)).status, 404);
  const posted = await fetch(`${base}/`, { method: 'POST' });
  assert.equal(posted.status, 405);
  assert.equal(posted.headers.get('allow'), 'GET');
});

test('shows the about page', async () => {
  const response = await fetch(`${base}/about`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<h1>À propos<\/h1>/);
  assert.match(html, /h1 { color: #3498db; }/);
  assert.match(html, /Cette application est une démonstration technique créée pour tester nos processus\./);
  assert.match(html, /Elle illustre comment des modifications peuvent être intégrées et déployées en continu\./);
});

test('shows the responsive hamburger menu with correct items', async () => {
  const response = await fetch(`${base}/`);
  const html = await response.text();
  assert.match(html, /<nav>/);
  assert.match(html, /class="menu-toggle"/);
  assert.match(html, /class="menu-items"/);
  assert.match(html, />Accueil<\/a>/);
  assert.match(html, />À propos<\/a>/);
  assert.match(html, />Contact<\/a>/);
});

test('shows the premium contact page', async () => {
  const response = await fetch(`${base}/contact`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<h1>Contactez-nous<\/h1>/);
  assert.match(html, /Pour toute demande concernant notre Édition Privilège/);
});

