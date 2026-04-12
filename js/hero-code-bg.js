(function(){
  const SOURCE_FILE = 'code-demo.js';
  const DESKTOP_DELAY = 320;
  const MOBILE_DELAY = 900;
  const REDUCED_DELAY = 0;
  const MOBILE_QUERY = '(max-width: 768px)';
  const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

  if (window.Prism && Prism.plugins && Prism.plugins.autoloader) {
    Prism.plugins.autoloader.languages_path = 'https://cdn.jsdelivr.net/npm/prismjs@1/components/';
  }

  function createMediaQuery(query){
    if (!window.matchMedia) {
      return {
        matches: false,
        addEventListener: function(){},
        removeEventListener: function(){},
        addListener: function(){},
        removeListener: function(){}
      };
    }
    return window.matchMedia(query);
  }

  const mqMobile = createMediaQuery(MOBILE_QUERY);
  const mqReducedMotion = createMediaQuery(REDUCED_MOTION_QUERY);

  // Debounce utility to limit handler frequency
  function debounce(fn, delay = 120){
    let t;
    return function(){
      const ctx = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(function(){ fn.apply(ctx, args); }, delay);
    };
  }

  function notify(msg){
    let live = document.getElementById('codebg-status');
    if (!live){
      live = document.createElement('div');
      live.id = 'codebg-status';
      live.className = 'codebg-sr-only';
      live.setAttribute('role','status');
      live.setAttribute('aria-live','polite');
      live.setAttribute('aria-atomic','true');
      document.body.appendChild(live);
    }
    live.textContent = '';
    setTimeout(()=>{ live.textContent = msg; }, 50);
  }

  function clearTimer(){
    if (window.__codebgTimerId) {
      clearTimeout(window.__codebgTimerId);
      window.__codebgTimerId = 0;
    }
  }

  function mountLayer(){
    const host = document.getElementById('hero-cta');
    if (!host) return null;
    let bg = host.querySelector('#code-bg');
    if (!bg){
      bg = document.createElement('div');
      bg.id = 'code-bg';
      bg.setAttribute('aria-hidden','true');
      host.insertBefore(bg, host.firstChild);
    }
    // Pulisci eventuali residui per evitare duplicazioni dopo resize
    if (bg) bg.innerHTML = '';
    bg.style.display = '';
    bg.dataset.mode = mqMobile.matches ? 'mobile' : 'desktop';
    bg.dataset.motion = mqReducedMotion.matches ? 'reduced' : 'animated';

    const win = document.createElement('div');
    win.className = 'codebg-window';

    const grid = document.createElement('div');
    grid.className = 'codebg-grid';
    grid.setAttribute('aria-hidden','true');

    const scanline = document.createElement('div');
    scanline.className = 'codebg-scanline';
    scanline.setAttribute('aria-hidden','true');

    const accent = document.createElement('div');
    accent.className = 'codebg-accent';
    accent.setAttribute('aria-hidden','true');

    const pre = document.createElement('pre');
    pre.className = 'codebg-body';
    const code = document.createElement('code');
    code.className = 'language-javascript';
    pre.appendChild(code);
    win.appendChild(grid);
    win.appendChild(scanline);
    win.appendChild(accent);
    win.appendChild(pre);
    bg.appendChild(win);
    if (!host.style.position) host.style.position = 'relative';
    host.style.overflow = 'hidden';
    host.style.isolation = 'isolate';
    Object.assign(bg.style, { position:'absolute', inset:'0', zIndex:'1', pointerEvents:'none' });
    const card = host.querySelector('.hero-card');
    if (card){ if (!card.style.position) card.style.position = 'relative'; card.style.zIndex = '2'; }
    return { host, code };
  }

  function getLineHeight(el){
    const varLh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--code-lh'));
    if (Number.isFinite(varLh) && varLh > 0) return varLh;
    const lh = parseFloat(getComputedStyle(el).lineHeight);
    return Number.isFinite(lh) && lh > 0 ? lh : 22;
  }

  function getDelay(){
    if (mqReducedMotion.matches) return REDUCED_DELAY;
    return mqMobile.matches ? MOBILE_DELAY : DESKTOP_DELAY;
  }

  function start(){
    clearTimer();
    const ctx = mountLayer();
    if (!ctx) return;
    const { host, code } = ctx;
    const runId = (window.__codebgRunId || 0) + 1;
    window.__codebgRunId = runId;
    window.__codebgInit = true;
    let src = [];
    const visible = [];
    let nextIndex = 0;
    let capacity = 8;
    let written = 0;

    const calcCapacity = () => {
      const h = host.clientHeight || parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hero-h')) || 420;
      const base = Math.floor(h / getLineHeight(code));
      if (mqReducedMotion.matches) return Math.max(5, Math.min(9, base));
      if (mqMobile.matches) return Math.max(5, Math.min(10, base - 3));
      return Math.max(10, base + 4);
    };

    function render(){
      if (window.__codebgRunId !== runId) return;
      code.textContent = visible.join('\n');
      if (window.Prism && Prism.highlightElement) Prism.highlightElement(code);
    }

    function step(){
      if (window.__codebgRunId !== runId) return;
      if (!src.length) return;
      const line = src[nextIndex];
      visible.push(line); written++;
      nextIndex = (nextIndex + 1) % src.length;
      if (visible.length > capacity) visible.shift();
      render();
      const delay = getDelay();
      if (delay > 0) window.__codebgTimerId = window.setTimeout(step, delay);
    }

    function prefill(){
      if (window.__codebgRunId !== runId) return;
      const preload = Math.min(capacity, src.length);
      for (let i=0;i<preload;i++){ visible.push(src[(nextIndex + i) % src.length]); written++; }
      nextIndex = (nextIndex + preload) % src.length;
      render();
      const delay = getDelay();
      if (delay > 0) window.__codebgTimerId = window.setTimeout(step, delay);
    }

    async function load(){
      try{
        const res = await fetch(SOURCE_FILE, { cache: 'no-store' });
        const text = await res.text();
        src = (text||'').replace(/\r\n/g,'\n').split('\n');
        if (!src.length) throw new Error('empty');
      } catch {
        src = [
          '/* fallback demo (no code-demo.js) */',
          "const months = ['Gen','Feb','Mar','Apr'];",
          'function greet(name){',
          "  const h = new Date().getHours();",
          "  const hi = h < 12 ? 'Buongiorno' : 'Ciao';",
          "  return `${hi}, ${name}!`;",
          '}',
          "console.log(greet('Paolo'));",
        ];
        notify('Animazione in modalità demo: code-demo.js non disponibile.');
      }
      if (window.__codebgRunId !== runId) return;
      capacity = calcCapacity();
      prefill();
    }

    function onResize(){
      if (window.__codebgRunId !== runId) return;
      const bg = document.getElementById('code-bg');
      if (bg) {
        bg.dataset.mode = mqMobile.matches ? 'mobile' : 'desktop';
        bg.dataset.motion = mqReducedMotion.matches ? 'reduced' : 'animated';
      }
      const newCap = calcCapacity();
      if (newCap !== capacity){
        const diff = visible.length - newCap;
        capacity = newCap;
        if (diff > 0) visible.splice(0, diff);
        render();
      }
    }

    // Avoid multiple listeners across restarts
    const debouncedResize = debounce(onResize, 120);
    if (window.__codebgResizeHandler) window.removeEventListener('resize', window.__codebgResizeHandler);
    window.__codebgResizeHandler = debouncedResize;
    window.addEventListener('resize', debouncedResize);

    const visHandler = () => {
      if (window.__codebgRunId !== runId) return;
      clearTimer();
      if (!document.hidden && getDelay() > 0) window.__codebgTimerId = setTimeout(step, getDelay());
    };
    if (window.__codebgVisHandler) document.removeEventListener('visibilitychange', window.__codebgVisHandler);
    window.__codebgVisHandler = visHandler;
    document.addEventListener('visibilitychange', visHandler);

    load();
  }

  function onMediaChange(){
    window.__codebgInit = false;
    start();
  }

  // Reagisci ai cambi di viewport e preferenze di movimento.
  [mqMobile, mqReducedMotion].forEach(mq => {
    if (mq.addEventListener) mq.addEventListener('change', onMediaChange);
    else if (mq.addListener) mq.addListener(onMediaChange);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

