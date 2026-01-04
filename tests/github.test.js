/**
 * @jest-environment jsdom
 */

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

    jest.resetModules();
    require('../js/main.js');
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('salva e legge la cache eventi', () => {
    const sampleEvents = [
      {
        type: 'PushEvent',
        created_at: '2024-01-01T00:00:00Z',
        repo: { name: 'paolopci/test-repo' },
      },
    ];

    window.setGitHubCache(sampleEvents);
    const cached = window.getGitHubCache();

    expect(cached).not.toBeNull();
    expect(cached.events).toHaveLength(1);
    expect(cached.events[0].repo.name).toBe('paolopci/test-repo');
  });

  test('usa cache quando fetch fallisce', async () => {
    const sampleEvents = [
      {
        type: 'CreateEvent',
        created_at: '2024-02-10T10:00:00Z',
        repo: { name: 'paolopci/offline-repo' },
      },
    ];

    window.setGitHubCache(sampleEvents);
    global.fetch.mockRejectedValueOnce(new Error('offline'));

    await window.loadGitHubActivity();

    const events = document.querySelectorAll('.github-event');
    const note = document.querySelector('.github-event-note');

    expect(events).toHaveLength(1);
    expect(note).not.toBeNull();
    expect(note.textContent).toContain('Ultimo aggiornamento');
  });

  test('aggiorna la cache quando fetch va a buon fine', async () => {
    const sampleEvents = [
      {
        type: 'PushEvent',
        created_at: '2024-03-12T09:30:00Z',
        repo: { name: 'paolopci/live-repo' },
      },
      {
        type: 'WatchEvent',
        created_at: '2024-03-10T09:30:00Z',
        repo: { name: 'paolopci/another-repo' },
      },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => sampleEvents,
    });

    await window.loadGitHubActivity();

    const cached = window.getGitHubCache();
    const events = document.querySelectorAll('.github-event');

    expect(cached.events).toHaveLength(2);
    expect(events).toHaveLength(2);
  });
});
