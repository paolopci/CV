/**
 * @jest-environment jsdom
 */

const SOURCE = [
  'const profile = {',
  "  role: '.NET Software Engineer',",
  "  stack: ['C#', 'Angular', 'REST'],",
  '};',
  'function buildPortfolio(){',
  '  return profile.stack.join(", ");',
  '}',
  'console.log(buildPortfolio());',
  'export default profile;',
  '// end'
].join('\n');

describe('Hero code background', () => {
  const installMatchMedia = ({ mobile = false, reduced = false } = {}) => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: jest.fn((query) => ({
        matches: query.includes('max-width') ? mobile : reduced,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn()
      }))
    });
  };

  const installHero = () => {
    document.body.innerHTML = `
      <section id="hero-cta" class="hero-cta">
        <div id="code-bg" aria-hidden="true"></div>
        <div class="hero-header hero-card">
          <h1>Paolo Paci</h1>
        </div>
      </section>
      <div id="codebg-status" class="codebg-sr-only" role="status" aria-live="polite" aria-atomic="true"></div>
    `;
  };

  const loadScript = async () => {
    jest.resetModules();
    require('../js/hero-code-bg.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await Promise.resolve();
    await Promise.resolve();
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(window, 'setTimeout');
    installHero();
    installMatchMedia();
    global.fetch = jest.fn().mockResolvedValue({
      text: jest.fn().mockResolvedValue(SOURCE)
    });
    window.Prism = {
      plugins: { autoloader: {} },
      highlightElement: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    delete global.fetch;
    delete window.Prism;
    delete window.__codebgTimerId;
    delete window.__codebgResizeHandler;
    delete window.__codebgVisHandler;
    delete window.__codebgInit;
    delete window.__codebgRunId;
  });

  test('monta il layer senza duplicazioni', async () => {
    await loadScript();
    jest.resetModules();
    require('../js/hero-code-bg.js');
    await Promise.resolve();
    await Promise.resolve();

    expect(document.querySelectorAll('#code-bg .codebg-window')).toHaveLength(1);
    expect(document.querySelector('#code-bg .codebg-grid')).not.toBeNull();
    expect(document.querySelector('#code-bg .codebg-scanline')).not.toBeNull();
    expect(document.querySelector('#code-bg').getAttribute('aria-hidden')).toBe('true');
  });

  test('usa il fallback quando code-demo.js non e disponibile', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('offline'));

    await loadScript();

    const code = document.querySelector('#code-bg code');
    expect(code.textContent).toContain('fallback demo');
    expect(document.getElementById('codebg-status').textContent).toBe('');
    jest.advanceTimersByTime(60);
    expect(document.getElementById('codebg-status').textContent).toContain('modalità demo');
  });

  test('mantiene una modalita mobile leggera', async () => {
    installMatchMedia({ mobile: true });

    await loadScript();

    const bg = document.getElementById('code-bg');
    const visibleLines = document.querySelector('#code-bg code').textContent.split('\n');
    expect(bg.dataset.mode).toBe('mobile');
    expect(bg.style.display).toBe('');
    expect(visibleLines.length).toBeLessThanOrEqual(10);
    expect(window.setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 900);
  });

  test('rispetta prefers-reduced-motion senza avviare timer animati', async () => {
    installMatchMedia({ reduced: true });

    await loadScript();

    const bg = document.getElementById('code-bg');
    expect(bg.dataset.motion).toBe('reduced');
    expect(document.querySelector('#code-bg code').textContent).toContain('.NET Software Engineer');
    expect(jest.getTimerCount()).toBe(0);
  });
});
