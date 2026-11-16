/**
 * The app's HTTP routes, with no dependency but Node itself:
 * - `GET /` shows the greeting page; `?name=Ada` greets Ada;
 * - `GET /api/greeting?name=Ada` answers the greeting as JSON;
 * - `GET /health` answers `ok`, so that a preview knows the app is up.
 * Any other path answers 404.
 */

import { greeting } from './greeting.js';

/** Escapes the five characters HTML gives a meaning to, so a name can never inject markup. */
function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Returns the greeting page for `name`. */
function page(name) {
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>Application de test</title>
    <style>
      body {
        background-color: green;
        margin: 0;
        font-family: sans-serif;
      }
      nav {
        background: #333;
        color: white;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .menu-toggle {
        display: none;
        cursor: pointer;
        font-size: 1.5rem;
      }
      .menu-items {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .menu-items li {
        margin-left: 1rem;
      }
      .menu-items a {
        color: white;
        text-decoration: none;
      }
      @media (max-width: 600px) {
        .menu-toggle {
          display: block;
        }
        .menu-items {
          display: none;
          flex-direction: column;
          position: absolute;
          top: 3.5rem;
          right: 0;
          background: #333;
          width: 100%;
          padding: 1rem;
        }
        .menu-items.show {
          display: flex;
        }
        .menu-items li {
          margin: 0.5rem 0;
        }
      }
    </style>
  </head>
  <body>
    <nav>
      <div>Mon Site</div>
      <div class="menu-toggle" onclick="document.querySelector('.menu-items').classList.toggle('show')">☰</div>
      <ul class="menu-items">
        <li><a href="/">Accueil</a></li>
        <li><a href="/about">À propos</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
    <h1>${escapeHtml(greeting(name))}</h1>
  </body>
</html>
`;
}

/** Answers one request: `request` and `response` are Node's `http` objects. */
export function handle(request, response) {
  const url = new URL(request.url ?? '/', 'http://localhost');
  const name = url.searchParams.get('name');

  if (request.method !== 'GET') {
    response.writeHead(405, { Allow: 'GET', 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Method not allowed');
  } else if (url.pathname === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(page(name));
  } else if (url.pathname === '/api/greeting') {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ greeting: greeting(name) }));
  } else if (url.pathname === '/health') {
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('ok');
  } else {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}
