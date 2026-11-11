"use client";
// The root of every page: the element the design's styles hang on (class "mono" + "mono-<page>"), the motion engine that
// runs on it while the page scrolls in a window, and the phone menu.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { startEngine } from "./engine";
import tabsMotion from "./motion/tabs";
import homeMotion from "./motion/home";
import MobileMenu from "./MobileMenu";
import type { Lang, TabKey } from "./content";

type Mono = { rescan: () => void; openMenu: (from?: HTMLElement | null) => void; menuOpen: boolean };
const MonoContext = createContext<Mono>({ rescan() {}, openMenu() {}, menuOpen: false });
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

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const extras = motion === "home" ? [homeMotion] : motion === "tabs" ? [tabsMotion] : [];
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
  const value = useMemo(() => ({ rescan, openMenu, menuOpen }), [rescan, openMenu, menuOpen]);

  return (
    <MonoContext.Provider value={value}>
      <div ref={ref} className={`r8 m1 mono mono-${page}`} lang={lang} inert={menuOpen || undefined}>
        {children}
      </div>
      <MobileMenu lang={lang} path={path} cur={cur} open={menuOpen} onClose={closeMenu} />
    </MonoContext.Provider>
  );
}
