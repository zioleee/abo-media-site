"use client";
// The root of every page: the element the design's styles hang on (class "mono" + "mono-<page>"), the motion engine that
// runs on it while the page scrolls in a window, the header that stays at the top of the window, the phone menu, the
// poster viewer, and the shape the pointer takes over a poster.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { startEngine } from "./engine";
import tabsMotion from "./motion/tabs";
import homeMotion from "./motion/home";
import pointerMotion from "./motion/pointer";
import MobileMenu from "./MobileMenu";
import PosterViewer, { type ViewItem } from "./PosterViewer";
import Header from "./Header";
import { FORMS } from "./marks";
import type { Lang, TabKey } from "./content";

type Mono = {
  rescan: () => void;
  openMenu: (from?: HTMLElement | null) => void;
  menuOpen: boolean;
  /** a poster seen large: the list it belongs to, which one, and what was pressed (the focus goes back there) */
  view: (list: ViewItem[], index: number, from?: HTMLElement | null) => void;
};
const MonoContext = createContext<Mono>({ rescan() {}, openMenu() {}, menuOpen: false, view() {} });
export const useMono = () => useContext(MonoContext);

type Engine = { rescan(): void; stop(): void };

export default function MonoRoot({
  page,
  lang,
  path,
  cur,
  motion = "tabs",
  children,
}: {
  page: string;
  lang: Lang;
  path: string;
  cur?: TabKey;
  motion?: "tabs" | "home" | "none";
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pv, setPv] = useState<{ list: ViewItem[]; i: number; open: boolean }>({ list: [], i: 0, open: false });
  const pvOpener = useRef<HTMLElement | null>(null);
  const pvStep = useRef(false); // the viewer added a step to the browser's history (Back closes it)

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const extras = motion === "home" ? [homeMotion, pointerMotion] : motion === "tabs" ? [tabsMotion, pointerMotion] : [];
    const e: Engine = startEngine(root, extras);
    engine.current = e;
    let alive = true;
    // text set in a web font that arrives late moves things a little: measure again once the fonts are in
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (alive) e.rescan(); });
    return () => {
      alive = false;
      e.stop();
      engine.current = null;
    };
  }, [motion]);

  // The header stays at the top of the window (user, 2026-11-13). Every page keeps its own header where the design has
  // it; once that one starts to leave the window (at once on most pages; on the main page when the first screen lets
  // go), the same header takes its place at the top and stays: over a light part of the page blue on frosted white,
  // over a blue part (or the main page's film) white on frosted blue. Works with or without the motion engine.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      const own = root.querySelector<HTMLElement>("header.m1-bar:not(.sk)");
      const bar = root.querySelector<HTMLElement>(".m1-stick .m1-bar");
      if (!own || !bar) return;
      const top = own.getBoundingClientRect().top;
      const stuck = top < -0.5;
      // (the ground is read all the time, so that the header is already in the right colours when it takes its place)
      let dark = false;
      const line = bar.offsetHeight / 2;
      root.querySelectorAll<HTMLElement>(".m1-nums, .b-lu, [data-tone='dark']").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) dark = true;
      });
      root.classList.toggle("sdark", dark);
      root.classList.toggle("stuck", stuck);
      root.classList.toggle("solid", stuck && top < -24);
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(check); };
    // (a window that changed size sets the page's motion up again a moment later: look once more then)
    let late = 0;
    const resized = () => { ask(); window.clearTimeout(late); late = window.setTimeout(ask, 500); };
    window.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", resized);
    check();
    return () => {
      window.removeEventListener("scroll", ask);
      window.removeEventListener("resize", resized);
      window.clearTimeout(late);
      if (raf) cancelAnimationFrame(raf);
      root.classList.remove("stuck", "solid", "sdark");
    };
  }, []);

  // after content changed (CMS data arrived, a year opened), on the next frame
  const rescan = useCallback(() => {
    requestAnimationFrame(() => engine.current?.rescan());
  }, []);
  const openMenu = useCallback((from?: HTMLElement | null) => {
    opener.current = from ?? (document.activeElement as HTMLElement | null);
    setMenuOpen(true);
  }, []);
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    const el = opener.current;
    opener.current = null;
    // (once the page is no longer inert)
    if (el && typeof el.focus === "function") requestAnimationFrame(() => el.focus({ preventScroll: true }));
  }, []);
  // The poster viewer. Opening it adds a step to the browser's history, so that Back — the gesture a phone's
  // user reaches for — closes it instead of leaving the page; closing it any other way takes that step back.
  const view = useCallback((list: ViewItem[], index: number, from?: HTMLElement | null) => {
    if (!list.length) return;
    pvOpener.current = from ?? (document.activeElement as HTMLElement | null);
    setPv({ list, i: Math.max(0, Math.min(list.length - 1, index)), open: true });
    try {
      window.history.pushState({ ...(window.history.state ?? {}), aboPoster: 1 }, "");
      pvStep.current = true;
    } catch {}
  }, []);
  const shutViewer = useCallback(() => {
    setPv((s) => (s.open ? { ...s, open: false } : s));
    const el = pvOpener.current;
    pvOpener.current = null;
    if (el && typeof el.focus === "function") requestAnimationFrame(() => el.focus({ preventScroll: true }));
  }, []);
  const closeViewer = useCallback(() => {
    if (pvStep.current) { pvStep.current = false; window.history.back(); } // (→ popstate → shutViewer)
    else shutViewer();
  }, [shutViewer]);
  const stepViewer = useCallback((d: number) => {
    setPv((s) => (s.open && s.list.length > 1 ? { ...s, i: (s.i + d + s.list.length) % s.list.length } : s));
  }, []);
  useEffect(() => {
    const onPop = () => { pvStep.current = false; shutViewer(); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [shutViewer]);
  const value = useMemo(() => ({ rescan, openMenu, menuOpen, view }), [rescan, openMenu, menuOpen, view]);

  return (
    <MonoContext.Provider value={value}>
      <div ref={ref} className={`r8 m1 mono mono-${page}`} lang={lang} inert={menuOpen || pv.open || undefined}>
        <div className="m1-stick"><Header lang={lang} path={path} cur={cur} sticky /></div>
        {children}
      </div>
      <MobileMenu lang={lang} path={path} cur={cur} open={menuOpen} onClose={closeMenu} />
      <PosterViewer lang={lang} list={pv.list} index={pv.i} open={pv.open} onClose={closeViewer} onStep={stepViewer} />
      {/* the shape the pointer takes over a poster that opens large: the logo's O as a thin outline, and a small plus —
          motion/pointer.js moves the two */}
      <div className="cur" aria-hidden="true">
        <div className="cur-o"><svg viewBox={FORMS.O.viewBox} focusable="false"><path className="cs" d={FORMS.O.d} pathLength={1} /><path d={FORMS.O.d} pathLength={1} /></svg></div>
        <div className="cur-x"><i /></div>
      </div>
    </MonoContext.Provider>
  );
}
