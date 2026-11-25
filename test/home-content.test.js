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

test('renders the highlights section with four key pillars', async () => {
  const response = await fetch(`${base}/`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /class="content-section highlights-section"/);
  assert.match(html, /L'exigence au cœur de chaque détail/);
  const cards = html.match(/class="highlight-card"/g) ?? [];
  assert.equal(cards.length, 4);
});

test('renders the editorial philosophy section and qualities list', async () => {
  const response = await fetch(`${base}/`);
  const html = await response.text();
  assert.match(html, /class="content-section editorial-section"/);
  assert.match(html, /L'art d'allier sobriété, précision et confort/);
  assert.match(html, /Ce qui fait la différence/);
  assert.match(html, /Accueil personnalisé/);
});

test('renders the six feature cards on the homepage', async () => {
  const response = await fetch(`${base}/`);
  const html = await response.text();
  assert.match(html, /class="content-section features-section"/);
  assert.match(html, /Une expérience complète à explorer/);
  const cards = html.match(/class="feature-card"/g) ?? [];
  assert.equal(cards.length, 6);
});

test('renders the three-step onboarding guide and FAQ accordion', async () => {
  const response = await fetch(`${base}/`);
  const html = await response.text();
  assert.match(html, /class="content-section steps-section"/);
  assert.match(html, /Votre parcours en trois étapes/);
  const steps = html.match(/class="step-card"/g) ?? [];
  assert.equal(steps.length, 3);

  assert.match(html, /class="content-section faq-section"/);
  assert.match(html, /Tout savoir sur la page d'accueil/);
  const faqItems = html.match(/<details class="faq-item"/g) ?? [];
  assert.equal(faqItems.length, 4);
});

test('renders the final call-to-action linking to about and contact pages', async () => {
  const response = await fetch(`${base}/`);
  const html = await response.text();
  assert.match(html, /class="content-section cta-section"/);
  assert.match(html, /Poursuivez votre visite/);
  assert.match(html, /<a href="\/about" class="cta-primary">Découvrir À propos<\/a>/);
  assert.match(html, /<a href="\/contact" class="cta-secondary">Nous contacter<\/a>/);
});
