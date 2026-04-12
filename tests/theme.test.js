/**
 * @jest-environment jsdom
 */

describe('Theme Toggle Logic', () => {
  beforeEach(() => {
    jest.useFakeTimers();

    // Mock IntersectionObserver
    global.IntersectionObserver = class IntersectionObserver {
      constructor() {}
      observe() { return null; }
      unobserve() { return null; }
      disconnect() { return null; }
    };

    // Mock local storage
    let store = {};
    global.localStorage = {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => { store[key] = value.toString(); },
      clear: () => { store = {}; }
    };

    // Mock matchMedia
    global.window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    document.body.innerHTML = `
      <button id="themeToggleIcon" data-mode="light"></button>
      <div id="a11y-status"></div>
    `;
    
    // Clear modules to re-require main.js
    jest.resetModules();
    require('../js/main.js');
    
    // Call initTheme directly (since it's a global function in main.js)
    if (typeof window.initTheme === 'function') {
      window.initTheme();
    } else if (typeof global.initTheme === 'function') {
      global.initTheme();
    }
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('should toggle dark-theme class on click', () => {
    const btn = document.getElementById('themeToggleIcon');
    const body = document.body;

    // Initially light
    expect(body.classList.contains('dark-theme')).toBe(false);
    jest.runOnlyPendingTimers();

    // First click
    btn.click();
    expect(body.classList.contains('dark-theme')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    jest.runOnlyPendingTimers();
    expect(document.getElementById('a11y-status').textContent).toBe('Tema scuro attivato');

    // Second click
    btn.click();
    expect(body.classList.contains('dark-theme')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
    jest.runOnlyPendingTimers();
    expect(document.getElementById('a11y-status').textContent).toBe('Tema chiaro attivato');
  });

  test('should update ARIA attributes and data-mode', () => {
    const btn = document.getElementById('themeToggleIcon');
    jest.runOnlyPendingTimers();
    
    btn.click(); // Switch to dark
    expect(btn.dataset.mode).toBe('dark');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    
    btn.click(); // Switch to light
    expect(btn.dataset.mode).toBe('light');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
  });
});
