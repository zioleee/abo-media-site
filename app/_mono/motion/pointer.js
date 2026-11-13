// Over a poster that opens large, the pointer changes shape: a thin outline of the logo's O — the leaning, rounded form
// the mark ends on — draws itself around the hand and follows it a little behind, with a small plus at the hand itself.
// No word (the first version said "View" on a filled chip; user, 2026-11-14: the shape should change, as the thin ring
// does on counter-digital.jp, without lettering). The mark is drawn outside the page's root (a fixed layer, MonoRoot);
// this moves its two pieces and decides when it shows: only with a mouse (not on touch screens), only while the page
// moves (with "reduce motion" the pointer stays the browser's own), and only over things marked [data-cur].
export default function pointerMotion({ root, on, X }) {
  const el = document.querySelector('.cur');
  const fine = !!window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!el || !fine) return;
  const ring = el.querySelector('.cur-o'), dot = el.querySelector('.cur-x');
  if (!ring || !dot) return;
  // tx, ty: the pointer · rx, ry: the outline (it trails) · dx, dy: the plus (it keeps up)
  let tx = 0, ty = 0, rx = 0, ry = 0, dx = 0, dy = 0, seen = false, inside = true, target = null, n = 0;
  const set = (t) => {
    if (t === target) return;
    // (it comes in where the pointer is, not from where it last was)
    if (t && !target) { rx = tx; ry = ty; dx = tx; dy = ty; }
    target = t;
    if (t) {
      // on a blue part of the page the mark is white, on white it is blue
      el.setAttribute('data-tone', t.closest('.b-lu, .m1-nums, [data-tone="dark"]') ? 'dark' : 'light');
      el.classList.add('on');
    } else el.classList.remove('on', 'dn');
  };
  on(window, 'mousemove', (e) => {
    tx = e.clientX; ty = e.clientY; inside = true;
    if (!seen) { seen = true; rx = dx = tx; ry = dy = ty; root.classList.add('cur-live'); }
  });
  on(window, 'mousedown', () => { if (target) el.classList.add('dn'); });
  on(window, 'mouseup', () => el.classList.remove('dn'));
  on(document.documentElement, 'mouseleave', () => { inside = false; set(null); });
  on(window, 'blur', () => set(null));
  X.frame = (c) => {
    if (!seen) return;
    // what is under the pointer changes without the pointer moving too (the page scrolls, the lineup's row moves on)
    if (inside && (n++ & 1) === 0) {
      const hit = document.elementFromPoint(tx, ty);
      set(hit && root.contains(hit) ? hit.closest('[data-cur]') : null);
    }
    const kr = 1 - Math.exp(-c.dt * 11), kd = 1 - Math.exp(-c.dt * 34);
    rx += (tx - rx) * kr; ry += (ty - ry) * kr;
    dx += (tx - dx) * kd; dy += (ty - dy) * kd;
    ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
    dot.style.transform = 'translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,0)';
  };
  X.stop = () => {
    root.classList.remove('cur-live');
    el.classList.remove('on', 'dn');
    target = null;
  };
}
