// Over a poster that opens large, a thin ring comes up around the pointer and follows it — made after the one on
// counter-digital.jp, as the user asked (2026-11-14: first a filled chip that said "View", then an outline of the logo's
// O with a plus; neither pleased — "counter의 원 형태랑 거의 흡사하게"). Like theirs: a circle an eighth of the window
// wide, a hairline, centred on the pointer and following it with a fifth of a second's ease; it fades in while a smaller
// ring grows into it, and a soft glow leaves it outward (extra.css). The browser's own pointer stays. The ring is drawn
// outside the page's root (a fixed layer, MonoRoot); this moves it and decides when it shows: only with a mouse (not on
// touch screens), only while the page moves (not with "reduce motion"), and only over things marked [data-cur].
export default function pointerMotion({ root, on, X }) {
  const el = document.querySelector('.cur');
  const fine = !!window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!el || !fine) return;
  const ring = el.querySelector('.cur-o');
  if (!ring) return;
  // where the pointer is (tx, ty), where the ring is (x, y), and the move it is making: from (fx, fy), begun at t0;
  // now: the time of the last frame (the engine's clock, in seconds)
  let tx = 0, ty = 0, x = 0, y = 0, fx = 0, fy = 0, t0 = 0, now = 0, seen = false, inside = true, target = null, n = 0;
  const set = (t) => {
    if (t === target) return;
    target = t;
    if (t) {
      // the glow that leaves the ring: white on a blue part of the page, blue on a white one
      el.setAttribute('data-tone', t.closest('.b-lu, .m1-nums, [data-tone="dark"]') ? 'dark' : 'light');
      el.classList.add('on');
    } else el.classList.remove('on');
  };
  on(window, 'mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    // (the first move, and the first one after the pointer was outside the window: the ring is put there, it does not
    // fly in from where it was)
    if (!seen || !inside) { seen = true; x = tx; y = ty; }
    inside = true;
    // every move of the hand starts the ring's move again, from where the ring is now. It starts on the last frame's
    // time, not on this very moment: a move arrives just before a frame, and counted from the move itself the ring
    // would get next to nowhere by that frame — it would hang far behind a hand that keeps moving
    fx = x; fy = y; t0 = now;
  });
  on(document.documentElement, 'mouseleave', () => { inside = false; set(null); });
  on(window, 'blur', () => set(null));
  X.frame = (c) => {
    now = c.t;
    if (!seen) return;
    // what is under the pointer changes without the pointer moving too (the page scrolls, the lineup's row moves on)
    if (inside && (n++ & 1) === 0) {
      const hit = document.elementFromPoint(tx, ty);
      set(hit && root.contains(hit) ? hit.closest('[data-cur]') : null);
    }
    // there in a fifth of a second, slowing down (theirs: gsap.quickTo, .2 s, power2.out)
    const q = Math.min(1, (now - t0) / 0.2), e = 1 - (1 - q) * (1 - q);
    x = fx + (tx - fx) * e; y = fy + (ty - fy) * e;
    ring.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
  };
  X.stop = () => {
    el.classList.remove('on');
    target = null;
  };
}
