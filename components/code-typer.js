// Portable code-typing animation component (ES module)
// Usage:
// import { startCodeTyper } from './components/code-typer.js';
// const disposer = startCodeTyper({ src: 'main.js', mount: '#my-editor', language: 'javascript', lineDelay: 450 });

export function startCodeTyper(options = {}) {
  const {
    src,                 // path to source file to animate (required)
    mount,               // CSS selector or element to mount into (required)
    language = 'javascript',
    lineDelay = 450      // ms between lines
  } = options;

  if (!src) throw new Error('startCodeTyper: "src" is required');

  const mountEl = typeof mount === 'string' ? document.querySelector(mount) : mount;
  if (!mountEl) throw new Error('startCodeTyper: "mount" element not found');

  // Build markup
  mountEl.innerHTML = '';
  const win = document.createElement('div');
  win.className = 'code-window';
  const title = document.createElement('div');
  title.className = 'code-titlebar';
  const fileName = src.split('?')[0].split('#')[0].split('/').pop();
  title.innerHTML = `<span>${fileName}</span>`;
  const body = document.createElement('div');
  body.className = 'code-body';
  const gutter = document.createElement('div');
  gutter.className = 'gutter';
  gutter.setAttribute('aria-hidden', 'true');
  const pre = document.createElement('pre');
  pre.className = `language-${language}`;
  const code = document.createElement('code');
  code.className = `language-${language}`;
  code.setAttribute('aria-hidden', 'true');
  pre.appendChild(code);
  body.appendChild(gutter);
  body.appendChild(pre);
  win.appendChild(title);
  win.appendChild(body);
  mountEl.appendChild(win);

  // Animation state
  let srcLines = [];
  const history = [];    // grows forever
  let totalCount = 0;    // total lines written so far
  let srcIndex = 0;      // current index in srcLines
  let rafId = 0;
  let timerId = 0;

  const getLineHeight = () => {
    const lhStr = getComputedStyle(code).lineHeight;
    const lh = parseFloat(lhStr);
    return Number.isFinite(lh) && lh > 0 ? lh : 22;
  };

  const computeMaxVisible = () => {
    const lh = getLineHeight();
    const h = body.clientHeight || lh * 20;
    return Math.max(6, Math.floor(h / lh));
  };

  let MAX_VISIBLE = computeMaxVisible();
  const onResize = () => { MAX_VISIBLE = computeMaxVisible(); render(); };
  window.addEventListener('resize', onResize);

  function highlight() {
    if (window.Prism && typeof Prism.highlightElement === 'function') {
      Prism.highlightElement(code);
    }
  }

  function render() {
    const last = history.slice(-MAX_VISIBLE);
    code.textContent = last.join('\n');
    highlight();
    // compute visible rows after highlighting
    const visibleCount = (code.textContent.match(/\n/g) || []).length + 1;
    const startNum = Math.max(1, totalCount - visibleCount + 1);
    gutter.textContent = Array.from({ length: visibleCount }, (_, i) => String(startNum + i)).join('\n');
  }

  function step() {
    const line = srcLines[srcIndex];
    history.push(line);
    totalCount++;
    srcIndex = (srcIndex + 1) % srcLines.length; // loop on source
    rafId = requestAnimationFrame(render);
    timerId = window.setTimeout(step, lineDelay);
  }

  function preloadAndStart() {
    // Pre-fill to avoid initial empty window
    const preload = Math.min(computeMaxVisible(), srcLines.length);
    for (let i = 0; i < preload; i++) {
      history.push(srcLines[(srcIndex + i) % srcLines.length]);
      totalCount++;
    }
    srcIndex = (srcIndex + preload) % srcLines.length;
    render();
    timerId = window.setTimeout(step, lineDelay);
  }

  async function loadSource() {
    try {
      const res = await fetch(src, { cache: 'no-store' });
      const text = await res.text();
      srcLines = text.replace(/\r\n/g, '\n').split('\n');
      if (srcLines.length === 0) srcLines = ['// nessun contenuto'];
      preloadAndStart();
    } catch (err) {
      srcLines = ['// errore nel caricamento di ' + src];
      preloadAndStart();
    }
  }

  loadSource();

  return function dispose() {
    window.removeEventListener('resize', onResize);
    cancelAnimationFrame(rafId);
    clearTimeout(timerId);
  };
}

