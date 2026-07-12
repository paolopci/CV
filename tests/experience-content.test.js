const fs = require('fs');
const path = require('path');

describe('contenuti della carriera professionale', () => {
  let page;
  let styles;

  beforeAll(() => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    styles = fs.readFileSync(path.join(__dirname, '..', 'css', 'index.css'), 'utf8');
    page = new DOMParser().parseFromString(html, 'text/html');
  });

  test('le quattro esperienze recenti distinguono risultati, contributi e tecnologie', () => {
    const recentExperiences = page.querySelectorAll(
      '#experience .timeline-item[data-experience-tier="recent"]'
    );

    expect(recentExperiences).toHaveLength(4);

    recentExperiences.forEach((experience) => {
      expect(experience.querySelector('.timeline-impact')).not.toBeNull();
      expect(experience.querySelector('.timeline-contributions')).not.toBeNull();
      expect(experience.querySelector('.timeline-technologies')).not.toBeNull();
    });
  });

  test('pubblica soltanto risultati concordati e verificabili', () => {
    const tim = page.querySelector('[data-experience="qbitsoft-tim"]');
    const aruba = page.querySelector('[data-experience="aruba"]');
    const bkn301 = page.querySelector('[data-experience="bkn301"]');
    const laserSoft = page.querySelector('[data-experience="lasersoft"]');

    expect(tim.textContent).toContain('circa 15 anni');
    expect(aruba.textContent).toContain('stored procedure');
    expect(aruba.textContent).toContain('Cypress');
    expect(bkn301.textContent).toContain('migrazione');
    expect(bkn301.textContent).toContain('team internazionale');
    expect(bkn301.textContent).not.toContain('.NET 8');
    expect(laserSoft.textContent).toContain('presa delle comande');
    expect(laserSoft.textContent).toContain('Bootstrap');
  });

  test('colloca aggiornamento professionale e progetti personali nel portfolio', () => {
    const timelineText = page.querySelector('#experience').textContent;
    const development = page.querySelector('#portfolio .portfolio-development');

    expect(timelineText).not.toContain('Aggiornamento Professionale & Progetti Personali');
    expect(development).not.toBeNull();
    expect(development.textContent).toContain('febbraio 2025');
    expect(development.textContent).toContain('GitHub');
  });

  test('stila risultati e tecnologie nei temi chiaro e scuro e su mobile', () => {
    expect(styles).toContain('.timeline-content-block');
    expect(styles).toContain('.timeline-impact');
    expect(styles).toContain('.timeline-technologies');
    expect(styles).toContain('body.dark-theme .timeline-impact');
    expect(styles).toContain('body.dark-theme .timeline-item[open] .timeline-context');
    expect(styles).toContain(
      'body.dark-theme .timeline-item[open] .timeline-contributions .timeline-block-title'
    );
    expect(styles).toContain('@media (max-width: 768px)');
  });
});
