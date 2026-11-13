// The main page (Home B): what moves besides the arrivals — the mark leaving the header to become the window onto the
// film, the way in through the O, the channel list, the lineup that moves on by itself, Contact's slab.
// Ported from the board (round11/homeb.js, via round13/make_home_js.py); the lineup's motion is the site's own (user, 2026-11-11).
/* eslint-disable */
export default function homeMotion({ root, $, $$, on, clamp, mix, pageY, measure, remeasure, W, H0, sy0, X }) {
  // ===== draft B: what moves (only while the page scrolls in a window; the page as laid out is complete without it) =====
  const K = 0.4695, desk = W > 760;
  // an upright window wider than a phone (a tablet held upright): nothing is held in place, the page just scrolls
  const tall = desk && H0 > W, canPin = !tall;
  if (tall) { root.classList.add('tall'); void root.offsetWidth; remeasure(); }
  const MARK = [[["M",0.061575,0.192732],["A",0.029412,1,0.114396,0.192688],["L",0.173011,0.312034],["A",0.029412,1,0.146611,0.354412],["L",0.029626,0.354412],["A",0.029412,1,0.003205,0.312078]],[["M",0.098095,0.033529],["A",0.023529,1,0.119394,0.0],["L",0.199759,0.0],["A",0.023529,1,0.221058,0.01353],["L",0.36536,0.320883],["A",0.023529,1,0.344061,0.354412],["L",0.263696,0.354412],["A",0.023529,1,0.242397,0.340882]],[["M",0.293242,0.033529],["A",0.023529,1,0.314541,0.0],["L",0.491237,0.0],["A",0.023529,1,0.512402,0.03381],["L",0.456903,0.148072],["A",0.004412,0,0.460871,0.154412],["L",0.568111,0.154412],["A",0.011765,1,0.578761,0.161177],["L",0.653743,0.320883],["A",0.023529,1,0.632444,0.354412],["L",0.458843,0.354412],["A",0.023529,1,0.437544,0.340882]],[["M",0.578095,0.033529],["A",0.023529,1,0.599394,0.0],["L",0.832112,0.0],["A",0.023529,1,0.853411,0.01353],["L",0.997713,0.320883],["A",0.023529,1,0.976414,0.354412],["L",0.743696,0.354412],["A",0.023529,1,0.722397,0.340882]]], MH = 0.354412;
  const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2), sstep = (x) => x * x * (3 - 2 * x);

  // ---------- first screen: the mark leaves the header, becomes the window, and the O is the way in ----------
  const pin = $('.b-pin'), film = $('.b-film'), vd = $('.vd', film), vid = $('video', film), stl = $('.st', film), tone = $('.tn', film), ov = $('.ov', film);
  const shade = $('.sh', film), fcue = $('.fc', film), bar2 = $('.b-bar2', film), wm = $('.b-wm'), band = $('.b-band'), und = $('.b-und');
  const clip0 = film.style.clipPath;
  // measured on the page as laid out, before anything is moved
  const pr = pin.getBoundingClientRect(), fr = film.getBoundingClientRect(), wr = wm.getBoundingClientRect();
  const PW = pr.width, PH = pr.height;
  const REST = { x: fr.left - pr.left, y: fr.top - pr.top, w: fr.width };                      // the mark on the first screen
  const START = { x: wr.left - pr.left, y: wr.top - pr.top + wr.height * 0.045, w: wr.height * 185 / 72 };   // the mark in the logo
  let FIN = { x: 0, y: 0, w: PW, h: PH };                                                       // what the film fills in the end
  if (!desk) { const b = band.getBoundingClientRect(); FIN = { x: 0, y: b.top - pr.top, w: PW, h: b.height }; }
  vd.style.left = FIN.x + 'px'; vd.style.top = FIN.y.toFixed(1) + 'px'; vd.style.width = FIN.w + 'px'; vd.style.height = FIN.h.toFixed(1) + 'px';
  vd.style.right = 'auto'; vd.style.bottom = 'auto';
  // the film itself. In the end it covers what it fills, standing on its lower edge (so the caption line at its own foot stays
  // in view where a wide window cuts it above). At rest it is sized to the mark, not to the window: a little wider than the
  // mark, placed so that the mark's lower edge shows the row of the film that lies under the film's own statement lines and
  // above the caption lines at its foot — those are never sliced along the mark's edge (two programme titles that sit in
  // between are, for a second each) —, the programme logos in the film's upper corners stay outside, and the mark shows the
  // same part of the picture in every window (and on the page as laid out)
  const KF = 1.24, ROW = 0.67;
  const Hf = Math.max(FIN.h, FIN.w * 9 / 16), Wf = Hf * 16 / 9, L1 = FIN.x + (FIN.w - Wf) / 2, T1 = FIN.y + FIN.h - Hf;
  // (the still under the film has a place of its own at rest — see the page's rules — and the same place in the end)
  const restOf = (k, row) => { const wr = k * REST.w, hr = wr * 9 / 16; return { s: hr / Hf, L: REST.x + REST.w / 2 - wr / 2, T: REST.y + MH * REST.w - row * hr }; };
  const RF = restOf(KF, ROW), RS = restOf(1.34, 0.6);
  [vid, stl].forEach((el) => {
    el.style.left = (L1 - FIN.x).toFixed(1) + 'px'; el.style.top = (T1 - FIN.y).toFixed(1) + 'px'; el.style.width = Wf.toFixed(1) + 'px'; el.style.height = Hf.toFixed(1) + 'px';
    el.style.transformOrigin = '0 0';
  });
  if (!desk) film.style.pointerEvents = 'none';
  // START -> REST is one enlargement about a fixed point (the mark grows out of its own top-left corner)
  const k0 = REST.w / START.w, Fx = (REST.x - START.x * k0) / (1 - k0), Fy = (REST.y - START.y * k0) / (1 - k0);
  // the way in: an enlargement about a point inside the O, far enough for the O alone to cover what the film fills
  const fy = REST.y + MH * REST.w / 2;
  const xl = REST.x + 0.562353 * REST.w + K * (fy - REST.y), xr = REST.x + 0.847059 * REST.w + K * (fy - REST.y);
  const za = K * (FIN.y + FIN.h - fy), zb = K * (fy - FIN.y);
  const fx = (xl * (PW + zb) + za * xr) / (PW + za + zb - (xr - xl));
  const SEND = (fx + za) / (fx - xl) * 1.05;
  const hx = canPin ? Math.round(H0 * (desk ? 1.15 : 0.66)) : 0, ZS = canPin ? H0 * (desk ? 0.74 : 0.5) : PH * 0.6;
  if (canPin) { root.style.setProperty('--hx', hx + 'px'); root.classList.add('pin'); }
  // (for the header that stays at the top of the window: the film, once it is the whole window, is a dark ground)
  if (canPin && desk) film.setAttribute('data-tone', 'dark');
  const f2 = (v) => String(Math.round(v * 100) / 100);
  const pathOf = (x, y, w) => {
    let d = '';
    for (let i = 0; i < MARK.length; i++) {
      const segs = MARK[i];
      for (let j = 0; j < segs.length; j++) {
        const s = segs[j];
        if (s[0] === 'A') { const r = f2(s[1] * w); d += 'A' + r + ' ' + r + ' 0 0 ' + s[2] + ' ' + f2(x + s[3] * w) + ' ' + f2(y + s[4] * w); }
        else d += s[0] + f2(x + s[1] * w) + ' ' + f2(y + s[2] * w);
      }
      d += 'Z';
    }
    return d;
  };
  let ps = clamp(window.pageYOffset / ZS, 0, 1), lastKey = '', ovO = -1, toO = -1, shO = -1, cueO = -1, unO = -1, wst = 0, inMark = true;
  // the film closes on the company's own logo: inside the mark that would be the logo within the logo, so there it starts over before it
  const CUT = 28.15;
  const onTime = () => { if (inMark && vid.currentTime > CUT) { try { vid.currentTime = 0; } catch (e) {} } };
  on(vid, 'timeupdate', onTime);
  const place = (q, p, drift) => {
    const key = q.toFixed(4) + '|' + p.toFixed(4) + '|' + drift.toFixed(1);
    if (key === lastKey) return;
    lastKey = key;
    const s = Math.pow(k0, q), z = Math.pow(SEND, p);
    const x = fx + (Fx + (START.x - Fx) * s - fx) * z, y = fy + (Fy + (START.y - Fy) * s - fy) * z, w = START.w * s * z;
    film.style.clipPath = p >= 0.9995 ? 'none' : "path('" + pathOf(x, y, w) + "')";
    // toned in the one blue at rest; its own colours come as the way in is made
    const c = sstep(clamp((p - 0.26) / 0.5, 0, 1));
    if (toO !== c) { toO = c; tone.style.opacity = (1 - c).toFixed(3); vid.style.filter = stl.style.filter = c >= 0.999 ? 'none' : 'grayscale(' + (1 - c).toFixed(3) + ')'; }
    // the picture goes from its place at rest to its place in the end during the first half of the way in; whatever the mark
    // shows at any moment (inside what the film fills) stays covered
    const e = sstep(clamp(p / 0.5, 0, 1));
    const vL = Math.max(FIN.x, x), vR = Math.min(FIN.x + FIN.w, x + w), vT = Math.max(FIN.y, y), vB = Math.min(FIN.y + FIN.h, y + MH * w);
    const put = (el, R) => {
      const sc = Math.max(R.s + (1 - R.s) * e, (vR - vL) / Wf, (vB - vT) / Hf), Wc = Wf * sc, Hc = Hf * sc;
      const L = clamp(R.L + (L1 - R.L) * e + drift, vR - Wc, vL), T = clamp(R.T + (T1 - R.T) * e, vB - Hc, vT);
      el.style.transform = 'translate3d(' + (L - L1).toFixed(1) + 'px,' + (T - T1).toFixed(1) + 'px,0) scale(' + sc.toFixed(4) + ')';
    };
    put(vid, RF); put(stl, RS);
  };
  place(0, sstep(ps), 0);
  ov.style.opacity = '1';
  try { vid.muted = true; const pl = vid.play(); if (pl && pl.catch) pl.catch(() => {}); } catch (e) {}

  // (the news line counts down and goes away in the page itself — HomeNews — which also remembers "오늘 하루 보지 않기")

  // ---------- YouTube Originals: the row being looked at, and its poster ----------
  const yl = $('.b-yl'), yrs = $$('.b-yr'), yp = $('.b-yp'), ypcs = $$('.b-yp .pc'), yct = $('.b-yp .ct b');
  let yCur = 0, yHover = -1, yLit = false;
  const ySet = (i) => {
    if (i === yCur) return;
    for (let k = 0; k < ypcs.length; k++) ypcs[k].classList.toggle('was', k === yCur);
    ypcs[yCur].classList.remove('on'); yrs[yCur].classList.remove('on');
    yCur = i; ypcs[i].classList.remove('was'); ypcs[i].classList.add('on'); yrs[i].classList.add('on');
    if (yct) yct.textContent = (i < 9 ? '0' : '') + (i + 1);
  };
  yrs.forEach((el, i) => { on(el, 'mouseenter', () => { yHover = i; ySet(i); }); });
  on(yl, 'mouseleave', () => { yHover = -1; });

  // ---------- 2026 Lineup: one row of posters that moves on by itself, slowly — leftwards, the next poster coming in from
  // the right. One poster at a time is chosen (in its own colours, standing up a little): the one passing the middle of the
  // window, or — while a mouse is on the row — the one under it; the one left goes back. The mouse also steers the row
  // (user, 2026-11-13): towards the right edge it runs on faster, towards the left edge it runs back; near the middle it
  // keeps its own pace. It never stops for the mouse.
  // A conveyor: a poster that has left on the left comes round again on the right, out of sight (no copies).
  // The page as laid out keeps the board's grid.
  let lu = null, tk = null, tkw = null, lcs = [], NL = 0, drift = false;
  let cl = [], lx = [], cwd = 0, pitch = 0, loop = 0, tkx = 0, dpos = 0, dv = 0, speed = 0, lCur = -1, pick = -1;
  // the same pace on every screen: a new poster reaches the middle every PER seconds (about 44 px/s at 1440, 30 on a phone)
  const PER = 6;
  // with the mouse at an edge: this many times the pace more, forwards (right edge) or backwards (left edge)
  const STEER = 5;
  // a mouse can rest on the row (a finger leaves no pointer behind)
  const fine = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  let away = true;
  on(window, 'mousemove', () => { away = false; });
  on(document, 'mouseout', (e) => { if (!e.relatedTarget) away = true; });
  const choose = (i) => {
    if (i === lCur) return;
    if (lCur >= 0 && lcs[lCur]) lcs[lCur].classList.remove('on');
    lCur = i;
    if (i >= 0 && lcs[i]) lcs[i].classList.add('on');
  };
  // puts every poster where the row has got to; gives the one nearest the middle of the window
  const placeRow = () => {
    const lo = -tkx - pitch;                         // further left than this (in the row's own measure), a poster comes round
    let best = -1, bd = cwd * 0.62;
    for (let i = 0; i < NL; i++) {
      let x = cl[i] - dpos;
      x = ((x - lo) % loop + loop) % loop + lo;
      lcs[i].style.translate = (x - cl[i]).toFixed(2) + 'px 0';
      lx[i] = tkx + x;                               // its left edge in the window
      const d = Math.abs(lx[i] + cwd / 2 - W / 2);
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  };
  // (set up again when the list arrives from the CMS — before that the row holds empty frames)
  const setupDrift = () => {
    lcs.forEach((el) => { el.style.translate = ''; el.classList.remove('on'); });
    lu = $('.b-lu'); tk = $('.b-tk'); tkw = $('.b-tkw'); lcs = $$('.b-lc');
    NL = lcs.length; lCur = -1; pick = -1; drift = false;
    root.classList.remove('drift');
    if (!lu || !tk || !tkw || NL < 3) return;
    root.classList.add('drift'); void root.offsetWidth;
    const r0 = tk.getBoundingClientRect();
    cl = lcs.map((el) => el.getBoundingClientRect().left - r0.left);
    cwd = lcs[0].getBoundingClientRect().width; pitch = cl[1] - cl[0]; loop = NL * pitch; tkx = r0.left; speed = pitch / PER;
    // too few posters to fill the window and come round out of sight: the grid stays
    if (!(pitch > 0) || loop < W + 2 * pitch) { root.classList.remove('drift'); return; }
    drift = true;
    dpos %= loop;
    choose(placeRow());                              // where the row has got to (no frame in its laid-out place)
  };
  setupDrift();
  void root.offsetWidth; remeasure();

  const ct = $('.h-ct'), ctSlab = $('.h-ct .m1-slabw');
  X.frame = (c) => {
    // the wordmark steps out of the growing mark's way and comes back at the margin (wherever the page happens to be)
    const ws = c.t >= 1.5 ? 3 : c.t >= 0.8 ? 2 : c.t >= 0.45 ? 1 : 0;
    if (ws !== wst) { wst = ws; root.classList.toggle('wa', ws >= 1); root.classList.toggle('wb', ws >= 2); root.classList.toggle('wc', ws >= 3); }
    // first screen
    if (c.y < PH + hx + 60) {
      const q = eio(clamp((c.t - 0.55) / 1.5, 0, 1));
      const p0 = clamp(c.y / ZS, 0, 1);
      ps += (p0 - ps) * (1 - Math.exp(-c.dt * 10)); if (Math.abs(p0 - ps) < 0.0004) ps = p0;
      const p = sstep(ps);
      place(q, p, desk ? -c.ptr.sx * 9 * q * (1 - p) : 0);
      inMark = p < 0.5;
      // what stands under the mark makes room before the mark reaches it
      if (desk) {
        const uf = clamp(ps / 0.2, 0, 1);
        if (unO !== uf) { unO = uf; und.style.opacity = (1 - sstep(uf)).toFixed(3); und.style.transform = uf > 0 ? 'translate3d(0,' + (uf * 26).toFixed(1) + 'px,0)' : ''; und.style.visibility = uf >= 1 ? 'hidden' : ''; }
      }
      const oo = 1 - clamp((c.t - 1.0) / 1.05, 0, 1);            // the logo's own blue gives way to the film as the mark arrives
      if (ovO !== oo) { ovO = oo; ov.style.opacity = oo.toFixed(3); if (!desk) bar2.style.opacity = oo.toFixed(3); }
      if (desk) {
        const so = clamp((p - 0.45) / 0.55, 0, 1); if (shO !== so) { shO = so; shade.style.opacity = so.toFixed(3); }
        const fo = canPin ? clamp((p - 0.9) / 0.1, 0, 1) * clamp(1 - (c.y - (hx - c.H * 0.12)) / (c.H * 0.1), 0, 1) : 0;
        if (cueO !== fo) { cueO = fo; fcue.style.opacity = fo.toFixed(3); }
      }
    }
    // the channel list
    const lr = yl.getBoundingClientRect();
    if (lr.bottom > -40 && lr.top < c.H + 40) {
      if (yHover < 0) {
        const line = c.H * (desk ? 0.5 : 0.45); let best = 0, bd = 1e9;
        for (let i = 0; i < yrs.length; i++) { const r = yrs[i].getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - line); if (d < bd) { bd = d; best = i; } }
        ySet(best);
      }
      const mid = lr.top + lr.height / 2, lit = mid > c.H * 0.1 && mid < c.H * 0.9;
      if (lit !== yLit) { yLit = lit; yp.classList.toggle('lit', lit); }
    }
    // the lineup, while it is in sight
    const lr2 = drift ? lu.getBoundingClientRect() : null;
    if (lr2 && lr2.top < c.H + 40 && lr2.bottom > -40) {
      let rest = false, aim = speed;
      if (fine && !away) { const wr = tkw.getBoundingClientRect(); rest = c.ptr.cx >= wr.left && c.ptr.cx <= wr.right && c.ptr.cy >= wr.top && c.ptr.cy <= wr.bottom; }
      if (rest) {
        // where the mouse is across the window: -1 at the left edge, 1 at the right; a quiet band in the middle
        const u = clamp((c.ptr.cx - c.W / 2) / (c.W / 2), -1, 1), a = Math.max(0, (Math.abs(u) - 0.16) / 0.84), e = a * a * (3 - 2 * a);
        aim = u > 0 ? speed * (1 + STEER * e) : speed * (1 - (STEER + 2) * e);
      }
      dv += (aim - dv) * (1 - Math.exp(-c.dt * 3));
      dpos = ((dpos + dv * c.dt) % loop + loop) % loop;
      const best = placeRow();
      if (rest) {
        // the poster under the mouse is the chosen one (between two posters the last one stays chosen)
        for (let i = 0; i < NL; i++) {
          if (c.ptr.cx < lx[i] || c.ptr.cx > lx[i] + cwd) continue;
          const r = lcs[i].getBoundingClientRect();
          if (c.ptr.cy >= r.top && c.ptr.cy <= r.bottom) pick = i;
          break;
        }
      } else pick = -1;
      choose(pick >= 0 ? pick : best);
    }
    const cr = ct.getBoundingClientRect();
    if (cr.top < c.H && cr.bottom > 0) ctSlab.style.transform = 'translate3d(' + (-c.ptr.sx * 16).toFixed(2) + 'px,' + ((cr.top - (c.H - cr.height)) * -0.1).toFixed(1) + 'px,0)';
  };
  X.rescan = () => { setupDrift(); };
  X.stop = () => {
    root.classList.remove('pin', 'tall', 'drift', 'wa', 'wb', 'wc');
    und.style.opacity = ''; und.style.transform = ''; und.style.visibility = '';
    root.style.removeProperty('--hx');
    film.style.clipPath = clip0; film.style.pointerEvents = ''; film.removeAttribute('data-tone');
    ['left', 'top', 'width', 'height', 'right', 'bottom'].forEach((k) => { vd.style[k] = ''; });
    ['transform', 'transformOrigin', 'filter', 'left', 'top', 'width', 'height'].forEach((k) => { vid.style[k] = ''; stl.style[k] = ''; });
    [tone, ov, shade, fcue, bar2].forEach((el) => { el.style.opacity = ''; });
    ypcs.forEach((el, k) => { el.classList.remove('was'); el.classList.toggle('on', k === 0); }); yrs.forEach((el, k) => el.classList.toggle('on', k === 0));
    if (yct) yct.textContent = '01'; yp.classList.remove('lit');
    lcs.forEach((el) => { el.style.translate = ''; el.classList.remove('on'); });
    ctSlab.style.transform = '';
  };
}
