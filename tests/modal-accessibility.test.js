/**
 * @jest-environment jsdom
 */

describe('Modal accessibility helper', () => {
  beforeEach(() => {
    jest.useFakeTimers();

    global.IntersectionObserver = class IntersectionObserver {
      constructor() {}
      observe() { return null; }
      unobserve() { return null; }
      disconnect() { return null; }
    };

    jest.resetModules();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    delete global.fetch;
  });

  function requireMain() {
    require('../js/main.js');
  }

  test('apre, intrappola il focus e chiude con Escape ripristinando lo stato', () => {
    document.body.innerHTML = `
      <div id="a11y-status"></div>
      <main id="page-content" aria-hidden="false">
        <button id="open-modal">Apri</button>
        <button id="outside">Fuori</button>
      </main>
      <div id="test-modal" style="display:none;" aria-hidden="true">
        <div class="modal-content" tabindex="-1">
          <button id="first">Primo</button>
          <a id="last" href="#fine">Ultimo</a>
        </div>
      </div>
    `;
    requireMain();

    const modal = document.getElementById('test-modal');
    const content = modal.querySelector('.modal-content');
    const opener = document.getElementById('open-modal');
    const outside = document.getElementById('outside');
    const first = document.getElementById('first');
    const last = document.getElementById('last');

    opener.focus();
    window.openAccessibleModal({
      modal,
      modalContent: content,
      openerEl: opener,
      triggerEl: opener,
      openMessage: 'Modale aperta',
      closeMessage: 'Modale chiusa',
    });
    jest.runOnlyPendingTimers();

    expect(modal.style.display).toBe('flex');
    expect(modal.getAttribute('aria-hidden')).toBe('false');
    expect(opener.getAttribute('aria-expanded')).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.getElementById('page-content').getAttribute('aria-hidden')).toBe('true');
    expect(document.getElementById('a11y-status').getAttribute('aria-hidden')).toBeNull();
    expect(document.activeElement).toBe(first);
    expect(document.getElementById('a11y-status').textContent).toBe('Modale aperta');

    last.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
    }));
    expect(document.activeElement).toBe(first);

    first.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    }));
    expect(document.activeElement).toBe(last);

    outside.focus();
    outside.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(document.activeElement).toBe(first);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    jest.runOnlyPendingTimers();

    expect(modal.style.display).toBe('none');
    expect(modal.getAttribute('aria-hidden')).toBe('true');
    expect(opener.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.style.overflow).toBe('');
    expect(document.getElementById('page-content').getAttribute('aria-hidden')).toBe('false');
    expect(document.activeElement).toBe(opener);
    expect(document.getElementById('a11y-status').textContent).toBe('Modale chiusa');
  });
});

