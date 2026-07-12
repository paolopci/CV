const fs = require('fs');
const path = require('path');

const normalizeText = (value) => value.replace(/\s+/g, ' ').trim();

describe('hero executive split', () => {
  let page;
  let styles;
  let script;

  beforeAll(() => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    styles = fs.readFileSync(path.join(__dirname, '..', 'css', 'index.css'), 'utf8');
    script = fs.readFileSync(path.join(__dirname, '..', 'js', 'main.js'), 'utf8');
    page = new DOMParser().parseFromString(html, 'text/html');
  });

  test('comunica un posizionamento statico e tre prove professionali', () => {
    const hero = page.querySelector('#home');
    const proofPoints = hero.querySelectorAll('.hero-proof-item');

    expect(page.querySelectorAll('h1')).toHaveLength(1);
    expect(hero.querySelector('.hero-eyebrow').textContent.trim()).toBe('Paolo Paci');
    expect(hero.querySelector('h1').textContent.trim()).toBe('Senior Software Engineer .NET & Angular');
    expect(normalizeText(hero.querySelector('.hero-value').textContent)).toBe(
      'Progetto e sviluppo applicazioni enterprise, API REST e integrazioni AI con attenzione a qualità, manutenibilità e collaborazione in team distribuiti.'
    );
    expect(proofPoints).toHaveLength(3);
    expect(hero.textContent).toContain('10+ anni di esperienza');
    expect(hero.textContent).toContain('TIM · Aruba · BKN301');
    expect(hero.textContent).toContain('Disponibile full remote / ibrido');
  });

  test('carica il ritratto prioritario e mantiene le due CTA', () => {
    const hero = page.querySelector('#home');
    const portrait = hero.querySelector('.hero-portrait img');
    const preload = Array.from(page.querySelectorAll('link[rel="preload"]')).find((link) =>
      link.getAttribute('href').includes('Paolo Paci Img.jpg')
    );

    expect(portrait.getAttribute('src')).toBe('images/Paolo%20Paci%20Img.jpg');
    expect(portrait.getAttribute('width')).toBe('1122');
    expect(portrait.getAttribute('height')).toBe('1402');
    expect(portrait.getAttribute('decoding')).toBe('async');
    expect(portrait.getAttribute('fetchpriority')).toBe('high');
    expect(portrait.getAttribute('alt')).toBe('Paolo Paci, Senior Software Engineer .NET e Angular');
    expect(preload).not.toBeNull();
    expect(hero.querySelector('.btn-hero--primary').textContent).toContain('Scarica il CV');
    expect(hero.querySelector('.btn-hero--secondary').textContent).toContain('Contattami');
  });

  test('separa presentazione e incentivo dal primo viewport', () => {
    const hero = page.querySelector('#home');
    const presentation = page.querySelector('#presentation');
    const contact = page.querySelector('#contact');

    expect(presentation.tagName).toBe('SECTION');
    expect(hero.contains(presentation)).toBe(false);
    expect(presentation.querySelector('.presentation-letter')).not.toBeNull();
    expect(hero.textContent).not.toContain('Incentivi assunzione');
    expect(contact.querySelector('.footer-professional-note').textContent).toContain(
      'Incentivi assunzione per over 50 senza RdC'
    );
  });

  test('rimuove completamente il typewriter e conserva gli ID pubblici', () => {
    ['home', 'hero-cta', 'code-bg', 'presentation', 'contact'].forEach((id) => {
      expect(page.getElementById(id)).not.toBeNull();
    });

    expect(page.querySelector('#typewriter-text')).toBeNull();
    expect(page.querySelector('.typewriter-cursor')).toBeNull();
    expect(styles).not.toContain('.typewriter-cursor');
    expect(script).not.toContain('class TypeWriter');
  });

  test('allinea metadata e dati strutturati al titolo Senior', () => {
    const jsonLd = JSON.parse(page.querySelector('script[type="application/ld+json"]').textContent);
    const person = jsonLd['@graph'].find((entry) => entry['@type'] === 'Person');

    expect(page.title).toBe('Paolo Paci | Senior Software Engineer .NET & Angular');
    expect(page.querySelector('meta[property="og:title"]').content).toContain('Senior Software Engineer');
    expect(page.querySelector('meta[name="twitter:title"]').content).toContain('Senior Software Engineer');
    expect(person.jobTitle).toBe('Senior Software Engineer .NET & Angular');
    expect(page.querySelector('#profile .profile-content h3').textContent).toContain(
      'Senior Software Engineer .NET & Angular'
    );
  });

  test('definisce layout executive, mobile e sfondo attenuato', () => {
    expect(styles).toContain('.hero-card--executive');
    expect(styles).toContain('grid-template-columns: minmax(0, 1.3fr) minmax(240px, 0.7fr)');
    expect(styles).toContain('.hero-proof-list');
    expect(styles).toContain('.hero-portrait');
    expect(styles).toContain('#code-bg');
    expect(styles).toContain('opacity: 0.58');
    expect(styles).toMatch(/\.hero-card--executive h1\s*\{[^}]*animation:\s*none/);
    expect(styles).toContain('#hero-cta .hero-card--executive');
    expect(styles).toContain('@media (max-width: 768px)');
    expect(styles).toContain('@media (max-width: 360px)');
    expect(styles).toMatch(/\.ai-assistant\s*\{\s*bottom:\s*0\.75rem;\s*right:\s*0\.75rem/);
    expect(styles).toMatch(/#hero-cta\s*\{[^}]*width:\s*100%;[^}]*margin-left:\s*0/);
  });
});
