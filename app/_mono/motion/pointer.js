// (Trial, 2026-11-14.) Over a poster that opens large, the pointer becomes a small leaning mark with a word in the serif
// ("View") — the page's own label, following the hand. It is drawn outside the page's root (a fixed layer, MonoRoot);
// this moves it and decides when it shows: only with a mouse (not on touch screens), only while the page moves (with
// "reduce motion" the pointer stays the browser's own), and only over things marked [data-cur].
const WORDS = { view: 'View' };

export default function pointerMotion({ root, on, X }) {
  const el = document.querySelector('.cur');
  const fine = !!window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!el || !fine) return;
  const label = el.querySelector('span');
  let x = 0, y = 0, tx = 0, ty = 0, seen = false, inside = true, target = null, n = 0;
  const set = (t) => {
    if (t === target) return;
    target = t;
    if (t) {
      if (label) label.textContent = WORDS[t.getAttribute('data-cur')] || '';
      // on a blue part of the page the mark is white, on white it is blue
      el.setAttribute('data-tone', t.closest('.b-lu, .m1-nums, [data-tone="dark"]') ? 'dark' : 'light');
      el.classList.add('on');
    } else el.classList.remove('on');
  };
  on(window, 'mousemove', (e) => {
    tx = e.clientX; ty = e.clientY; inside = true;
    if (!seen) { seen = true; x = tx; y = ty; root.classList.add('cur-live'); }
  });
  on(document.documentElement, 'mouseleave', () => { inside = false; set(null); });
  on(window, 'blur', () => set(null));
  X.frame = (c) => {
    if (!seen) return;
    // what is under the pointer changes without the pointer moving too (the page scrolls, the lineup's row moves on)
    if (inside && (n++ & 1) === 0) {
      const hit = document.elementFromPoint(tx, ty);
      set(hit && root.contains(hit) ? hit.closest('[data-cur]') : null);
    }
    const k = 1 - Math.exp(-c.dt * 18);
    x += (tx - x) * k; y += (ty - y) * k;
    el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
  };
  X.stop = () => {
    root.classList.remove('cur-live');
    el.classList.remove('on');
    target = null;
  };
}
