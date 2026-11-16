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
      :root {
        --primary-color: #2c3e50;
        --accent-color: #3498db;
        --bg-color: #f8f9fa;
        --text-color: #333333;
        --nav-bg: #ffffff;
      }
      body {
        background-color: var(--bg-color);
        color: var(--text-color);
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        line-height: 1.6;
      }
      nav {
        background: var(--nav-bg);
        color: var(--primary-color);
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }
      .logo {
        font-weight: bold;
        font-size: 1.2rem;
        color: var(--primary-color);
      }
      .menu-toggle {
        display: none;
        cursor: pointer;
        font-size: 1.5rem;
        color: var(--primary-color);
      }
      .menu-items {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .menu-items li {
        margin-left: 1.5rem;
      }
      .menu-items a {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
      }
      .menu-items a:hover {
        color: var(--accent-color);
      }
      main {
        max-width: 800px;
        margin: 4rem auto;
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        text-align: center;
      }
      h1 {
        color: var(--primary-color);
        margin-top: 0;
      }
      @media (max-width: 600px) {
        .menu-toggle {
          display: block;
        }
        .menu-items {
          display: none;
          flex-direction: column;
          position: absolute;
          top: 4rem;
          left: 0;
          background: white;
          width: 100%;
          padding: 1rem 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          box-sizing: border-box;
        }
        .menu-items.show {
          display: flex;
        }
        .menu-items li {
          margin: 0.75rem 0;
        }
        main {
          margin: 2rem 1rem;
          padding: 1.5rem;
        }
      }
      }
    </style>
  </head>
  <body>
    <nav>
      <div class="logo">Mon Site</div>
      <div class="menu-toggle" onclick="document.querySelector('.menu-items').classList.toggle('show')">☰</div>
      <ul class="menu-items">
        <li><a href="/">Accueil</a></li>
        <li><a href="/about">À propos</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
    <main>
      <h1>${escapeHtml(greeting(name))}</h1>
    </main>
    <footer>
      <a href="/contact">Contact</a>
    </footer>
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
  } else if (url.pathname === '/about') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(`<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>À propos - Application de test</title>
    <style>
      h1 { color: #3498db; }
    </style>
  </head>
  <body>
    <h1>À propos</h1>
    <p>Cette application est une démonstration technique créée pour tester nos processus.</p>
    <p>Elle illustre comment des modifications peuvent être intégrées et déployées en continu.</p>
    <a href="/">Retour à l&#39;accueil</a>
  </body>
</html>`);
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
