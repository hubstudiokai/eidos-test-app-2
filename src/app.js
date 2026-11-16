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

/** Builds an inline SVG data URI representing a luxury gold-and-black PC. */
const HERO_IMAGE_SRC =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 150" width="220" height="150">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f7e39c"/>
      <stop offset="50%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#9e7b20"/>
    </linearGradient>
    <linearGradient id="screenBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22222c"/>
      <stop offset="100%" stop-color="#0b0b0e"/>
    </linearGradient>
    <radialGradient id="aura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#d4af37" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#d4af37" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="110" cy="128" rx="92" ry="12" fill="url(#aura)"/>
  <rect x="40" y="18" width="140" height="90" rx="8" fill="#121218" stroke="url(#gold)" stroke-width="2.5"/>
  <rect x="48" y="26" width="124" height="74" rx="4" fill="url(#screenBg)" stroke="url(#gold)" stroke-width="0.8" stroke-opacity="0.45"/>
  <circle cx="110" cy="22" r="1.4" fill="url(#gold)"/>
  <rect x="58" y="36" width="44" height="5" rx="2.5" fill="url(#gold)" fill-opacity="0.85"/>
  <rect x="58" y="47" width="28" height="3" rx="1.5" fill="#f4efe6" fill-opacity="0.35"/>
  <rect x="58" y="55" width="36" height="3" rx="1.5" fill="#f4efe6" fill-opacity="0.25"/>
  <rect x="58" y="68" width="104" height="22" rx="3" fill="#d4af37" fill-opacity="0.08" stroke="url(#gold)" stroke-width="0.8" stroke-opacity="0.4"/>
  <polyline points="66,84 84,74 102,80 124,70 152,78" fill="none" stroke="url(#gold)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  <polygon points="140,36 152,47 140,58 128,47" fill="url(#gold)" fill-opacity="0.2" stroke="url(#gold)" stroke-width="1.2"/>
  <path d="M22 108 H198 L206 120 C208 123 205 126 201 126 H19 C15 126 12 123 14 120 Z" fill="#181820" stroke="url(#gold)" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M92 108 H128 L125 113 H95 Z" fill="url(#gold)"/>
  <line x1="42" y1="117" x2="178" y2="117" stroke="url(#gold)" stroke-width="0.9" stroke-opacity="0.5"/>
</svg>`);

/** Returns the greeting page for `name`. */
function page(name) {
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Application de test</title>
    <style>
      :root {
        --primary-color: #d4af37;
        --accent-color: #f3d578;
        --bg-color: #0b0b0e;
        --surface-color: #15151b;
        --text-color: #f4efe6;
        --muted-text: #b8b0a2;
        --nav-bg: rgba(18, 18, 24, 0.95);
        --gold-border: rgba(212, 175, 55, 0.35);
      }
      body {
        background-color: var(--bg-color);
        background-image: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.14), transparent 55%);
        color: var(--text-color);
        margin: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        line-height: 1.6;
      }
      nav {
        background: var(--nav-bg);
        color: var(--primary-color);
        padding: 1.1rem 2.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--gold-border);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45);
      }
      .logo {
        font-weight: 700;
        font-size: 1.15rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
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
        margin-left: 2rem;
      }
      .menu-items a {
        color: var(--text-color);
        text-decoration: none;
        font-weight: 500;
        letter-spacing: 0.04em;
        transition: color 0.2s ease;
      }
      .menu-items a:hover {
        color: var(--accent-color);
      }
      main {
        max-width: 720px;
        width: calc(100% - 2rem);
        margin: 4.5rem auto;
        padding: 3.5rem 2.5rem;
        background: linear-gradient(145deg, #1a1a22, #111116);
        border: 1px solid var(--gold-border);
        border-radius: 16px;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(212, 175, 55, 0.08);
        box-sizing: border-box;
        text-align: center;
      }
      .hero-image {
        display: block;
        width: 220px;
        height: auto;
        margin: 0 auto 1.5rem;
        filter: drop-shadow(0 8px 20px rgba(212, 175, 55, 0.22));
      }
      .premium-badge {
        display: inline-block;
        padding: 0.35rem 1rem;
        margin-bottom: 1.25rem;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--accent-color);
        border: 1px solid var(--gold-border);
        border-radius: 999px;
        background: rgba(212, 175, 55, 0.08);
      }
      h1 {
        color: var(--primary-color);
        margin-top: 0;
      }
      main h1 {
        font-family: Georgia, "Times New Roman", serif;
        font-size: 2.5rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        margin-bottom: 1rem;
      }
      .subtitle {
        color: var(--muted-text);
        font-size: 1.05rem;
        max-width: 520px;
        margin: 0 auto;
      }
      footer {
        margin-top: auto;
        padding: 1.75rem 2rem;
        text-align: center;
        border-top: 1px solid var(--gold-border);
        background: rgba(15, 15, 20, 0.8);
      }
      footer a {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;
        letter-spacing: 0.05em;
        transition: color 0.2s ease;
      }
      footer a:hover {
        color: var(--accent-color);
      }
      @media (max-width: 600px) {
        nav {
          padding: 1rem 1.25rem;
        }
        .menu-toggle {
          display: block;
        }
        .menu-items {
          display: none;
          flex-direction: column;
          position: absolute;
          top: 3.9rem;
          left: 0;
          background: var(--surface-color);
          border-bottom: 1px solid var(--gold-border);
          width: 100%;
          padding: 1rem 1.5rem;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
          box-sizing: border-box;
        }
        .menu-items.show {
          display: flex;
        }
        .menu-items li {
          margin: 0.75rem 0;
        }
        main {
          margin: 2.5rem auto;
          padding: 2.25rem 1.5rem;
        }
        main h1 {
          font-size: 1.9rem;
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
      <img class="hero-image" src="${HERO_IMAGE_SRC}" alt="Illustration d'un PC haut de gamme or et noir" />
      <div class="premium-badge">Édition Privilège</div>
      <h1>${escapeHtml(greeting(name))}</h1>
      <p class="subtitle">Une expérience pensée sur mesure, alliant élégance, sobriété et excellence.</p>
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
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>À propos - Édition Privilège</title>
    <style>
      :root {
        --primary-color: #d4af37;
        --bg-color: #0b0b0e;
        --text-color: #f4efe6;
        --gold-border: rgba(212, 175, 55, 0.35);
      }
      body {
        background-color: var(--bg-color);
        color: var(--text-color);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        line-height: 1.6;
        margin: 0;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      main {
        max-width: 600px;
        margin: 4rem auto;
        padding: 3rem;
        background: linear-gradient(145deg, #1a1a22, #111116);
        border: 1px solid var(--gold-border);
        border-radius: 16px;
        text-align: center;
      }
      h1 { color: var(--primary-color); }
      a { color: var(--primary-color); text-decoration: none; }
    </style>
  </head>
  <body>
    <main>
      <h1>À propos</h1>
      <p>Cette application est une démonstration technique créée pour tester nos processus.</p>
      <p>Elle illustre comment des modifications peuvent être intégrées et déployées en continu.</p>
      <a href="/">Retour à l&#39;accueil</a>
    </main>
  </body>
</html>`);
  } else if (url.pathname === '/contact') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(`<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Contact - Édition Privilège</title>
    <style>
      :root {
        --primary-color: #d4af37;
        --bg-color: #0b0b0e;
        --text-color: #f4efe6;
      }
      body {
        background-color: var(--bg-color);
        color: var(--text-color);
        font-family: sans-serif;
        text-align: center;
        padding: 2rem;
      }
      h1 { color: var(--primary-color); }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 2rem;
        background: #15151b;
        border: 1px solid #d4af3740;
        border-radius: 8px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Contactez-nous</h1>
      <p>Pour toute demande concernant notre Édition Privilège, veuillez nous écrire.</p>
      <a href="/" style="color: var(--primary-color);">Retour à l&#39;accueil</a>
    </div>
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
