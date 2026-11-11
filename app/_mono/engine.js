// The pages are complete as laid out: with scripts off, or with "reduce motion" set, that is what shows.
// In a window that scrolls, this adds the motion: arrivals ([data-m] gets the class "mv" as it comes into view), the count-up
// ([data-count] / [data-to]), a smoothed pointer, and whatever a page brings along (motion/*.js).
//
// Classes on the page's root while it runs: "fit" (the first screen is fitted to the window, --vh holds its height),
// "live" (the moving rules of mono.css apply), "boot" (for the one frame in which nothing may animate), "ready".
// With "reduce motion" the root only gets "still".

function run(root, extras) {
  const $ = (s, el) => (el || root).querySelector(s);
  const $$ = (s, el) => Array.prototype.slice.call((el || root).querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const mix = (a, b, q) => a + (b - a) * q;
  const offs = [];
  const on = (el, ev, fn, opt) => { el.addEventListener(ev, fn, opt); offs.push(() => el.removeEventListener(ev, fn, opt)); };
  let dead = false, raf = 0;
  const W = root.clientWidth, H0 = window.innerHeight;
  // the first screen is fitted to the window before anything is measured
  root.style.setProperty('--vh', String(H0));
  root.classList.add('fit');
  void root.offsetWidth;
  // where everything sits on the page as laid out (measured before anything is hidden or moved)
  const sy0 = window.pageYOffset;
  const pageY = (el) => { const r = el.getBoundingClientRect(); return { top: r.top + sy0, bottom: r.bottom + sy0, h: r.height, w: r.width, left: r.left }; };
  const measure = (o) => { const r = o.el.getBoundingClientRect(), sy = window.pageYOffset; o.top = r.top + sy; o.bottom = r.bottom + sy; o.ok = r.width > 0 || r.height > 0; return o; };
  const known = new Set();
  const mark = (el) => { known.add(el); return measure({ el: el, at: Number(el.getAttribute('data-at') || 0.92) }); };
  const marks = $$('[data-m]').map(mark);
  let pending = marks.slice();
  // after the layout changes (a group opens or closes, pictures arrive) the pieces still waiting are measured again
  const remeasure = () => { pending.forEach(measure); };
  const xs = extras.map((fn) => { const X = {}; fn({ root, $, $$, on, clamp, mix, pageY, measure, remeasure, W, H0, sy0, X }); return X; });
  // switch to the moving page in one step: nothing animates from the laid-out page into its starting pose
  root.classList.add('live', 'boot');
  const ptr = { x: 0, y: 0, sx: 0, sy: 0, cx: -1, cy: -1 };
  on(window, 'mousemove', (e) => { ptr.x = (e.clientX / W) * 2 - 1; ptr.y = (e.clientY / window.innerHeight) * 2 - 1; ptr.cx = e.clientX; ptr.cy = e.clientY; });
  const counted = [];
  const count = (box) => {
    $$('[data-to]', box).forEach((el, i) => {
      const to = Number(el.getAttribute('data-to')), t0 = performance.now() + 150 + i * 110, D = 1700;
      counted.push(el); el.textContent = '0';
      const step = (now) => { if (dead) return; const q = clamp((now - t0) / D, 0, 1), e = 1 - Math.pow(1 - q, 4); el.textContent = String(Math.round(to * e)); if (q < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  };
  const reveal = (el) => { el.classList.add('mv'); if (el.hasAttribute('data-count')) count(el); xs.forEach((X) => { if (X.reveal) X.reveal(el); }); };
  let last = performance.now(), t = 0, started = false;
  const frame = (now) => {
    if (dead) return;
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; t += dt;
    const k = 1 - Math.exp(-dt * 4);
    ptr.sx += (ptr.x - ptr.sx) * k; ptr.sy += (ptr.y - ptr.sy) * k;
    const y = window.pageYOffset, H = window.innerHeight;
    if (started && pending.length) {
      const end = document.documentElement.scrollHeight - H - 2;
      pending = pending.filter((o) => { if (o.ok && (o.top < y + H * o.at || (y >= end && o.top < y + H)) && o.bottom > y - 60) { reveal(o.el); return false; } return true; });
    }
    const c = { y: y, H: H, W: W, dt: dt, t: t, ptr: ptr };
    for (let i = 0; i < xs.length; i++) if (xs[i].frame) xs[i].frame(c);
    if (!started) {
      started = true;
      void root.offsetWidth;
      root.classList.remove('boot');
      requestAnimationFrame(() => { if (!dead) root.classList.add('ready'); });
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return {
    w: W, h: H0,
    // content that arrived later (lists filled from the CMS, a year opened): the page's own parts are set up again first
    // (they may change the layout), then new pieces join the ones waiting and everything waiting is measured again
    rescan() {
      if (dead) return;
      xs.forEach((X) => { if (X.rescan) X.rescan(); });
      pending = pending.filter((o) => o.el.isConnected);
      $$('[data-m]').forEach((el) => {
        if (known.has(el)) return;
        const o = mark(el);
        marks.push(o);
        // (while the page is live a piece that arrives later still comes in; one already in view comes in at once)
        pending.push(o);
      });
      remeasure();
    },
    stop() {
      dead = true;
      cancelAnimationFrame(raf);
      offs.forEach((f) => f());
      root.classList.remove('live', 'boot', 'ready', 'fit');
      root.style.removeProperty('--vh');
      marks.forEach((o) => o.el.classList.remove('mv'));
      counted.forEach((el) => { el.textContent = el.getAttribute('data-to'); });
      xs.forEach((X) => { if (X.stop) X.stop(); });
    },
  };
}

export function startEngine(root, extras = []) {
  const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  let inst = null;
  const sync = () => {
    const want = !(mq && mq.matches);
    // a different width or a clearly different height is a different layout: start again from the laid-out page
    // (small height changes are a phone's address bar coming and going, and are left alone)
    if (inst && (!want || root.clientWidth !== inst.w || Math.abs(window.innerHeight - inst.h) > 140)) { inst.stop(); inst = null; }
    if (want && !inst) inst = run(root, extras);
    root.classList.toggle('still', !want);
  };
  window.addEventListener('resize', sync);
  if (mq && mq.addEventListener) mq.addEventListener('change', sync);
  sync();
  return {
    rescan() { if (inst) inst.rescan(); },
    stop() {
      window.removeEventListener('resize', sync);
      if (mq && mq.removeEventListener) mq.removeEventListener('change', sync);
      if (inst) { inst.stop(); inst = null; }
      root.classList.remove('still');
    },
  };
}
