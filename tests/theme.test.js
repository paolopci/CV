/**
 * @jest-environment jsdom
 */

describe('Theme Toggle Logic', () => {
  let store;

  const installLocalStorage = ({ storedTheme, getItemThrows = false, setItemThrows = false } = {}) => {
    store = {};
    if (storedTheme) {
      store.theme = storedTheme;
    }

    const storageMock = {
      getItem: jest.fn((key) => {
        if (getItemThrows) {
          throw new Error('localStorage getItem unavailable');
        }
        return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
      }),
      setItem: jest.fn((key, value) => {
        if (setItemThrows) {
          throw new Error('localStorage setItem unavailable');
        }
        store[key] = value.toString();
      }),
      clear: jest.fn(() => {
        store = {};
      })
    };

    Object.defineProperty(window, 'localStorage', {
      value: storageMock,
      configurable: true
    });
    Object.defineProperty(global, 'localStorage', {
      value: storageMock,
      configurable: true
    });

    return storageMock;
  };

  const installMatchMedia = ({ systemDark = false, available = true } = {}) => {
    if (!available) {
      Object.defineProperty(window, 'matchMedia', {
        value: undefined,
        configurable: true
      });
      return null;
    }

    const mediaQuery = {
      matches: systemDark,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      dispatchEvent: jest.fn()
    };

    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockReturnValue(mediaQuery),
      configurable: true
    });

    return mediaQuery;
  };

  const setupTheme = ({
    storedTheme,
    systemDark = false,
    matchMediaAvailable = true,
    getItemThrows = false,
    setItemThrows = false
  } = {}) => {
    jest.useFakeTimers();

    global.IntersectionObserver = class IntersectionObserver {
      constructor() {}
      observe() { return null; }
      unobserve() { return null; }
      disconnect() { return null; }
    };

    const storageMock = installLocalStorage({ storedTheme, getItemThrows, setItemThrows });
    const mediaQuery = installMatchMedia({ systemDark, available: matchMediaAvailable });

    document.body.className = '';
    document.body.innerHTML = `
      <button id="themeToggleIcon" data-mode="light"></button>
      <div id="a11y-status"></div>
    `;

    jest.resetModules();
    require('../js/main.js');

    window.initTheme();

    return {
      btn: document.getElementById('themeToggleIcon'),
      body: document.body,
      live: document.getElementById('a11y-status'),
      mediaQuery,
      storageMock
    };
  };

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('should toggle dark-theme class on click', () => {
    const { btn, body, live } = setupTheme();

    expect(body.classList.contains('dark-theme')).toBe(false);
    jest.runOnlyPendingTimers();

    btn.click();
    expect(body.classList.contains('dark-theme')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    jest.runOnlyPendingTimers();
    expect(live.textContent).toBe('Tema scuro attivato');

    btn.click();
    expect(body.classList.contains('dark-theme')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
    jest.runOnlyPendingTimers();
    expect(live.textContent).toBe('Tema chiaro attivato');
  });

  test('should apply saved dark theme on load without rewriting preference', () => {
    const { body, btn, storageMock } = setupTheme({ storedTheme: 'dark' });

    expect(body.classList.contains('dark-theme')).toBe(true);
    expect(btn.dataset.mode).toBe('dark');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(btn.getAttribute('aria-label')).toBe('Passa al tema chiaro');
    expect(btn.getAttribute('title')).toBe('Passa al tema chiaro');
    expect(storageMock.setItem).not.toHaveBeenCalled();
  });

  test('should apply saved light theme on load without rewriting preference', () => {
    const { body, btn, storageMock } = setupTheme({ storedTheme: 'light', systemDark: true });

    expect(body.classList.contains('dark-theme')).toBe(false);
    expect(btn.dataset.mode).toBe('light');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    expect(btn.getAttribute('aria-label')).toBe('Passa al tema scuro');
    expect(btn.getAttribute('title')).toBe('Passa al tema scuro');
    expect(storageMock.setItem).not.toHaveBeenCalled();
  });

  test('should use prefers-color-scheme dark as fallback when no saved preference exists', () => {
    const { body, btn, storageMock } = setupTheme({ systemDark: true });

    expect(body.classList.contains('dark-theme')).toBe(true);
    expect(btn.dataset.mode).toBe('dark');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(btn.getAttribute('aria-label')).toBe('Passa al tema chiaro');
    expect(storageMock.setItem).not.toHaveBeenCalled();
  });

  test('should fall back to light theme when matchMedia is unavailable', () => {
    const { body, btn, storageMock } = setupTheme({ matchMediaAvailable: false });

    expect(body.classList.contains('dark-theme')).toBe(false);
    expect(btn.dataset.mode).toBe('light');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    expect(btn.getAttribute('aria-label')).toBe('Passa al tema scuro');
    expect(storageMock.setItem).not.toHaveBeenCalled();
  });

  test('should update ARIA attributes, labels and data-mode', () => {
    const { btn } = setupTheme();

    expect(btn.dataset.mode).toBe('light');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    expect(btn.getAttribute('aria-label')).toBe('Passa al tema scuro');
    expect(btn.getAttribute('title')).toBe('Passa al tema scuro');

    btn.click();
    expect(btn.dataset.mode).toBe('dark');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(btn.getAttribute('aria-label')).toBe('Passa al tema chiaro');
    expect(btn.getAttribute('title')).toBe('Passa al tema chiaro');

    btn.click();
    expect(btn.dataset.mode).toBe('light');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    expect(btn.getAttribute('aria-label')).toBe('Passa al tema scuro');
    expect(btn.getAttribute('title')).toBe('Passa al tema scuro');
  });

  test('should keep toggle working when localStorage getItem throws', () => {
    const { btn, body } = setupTheme({ getItemThrows: true, systemDark: true });

    expect(body.classList.contains('dark-theme')).toBe(true);

    btn.click();
    expect(body.classList.contains('dark-theme')).toBe(false);
    expect(btn.dataset.mode).toBe('light');
    expect(btn.getAttribute('aria-label')).toBe('Passa al tema scuro');
  });

  test('should keep toggle working when localStorage setItem throws', () => {
    const { btn, body, live } = setupTheme({ setItemThrows: true });

    btn.click();

    expect(body.classList.contains('dark-theme')).toBe(true);
    expect(btn.dataset.mode).toBe('dark');
    expect(btn.getAttribute('aria-label')).toBe('Passa al tema chiaro');
    jest.runOnlyPendingTimers();
    expect(live.textContent).toBe('Tema scuro attivato');
  });
});
