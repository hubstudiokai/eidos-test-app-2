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

test('has a homepage description', async () => {
  const response = await fetch(`${base}/`);
  const html = await response.text();
  assert.match(html, /<p class="subtitle">Une expérience pensée sur mesure, alliant élégance, sobriété et excellence.<\/p>/);
});
