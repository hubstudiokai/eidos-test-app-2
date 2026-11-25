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
        position: relative;
        z-index: 10;
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
        max-width: 1080px;
        width: calc(100% - 2rem);
        margin: 3.5rem auto 4.5rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 3rem;
      }
      .hero-card {
        max-width: 760px;
        width: 100%;
        margin: 0 auto;
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
        background: linear-gradient(to right, blue, red);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-top: 0;
      }
      .hero-card h1 {
        font-family: Georgia, "Times New Roman", serif;
        font-size: 2.5rem;
        font-weight: 800;
        letter-spacing: 0.02em;
        margin-bottom: 1rem;
      }
      .subtitle {
        color: var(--muted-text);
        font-size: 1.05rem;
        max-width: 520px;
        margin: 0 auto;
      }
      .form-hint {
        color: var(--muted-text);
        font-size: 0.9rem;
        margin: 0.85rem 0 0;
      }
      .content-section {
        background: linear-gradient(145deg, #16161d, #101015);
        border: 1px solid var(--gold-border);
        border-radius: 16px;
        padding: 2.75rem 2.5rem;
        box-shadow: 0 18px 45px rgba(0, 0, 0, 0.55);
      }
      .section-header {
        text-align: center;
        max-width: 680px;
        margin: 0 auto 2.25rem;
      }
      .section-kicker {
        display: inline-block;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
      }
      .section-title {
        font-family: Georgia, "Times New Roman", serif;
        font-size: 1.85rem;
        color: var(--text-color);
        margin: 0 0 0.75rem;
      }
      .section-lead {
        color: var(--muted-text);
        margin: 0;
      }
      .highlights-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1.25rem;
      }
      .highlight-card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(212, 175, 55, 0.22);
        border-radius: 12px;
        padding: 1.5rem 1.25rem;
        text-align: center;
      }
      .highlight-value {
        display: block;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--accent-color);
        margin-bottom: 0.35rem;
      }
      .highlight-label {
        display: block;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 0.45rem;
      }
      .highlight-desc {
        margin: 0;
        font-size: 0.9rem;
        color: var(--muted-text);
      }
      .editorial-grid {
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: 2.25rem;
        align-items: start;
      }
      .editorial-text p {
        color: var(--muted-text);
        margin: 0 0 1.1rem;
      }
      .editorial-text p:last-child {
        margin-bottom: 0;
      }
      .qualities-box {
        background: rgba(212, 175, 55, 0.05);
        border: 1px solid var(--gold-border);
        border-radius: 12px;
        padding: 1.75rem;
      }
      .qualities-box h3 {
        margin: 0 0 1rem;
        color: var(--accent-color);
        font-size: 1.15rem;
      }
      .qualities-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
      }
      .qualities-list li {
        position: relative;
        padding-left: 1.5rem;
        color: var(--muted-text);
        font-size: 0.95rem;
      }
      .qualities-list li::before {
        content: "◆";
        position: absolute;
        left: 0;
        top: 0;
        color: var(--primary-color);
        font-size: 0.8rem;
      }
      .qualities-list strong {
        color: var(--text-color);
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.5rem;
      }
      .feature-card {
        background: rgba(15, 15, 20, 0.75);
        border: 1px solid rgba(212, 175, 55, 0.25);
        border-radius: 12px;
        padding: 1.65rem 1.4rem;
      }
      .feature-tag {
        display: inline-block;
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: var(--primary-color);
        margin-bottom: 0.65rem;
      }
      .feature-card h3 {
        margin: 0 0 0.6rem;
        color: var(--text-color);
        font-size: 1.15rem;
      }
      .feature-card p {
        margin: 0;
        color: var(--muted-text);
        font-size: 0.95rem;
      }
      .steps-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.5rem;
      }
      .step-card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(212, 175, 55, 0.24);
        border-radius: 12px;
        padding: 1.75rem 1.4rem;
      }
      .step-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 999px;
        border: 1px solid var(--gold-border);
        background: rgba(212, 175, 55, 0.12);
        color: var(--accent-color);
        font-weight: 700;
        margin-bottom: 1rem;
      }
      .step-card h3 {
        margin: 0 0 0.5rem;
        font-size: 1.1rem;
        color: var(--text-color);
      }
      .step-card p {
        margin: 0;
        color: var(--muted-text);
        font-size: 0.95rem;
      }
      .faq-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 820px;
        margin: 0 auto;
      }
      .faq-item {
        background: rgba(15, 15, 20, 0.8);
        border: 1px solid rgba(212, 175, 55, 0.26);
        border-radius: 10px;
        padding: 1.15rem 1.4rem;
      }
      .faq-item summary {
        cursor: pointer;
        font-weight: 600;
        color: var(--accent-color);
        list-style: none;
      }
      .faq-item p {
        margin: 0.85rem 0 0;
        color: var(--muted-text);
        font-size: 0.95rem;
      }
      .cta-section {
        text-align: center;
        background: linear-gradient(145deg, rgba(212, 175, 55, 0.12), rgba(20, 20, 28, 0.95));
      }
      .cta-actions {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 1.75rem;
      }
      .cta-primary {
        display: inline-block;
        padding: 0.75rem 1.6rem;
        border-radius: 8px;
        background: var(--primary-color);
        color: #0b0b0e;
        font-weight: 700;
        text-decoration: none;
      }
      .cta-secondary {
        display: inline-block;
        padding: 0.75rem 1.6rem;
        border-radius: 8px;
        border: 1px solid var(--gold-border);
        color: var(--accent-color);
        font-weight: 600;
        text-decoration: none;
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
      @media (max-width: 900px) {
        .highlights-grid,
        .features-grid,
        .steps-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .editorial-grid {
          grid-template-columns: 1fr;
        }
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
          margin: 2rem auto 3rem;
          gap: 2rem;
        }
        .hero-card,
        .content-section {
          padding: 2rem 1.35rem;
        }
        .hero-card h1 {
          font-size: 1.9rem;
        }
        .highlights-grid,
        .features-grid,
        .steps-grid {
          grid-template-columns: 1fr;
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
      <section class="hero-card">
        <img class="hero-image" src="${HERO_IMAGE_SRC}" alt="Illustration d'un PC haut de gamme or et noir" />
        <div class="premium-badge">Édition Privilège</div>
        <h1>${escapeHtml(greeting(name))}</h1>
        <p class="subtitle">Une expérience pensée sur mesure, alliant élégance, sobriété et excellence.</p>
        <form action="/" method="GET" style="margin-top: 2rem;">
          <input type="text" name="name" placeholder="Votre prénom" maxlength="${40}" style="padding: 0.5rem; border-radius: 4px; border: 1px solid var(--gold-border); background: #15151b; color: var(--text-color);" />
          <button type="submit" style="padding: 0.5rem 1rem; border-radius: 4px; border: none; background: var(--primary-color); color: #000; cursor: pointer; font-weight: bold;">Saluer</button>
        </form>
        <p class="form-hint">Saisissez votre prénom pour personnaliser instantanément votre message d'accueil.</p>
      </section>

      <section class="content-section highlights-section" aria-labelledby="highlights-heading">
        <div class="section-header">
          <span class="section-kicker">Nos Engagements</span>
          <h2 id="highlights-heading" class="section-title">L'exigence au cœur de chaque détail</h2>
          <p class="section-lead">Découvrez les principes qui guident l'Édition Privilège au quotidien pour offrir un accueil clair, rapide et soigné.</p>
        </div>
        <div class="highlights-grid">
          <article class="highlight-card">
            <span class="highlight-value">100 %</span>
            <span class="highlight-label">Sur mesure</span>
            <p class="highlight-desc">Un accueil adaptable qui met chaque visiteur à l'honneur dès son arrivée.</p>
          </article>
          <article class="highlight-card">
            <span class="highlight-value">24/7</span>
            <span class="highlight-label">Disponibilité continue</span>
            <p class="highlight-desc">Un service accessible à tout moment avec une réponse rapide et constante.</p>
          </article>
          <article class="highlight-card">
            <span class="highlight-value">Or &amp; Noir</span>
            <span class="highlight-label">Identité affirmée</span>
            <p class="highlight-desc">Une présentation contrastée et élégante qui facilite la lecture sur tous les écrans.</p>
          </article>
          <article class="highlight-card">
            <span class="highlight-value">40 car.</span>
            <span class="highlight-label">Mise en page préservée</span>
            <p class="highlight-desc">Un format équilibré pour afficher chaque prénom sans jamais rompre l'harmonie visuelle.</p>
          </article>
        </div>
      </section>

      <section class="content-section editorial-section" aria-labelledby="editorial-heading">
        <div class="section-header">
          <span class="section-kicker">Notre Philosophie</span>
          <h2 id="editorial-heading" class="section-title">L'art d'allier sobriété, précision et confort</h2>
        </div>
        <div class="editorial-grid">
          <div class="editorial-text">
            <p>L'Édition Privilège a été imaginée pour transformer une simple visite en un moment d'accueil attentif. Dès le premier regard, l'équilibre entre les tons sombres et les touches dorées installe une atmosphère sereine, lisible et chaleureuse.</p>
            <p>Chaque élément de la page occupe une place précise : le message de bienvenue s'adapte à votre prénom, la navigation reste accessible à tout instant et les informations essentielles se lisent sans effort, sur grand écran comme sur téléphone mobile.</p>
            <p>Plutôt que de multiplier les distractions, nous privilégions la clarté du propos, la rapidité d'affichage et la fiabilité de chaque interaction.</p>
          </div>
          <aside class="qualities-box">
            <h3>Ce qui fait la différence</h3>
            <ul class="qualities-list">
              <li><strong>Accueil personnalisé :</strong> modifiez le titre principal à volonté grâce au formulaire dédié.</li>
              <li><strong>Lisibilité soignée :</strong> une typographie nette et des contrastes étudiés pour un confort durable.</li>
              <li><strong>Protection des saisies :</strong> chaque texte envoyé est vérifié et affiché en toute sécurité.</li>
              <li><strong>Navigation fluide :</strong> passez librement de l'accueil aux pages À propos et Contact.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section class="content-section features-section" aria-labelledby="features-heading">
        <div class="section-header">
          <span class="section-kicker">Découverte</span>
          <h2 id="features-heading" class="section-title">Une expérience complète à explorer</h2>
          <p class="section-lead">Retrouvez l'ensemble des atouts pensés pour rendre votre visite agréable, utile et structurée.</p>
        </div>
        <div class="features-grid">
          <article class="feature-card">
            <span class="feature-tag">Personnalisation</span>
            <h3>Message instantané</h3>
            <p>Entrez un prénom dans le formulaire principal et observez le message de bienvenue s'actualiser immédiatement en haut de la page.</p>
          </article>
          <article class="feature-card">
            <span class="feature-tag">Esthétique</span>
            <h3>Finition Privilège</h3>
            <p>Des surfaces sombres relevées par des bordures dorées créent un ensemble cohérent de l'en-tête jusqu'au pied de page.</p>
          </article>
          <article class="feature-card">
            <span class="feature-tag">Accessibilité</span>
            <h3>Adaptation mobile</h3>
            <p>Sur petit écran, les grilles se réorganisent sur une colonne et le menu se replie sous un bouton discret et pratique.</p>
          </article>
          <article class="feature-card">
            <span class="feature-tag">Performance</span>
            <h3>Affichage direct</h3>
            <p>Chaque page s'ouvre sans délai superflu afin de vous laisser consulter immédiatement le contenu recherché.</p>
          </article>
          <article class="feature-card">
            <span class="feature-tag">Transparence</span>
            <h3>Présentation claire</h3>
            <p>La rubrique À propos détaille l'esprit du projet et la façon dont ses améliorations prennent vie au fil du temps.</p>
          </article>
          <article class="feature-card">
            <span class="feature-tag">Accompagnement</span>
            <h3>Prise de contact</h3>
            <p>Une page Contact dédiée vous permet de retrouver facilement nos coordonnées d'échange à tout moment de votre visite.</p>
          </article>
        </div>
      </section>

      <section class="content-section steps-section" aria-labelledby="steps-heading">
        <div class="section-header">
          <span class="section-kicker">Mode d'emploi</span>
          <h2 id="steps-heading" class="section-title">Votre parcours en trois étapes</h2>
          <p class="section-lead">Profitez pleinement de la page d'accueil en quelques secondes seulement.</p>
        </div>
        <div class="steps-grid">
          <article class="step-card">
            <span class="step-number">1</span>
            <h3>Renseignez votre prénom</h3>
            <p>Utilisez le champ « Votre prénom » situé juste sous le titre principal pour indiquer le nom à afficher.</p>
          </article>
          <article class="step-card">
            <span class="step-number">2</span>
            <h3>Validez avec Saluer</h3>
            <p>Cliquez sur le bouton doré « Saluer » pour générer instantanément votre accueil personnalisé sur la page.</p>
          </article>
          <article class="step-card">
            <span class="step-number">3</span>
            <h3>Parcourez les rubriques</h3>
            <p>Consultez nos engagements, parcourez la foire aux questions ou visitez les pages À propos et Contact.</p>
          </article>
        </div>
      </section>

      <section class="content-section faq-section" aria-labelledby="faq-heading">
        <div class="section-header">
          <span class="section-kicker">Questions Fréquentes</span>
          <h2 id="faq-heading" class="section-title">Tout savoir sur la page d'accueil</h2>
          <p class="section-lead">Les réponses aux questions les plus courantes concernant l'utilisation du site.</p>
        </div>
        <div class="faq-list">
          <details class="faq-item" open>
            <summary>Comment personnaliser le message de bienvenue ?</summary>
            <p>Saisissez simplement un prénom dans le champ prévu en haut de la page d'accueil, puis cliquez sur le bouton « Saluer ». Si le champ est laissé vide, le message s'adresse à l'ensemble des visiteurs.</p>
          </details>
          <details class="faq-item">
            <summary>Que se passe-t-il si le prénom saisi est très long ?</summary>
            <p>Afin de conserver une mise en page équilibrée sur tous les appareils, le prénom affiché est automatiquement limité à 40 caractères.</p>
          </details>
          <details class="faq-item">
            <summary>Le site reste-t-il confortable sur téléphone mobile ?</summary>
            <p>Oui. Chaque bloc s'ajuste automatiquement à la largeur de votre écran et le menu principal reste accessible en un geste depuis le bouton en haut à droite.</p>
          </details>
          <details class="faq-item">
            <summary>Comment consulter la présentation du projet ou vous contacter ?</summary>
            <p>Vous pouvez utiliser les liens « À propos » et « Contact » situés dans la barre de navigation en haut de la page, ou cliquer sur les boutons ci-dessous.</p>
          </details>
        </div>
      </section>

      <section class="content-section cta-section" aria-labelledby="cta-heading">
        <span class="section-kicker">Prochaine Étape</span>
        <h2 id="cta-heading" class="section-title">Poursuivez votre visite</h2>
        <p class="section-lead" style="max-width: 580px; margin: 0 auto;">Découvrez l'histoire de cette démonstration sur la page À propos ou accédez à notre page Contact pour toute question.</p>
        <div class="cta-actions">
          <a href="/about" class="cta-primary">Découvrir À propos</a>
          <a href="/contact" class="cta-secondary">Nous contacter</a>
        </div>
      </section>
    </main>
    <footer>
      <a href="/contact">Contact</a>
      <p style="margin: 0.5rem 0 0; color: var(--muted-text); font-size: 0.9rem;">© 2026 Édition Privilège. Tous droits réservés.</p>
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
