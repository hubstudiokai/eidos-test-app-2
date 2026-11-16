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

test('has the correct background color and heading size', async () => {
  const response = await fetch(`${base}/`);
  const html = await response.text();
  assert.match(html, /background-color: var\(--bg-color\);/);
  assert.match(html, /h1\s*{\s*color: var\(--primary-color\);\s*margin-top: 0;\s*}/);
});
