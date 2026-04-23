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

describe('Infographic gallery modal', () => {
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
        <button id="infoskillsTrigger" data-infographic-target="0" aria-expanded="false">Competenze</button>
        <button id="infoPercorsoTrigger" data-infographic-target="1" aria-expanded="false">Percorso</button>
      </main>
      <div class="modal-overlay" id="infographicModal" style="display:none;" aria-hidden="true">
        <div class="modal-content" tabindex="-1">
          <button class="modal-close" id="closeInfographicModal">Chiudi</button>
          <div id="infographicModalGallery">
            <div class="infographic-gallery-header">
              <h2 class="infographic-heading" id="infographicModalTitle">Figura 1</h2>
              <p class="infographic-counter">1 / 2</p>
            </div>
            <button type="button" data-infographic-action="prev">Prev</button>
            <figure class="infographic-figure">
              <picture>
                <source id="infographicModalSource" srcset="images/infoCV-1200.webp" type="image/webp"
                  data-light="images/infoCV-1200.webp" data-dark="images/infoCV-dark-1200.webp" />
                <img id="infographicModalImage" src="images/infoCV-light-1200.png"
                  data-light="images/infoCV-light-1200.png" data-dark="images/infoCV-dark-1200.png"
                  alt="Infografica" />
              </picture>
              <figcaption class="infographic-caption" id="infographicModalCaption">Caption</figcaption>
            </figure>
            <button type="button" data-infographic-action="next">Next</button>
            <button class="infographic-indicator is-active" data-infographic-index="0" aria-selected="true" aria-current="true">Figura 1</button>
            <button class="infographic-indicator" data-infographic-index="1" aria-selected="false" aria-current="false">Figura 2</button>
            <a id="infographicModalDownloadCurrent" href="images/infoCV-light-1200.png" download="Paolo-Paci-figura-1.png">Scarica corrente</a>
            <button id="infographicModalDownloadAll" type="button">Scarica tutto</button>
          </div>
        </div>
      </div>
    `;

    jest.resetModules();
    require('../js/main.js');
    window.initInfographicModal();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('apre dal trigger corretto e chiude dal backdrop restituendo il focus', () => {
    const trigger = document.getElementById('infoskillsTrigger');
    const modal = document.getElementById('infographicModal');

    trigger.focus();
    trigger.click();
    jest.runOnlyPendingTimers();

    expect(modal.style.display).toBe('flex');
    expect(modal.getAttribute('aria-hidden')).toBe('false');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById('a11y-status').textContent).toBe('Galleria infografiche aperta su Figura 1');

    modal.click();
    jest.runOnlyPendingTimers();

    expect(modal.style.display).toBe('none');
    expect(modal.getAttribute('aria-hidden')).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
    expect(document.getElementById('a11y-status').textContent).toBe('Galleria infografiche chiusa');
  });

  test('apre sulla seconda figura, gestisce navigazione e ritorno focus', () => {
    const trigger = document.getElementById('infoPercorsoTrigger');
    const modal = document.getElementById('infographicModal');
    const closeBtn = document.getElementById('closeInfographicModal');
    const prevBtn = modal.querySelector('[data-infographic-action="prev"]');
    const nextBtn = modal.querySelector('[data-infographic-action="next"]');
    const indicators = modal.querySelectorAll('.infographic-indicator');
    const downloadCurrent = document.getElementById('infographicModalDownloadCurrent');
    const downloadAll = document.getElementById('infographicModalDownloadAll');
    const modalImage = document.getElementById('infographicModalImage');

    trigger.focus();
    trigger.click();
    jest.runOnlyPendingTimers();

    expect(modal.style.display).toBe('flex');
    expect(modal.getAttribute('aria-hidden')).toBe('false');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(closeBtn);
    expect(document.getElementById('a11y-status').textContent).toBe('Galleria infografiche aperta su Figura 2');
    expect(downloadCurrent.getAttribute('download')).toBe('Paolo-Paci-figura-2.png');
    expect(modalImage.getAttribute('src')).toBe('images/Infografica_CV.png');
    expect(indicators[1].getAttribute('aria-selected')).toBe('true');

    nextBtn.click();
    jest.runOnlyPendingTimers();
    expect(document.getElementById('a11y-status').textContent).toBe('Figura 1 selezionata: Sintesi professionale');
    expect(downloadCurrent.getAttribute('download')).toBe('Paolo-Paci-figura-1.png');
    expect(indicators[0].getAttribute('aria-selected')).toBe('true');

    closeBtn.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    }));
    expect(document.activeElement).toBe(downloadAll);

    prevBtn.focus();
    modal.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    jest.runOnlyPendingTimers();
    expect(document.getElementById('a11y-status').textContent).toBe('Figura 2 selezionata: CV infografico completo');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    jest.runOnlyPendingTimers();

    expect(modal.style.display).toBe('none');
    expect(modal.getAttribute('aria-hidden')).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
    expect(document.getElementById('a11y-status').textContent).toBe('Galleria infografiche chiusa');
  });

  test('download entrambe avvia due download client-side', () => {
    const trigger = document.getElementById('infoskillsTrigger');
    const downloadAll = document.getElementById('infographicModalDownloadAll');
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    trigger.click();
    jest.runOnlyPendingTimers();

    downloadAll.click();
    jest.advanceTimersByTime(350);
    jest.runOnlyPendingTimers();

    expect(clickSpy).toHaveBeenCalledTimes(2);
    expect(document.getElementById('a11y-status').textContent).toBe('Download di entrambe le infografiche avviato');

    clickSpy.mockRestore();
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
