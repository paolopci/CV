(function(){
  const LINE_DELAY = 420; // ms
  const SOURCE_FILE = 'code-demo.js';
  if (window.Prism && Prism.plugins && Prism.plugins.autoloader) {
    Prism.plugins.autoloader.languages_path = 'https://cdn.jsdelivr.net/npm/prismjs@1/components/';
  }
  const mqMobile = window.matchMedia('(max-width: 768px)');

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
    const win = document.createElement('div');
    win.className = 'codebg-window';
    const pre = document.createElement('pre');
    pre.className = 'codebg-body';
    const code = document.createElement('code');
    code.className = 'language-javascript';
    pre.appendChild(code);
    win.appendChild(pre);
    bg.appendChild(win);
    if (!host.style.position) host.style.position = 'relative';
    host.style.overflow = 'hidden';
    host.style.isolation = 'isolate';
    Object.assign(bg.style, { position:'absolute', inset:'0', zIndex:'1', pointerEvents:'none', opacity:'.65' });
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

  function start(){
    if (mqMobile.matches) { // non avviare su mobile
      const bg = document.getElementById('code-bg');
      if (bg) bg.style.display = 'none';
      return;
    }
    const ctx = mountLayer();
    if (!ctx) return;
    const { host, code } = ctx;
    window.__codebgInit = true;
    let src = [];
    const visible = [];
    let nextIndex = 0;
    let capacity = 8;
    let written = 0;
    let timerId = 0;

    const calcCapacity = () => {
      const h = host.clientHeight || parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hero-h')) || 420;
      return Math.max(6, Math.floor(h / getLineHeight(code)));
    };

    function render(){
      code.textContent = visible.join('\n');
      if (window.Prism && Prism.highlightElement) Prism.highlightElement(code);
    }

    function step(){
      const line = src[nextIndex];
      visible.push(line); written++;
      nextIndex = (nextIndex + 1) % src.length;
      if (visible.length > capacity) visible.shift();
      render();
      timerId = window.setTimeout(step, LINE_DELAY);
    }

    function prefill(){
      const preload = Math.min(capacity, src.length);
      for (let i=0;i<preload;i++){ visible.push(src[(nextIndex + i) % src.length]); written++; }
      nextIndex = (nextIndex + preload) % src.length;
      render();
      timerId = window.setTimeout(step, LINE_DELAY);
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
      capacity = calcCapacity();
      prefill();
    }

    function onResize(){
      if (mqMobile.matches) { // pausa animazione su mobile
        clearTimeout(timerId);
        const bg = document.getElementById('code-bg');
        if (bg) bg.style.display = 'none';
        // consenti un riavvio pulito quando si torna a desktop
        window.__codebgInit = false;
        return;
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
      if (document.hidden) clearTimeout(timerId);
      else { clearTimeout(timerId); timerId = setTimeout(step, LINE_DELAY); }
    };
    if (window.__codebgVisHandler) document.removeEventListener('visibilitychange', window.__codebgVisHandler);
    window.__codebgVisHandler = visHandler;
    document.addEventListener('visibilitychange', visHandler);

    load();
  }

  // Reagisci ai cambi di viewport mobile/desktop
  if (mqMobile.addEventListener) {
    mqMobile.addEventListener('change', e => {
      if (!e.matches) { // da mobile -> desktop
        const bg = document.getElementById('code-bg');
        if (bg) bg.style.display = '';
        start(); // riavvia sempre: mountLayer pulisce i residui
      } else if (e.matches) { // desktop -> mobile
        const bg = document.getElementById('code-bg');
        if (bg) bg.style.display = 'none';
        window.__codebgInit = false;
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