describe('Static infographic modals', () => {
  beforeEach(() => {
    jest.useFakeTimers();

    global.IntersectionObserver = class IntersectionObserver {
      constructor() {}
      observe() { return null; }
      unobserve() { return null; }
      disconnect() { return null; }
    };

    document.body.innerHTML = `
      <div id="a11y-status"></div>
      <main>
        <button id="infoskillsTrigger" aria-expanded="false">Competenze</button>
        <button id="infoPercorsoTrigger" aria-expanded="false">Percorso</button>
      </main>
      <div class="modal-overlay" id="infoskillsModal" style="display:none;" aria-hidden="true">
        <div class="modal-content" tabindex="-1">
          <button class="modal-close" id="closeInfoSkills">Chiudi</button>
          <a href="#dettaglio" id="detailsLink">Dettaglio</a>
        </div>
      </div>
      <div class="modal-overlay" id="infoPercorsoModal" style="display:none;" aria-hidden="true">
        <div class="modal-content" tabindex="-1">
          <button class="modal-close" id="closeInfoPercorso">Chiudi</button>
          <a href="#percorso" id="careerLink">Percorso</a>
        </div>
      </div>
    `;

    jest.resetModules();
    require('../js/main.js');
    window.initInfoskillsModal();
    window.initInfoPercorsoModal();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('apre dal trigger e chiude dal backdrop restituendo il focus', () => {
    const trigger = document.getElementById('infoskillsTrigger');
    const modal = document.getElementById('infoskillsModal');

    trigger.focus();
    trigger.click();
    jest.runOnlyPendingTimers();

    expect(modal.style.display).toBe('flex');
    expect(modal.getAttribute('aria-hidden')).toBe('false');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById('a11y-status').textContent).toBe('Infografica competenze aperta');

    modal.click();
    jest.runOnlyPendingTimers();

    expect(modal.style.display).toBe('none');
    expect(modal.getAttribute('aria-hidden')).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
    expect(document.getElementById('a11y-status').textContent).toBe('Infografica competenze chiusa');
  });

  test('modale percorso gestisce Tab, Shift+Tab, Escape e ritorno focus', () => {
    const trigger = document.getElementById('infoPercorsoTrigger');
    const modal = document.getElementById('infoPercorsoModal');
    const closeBtn = document.getElementById('closeInfoPercorso');
    const link = document.getElementById('careerLink');

    trigger.focus();
    trigger.click();
    jest.runOnlyPendingTimers();

    expect(modal.style.display).toBe('flex');
    expect(modal.getAttribute('aria-hidden')).toBe('false');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(closeBtn);
    expect(document.getElementById('a11y-status').textContent).toBe('Infografica percorso professionale aperta');

    closeBtn.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    }));
    expect(document.activeElement).toBe(link);

    link.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(closeBtn);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    jest.runOnlyPendingTimers();

    expect(modal.style.display).toBe('none');
    expect(modal.getAttribute('aria-hidden')).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
    expect(document.getElementById('a11y-status').textContent).toBe('Infografica percorso professionale chiusa');
  });
});

describe('Course modal accessibility', () => {
  beforeEach(() => {
    jest.useFakeTimers();

    global.IntersectionObserver = class IntersectionObserver {
      constructor() {}
      observe() { return null; }
      unobserve() { return null; }
      disconnect() { return null; }
    };

    document.body.innerHTML = `
      <div id="a11y-status"></div>
      <section>
        <div id="coursesGrid"></div>
      </section>
      <div class="modal-overlay" id="courseModal" style="display:none;" aria-hidden="true">
        <div class="modal-content" tabindex="-1">
          <button class="modal-close" id="closeModal">Chiudi</button>
          <div id="modalBody"></div>
        </div>
      </div>
    `;

    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        courses: [{
          title: 'Corso Test',
          duration: '2 ore',
          level: 'Base',
          students: '100',
          platform: 'Online',
          date: '2026',
          description: 'Descrizione corso',
          tags: ['A11y'],
        }],
      }),
    });

    jest.resetModules();
    require('../js/main.js');
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    delete global.fetch;
  });

  test('usa l helper accessibile e chiude con il bottone globale', async () => {
    await window.loadCourses();

    const card = document.querySelector('.course-card');
    const modal = document.getElementById('courseModal');
    const closeBtn = document.getElementById('closeModal');

    closeBtn.addEventListener('click', () => {
      if (modal._close) modal._close();
    });

    card.focus();
    card.click();
    jest.runOnlyPendingTimers();

    expect(modal.style.display).toBe('flex');
    expect(modal.getAttribute('aria-hidden')).toBe('false');
    expect(modal._accessibleModal).not.toBeNull();
    expect(document.activeElement).toBe(closeBtn);
    expect(document.getElementById('a11y-status').textContent).toBe('Dettagli corso aperti: Corso Test');

    closeBtn.click();
    jest.runOnlyPendingTimers();

    expect(modal.style.display).toBe('none');
    expect(modal.getAttribute('aria-hidden')).toBe('true');
    expect(document.activeElement).toBe(card);
    expect(document.getElementById('a11y-status').textContent).toBe('Dettagli corso chiusi');
  });
});
