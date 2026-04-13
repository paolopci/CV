/**
 * @jest-environment jsdom
 */

const sampleEvent = (repoName = 'paolopci/test-repo', type = 'PushEvent') => ({
  type,
  created_at: '2026-01-01T00:00:00Z',
  repo: { name: repoName },
});

const flushPromises = () => Promise.resolve();

describe('GitHub Widget Cache', () => {
  beforeEach(() => {
    global.IntersectionObserver = class IntersectionObserver {
      constructor() {}
      observe() { return null; }
      unobserve() { return null; }
      disconnect() { return null; }
    };

    document.body.innerHTML = '<div id="github-activity-content"></div>';
    window.localStorage.clear();
    global.fetch = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(Date, 'now').mockReturnValue(1700000000000);

    jest.resetModules();
    require('../js/main.js');
  });

  afterEach(() => {
    jest.useRealTimers();
    console.error.mockRestore();
    Date.now.mockRestore();
  });

  test('salva e legge la cache eventi con scadenza a 6 ore', () => {
    const sampleEvents = [sampleEvent('paolopci/test-repo')];

    window.setGitHubCache(sampleEvents);
    const cached = window.getGitHubCache();

    expect(cached).not.toBeNull();
    expect(cached.version).toBe(1);
    expect(cached.updatedAt).toBe(1700000000000);
    expect(cached.expiresAt).toBe(1700000000000 + 6 * 60 * 60 * 1000);
    expect(cached.events).toHaveLength(1);
    expect(cached.events[0].repo.name).toBe('paolopci/test-repo');
  });

  test('migra in lettura una cache legacy senza expiresAt', () => {
    const legacyPayload = {
      updatedAt: 1699990000000,
      events: [sampleEvent('paolopci/legacy-repo')],
    };
    window.localStorage.setItem('githubEventsCache', JSON.stringify(legacyPayload));

    const cached = window.getGitHubCache();

    expect(cached.events[0].repo.name).toBe('paolopci/legacy-repo');
    expect(cached.expiresAt).toBe(1699990000000 + 6 * 60 * 60 * 1000);
  });

  test('usa cache fresca senza chiamare fetch', async () => {
    const sampleEvents = [sampleEvent('paolopci/fresh-repo', 'CreateEvent')];
    window.setGitHubCache(sampleEvents);

    await window.loadGitHubActivity();

    const events = document.querySelectorAll('.github-event');
    const note = document.querySelector('.github-event-note');

    expect(global.fetch).not.toHaveBeenCalled();
    expect(events).toHaveLength(1);
    expect(note.textContent).toContain('cache locale');
    expect(document.body.textContent).toContain('fresh-repo');
  });

  test('usa cache scaduta quando tutti i retry falliscono', async () => {
    const expiredNow = 1700000000000 - 7 * 60 * 60 * 1000;
    window.setGitHubCache([sampleEvent('paolopci/offline-repo', 'CreateEvent')], expiredNow);
    global.fetch.mockRejectedValue(new Error('offline'));

    await window.loadGitHubActivity();

    const events = document.querySelectorAll('.github-event');
    const note = document.querySelector('.github-event-note');

    expect(global.fetch).toHaveBeenCalledTimes(4);
    expect(events).toHaveLength(1);
    expect(note.textContent).toContain('Dati offline');
    expect(document.body.textContent).toContain('offline-repo');
  });

  test('aggiorna la cache quando fetch va a buon fine', async () => {
    const sampleEvents = [
      sampleEvent('paolopci/live-repo'),
      sampleEvent('paolopci/another-repo', 'WatchEvent'),
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => sampleEvents,
    });

    await window.loadGitHubActivity();

    const cached = window.getGitHubCache();
    const events = document.querySelectorAll('.github-event');

    expect(cached.events).toHaveLength(2);
    expect(cached.expiresAt).toBe(1700000000000 + 6 * 60 * 60 * 1000);
    expect(events).toHaveLength(2);
  });

  test('ritenta con exponential backoff e riesce dopo errore temporaneo', async () => {
    jest.useFakeTimers();
    const sampleEvents = [sampleEvent('paolopci/retry-repo')];
    const fetchFn = jest.fn()
      .mockRejectedValueOnce(new Error('rete non disponibile'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => sampleEvents,
      });

    const resultPromise = window.fetchGitHubEventsWithRetry(fetchFn, [500]);
    await flushPromises();
    expect(fetchFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(500);
    await flushPromises();

    await expect(resultPromise).resolves.toEqual(sampleEvents);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  test('tratta payload GitHub non valido come errore e mostra fallback portfolio', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ invalid: true }),
    });

    await window.loadGitHubActivity();

    const events = document.querySelectorAll('.github-event');
    const note = document.querySelector('.github-event-note--fallback');

    expect(global.fetch).toHaveBeenCalledTimes(4);
    expect(events.length).toBeGreaterThan(0);
    expect(note.textContent).toContain('repository di esempio');
    expect(document.body.textContent).toContain('Mango.Mango2Web');
  });

  test('mostra dati di esempio quando non ci sono cache e rete', async () => {
    global.fetch.mockRejectedValue(new Error('offline'));

    await window.loadGitHubActivity();

    const events = document.querySelectorAll('.github-event');
    const note = document.querySelector('.github-event-note--fallback');

    expect(events).toHaveLength(3);
    expect(note.textContent).toContain('repository di esempio');
    expect(document.body.textContent).toContain('BlazorBookStoreApp');
  });

  test('mostra il dettaglio tecnico solo quando richiesto', () => {
    const container = document.getElementById('github-activity-content');
    const error = new Error('GitHub API error: 403');

    window.renderGitHubEvents(container, [sampleEvent('paolopci/dev-repo')], {
      error,
      showDetails: true,
    });
    expect(document.querySelector('.github-error-detail').textContent).toContain('403');

    window.renderGitHubEvents(container, [sampleEvent('paolopci/prod-repo')], {
      error,
      showDetails: false,
    });
    expect(document.querySelector('.github-error-detail')).toBeNull();
  });
});
