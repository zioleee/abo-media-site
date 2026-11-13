"use client";
// A poster seen large (user, 2026-11-14). The posters of the Works wall and of the main page's lineup are the heart of
// the site, and nothing happened when one was pressed: now the blue sheet of the phone menu sweeps in with the logo's
// lean and the poster stands on it whole, in its own colours, beside its year, channel and title. Left and right (keys,
// the two buttons, a swipe) go through the list it was opened from; Escape, the cross, the browser's Back, or a press
// anywhere beside the poster close it.
import { useCallback, useEffect, useRef, useState, type MouseEvent, type TouchEvent } from "react";
import CmsImg from "./CmsImg";
import { Cross } from "./parts";
import { hygraphSrcSet, optimizeHygraphImage } from "./data";
import { VIEWER, type Lang } from "./content";

export type ViewItem = { id: string; title: string; year: string; channel?: string | null; src: string; ratio?: number | null };

const WIDTHS = [800, 1200, 1600];
const SIZES = "(max-width: 760px) 84vw, 44vw";

const ArrowL = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M18 7H2M8 1 2 7l6 6" /></svg>
);
const ArrowR = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M0 7h16M10 1l6 6-6 6" /></svg>
);

export default function PosterViewer({ lang, list, index, open, onClose, onStep }: { lang: Lang; list: ViewItem[]; index: number; open: boolean; onClose: () => void; onStep: (d: number) => void }) {
  const t = VIEWER[lang];
  const box = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [sharp, setSharp] = useState<string | null>(null); // the poster whose large picture is in
  const [fresh, setFresh] = useState(true); // just opened: the poster and its lines wait for the sheet
  const item = list[index];
  const many = list.length > 1;
  useEffect(() => { if (open) setFresh(true); }, [open]);
  // at a step the poster before stays under the new one until that has come in over it
  const [was, setWas] = useState<ViewItem | null>(null);
  const shown = useRef<ViewItem | null>(null);
  useEffect(() => {
    const before = shown.current;
    shown.current = open ? item ?? null : null;
    if (!open || !item || !before || before.id === item.id) { setWas(null); return; }
    setWas(before);
    const t = window.setTimeout(() => setWas(null), 1250);
    return () => window.clearTimeout(t);
  }, [open, item]);
  const step = useCallback((d: number) => { setFresh(false); onStep(d); }, [onStep]);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    // (the page stops scrolling once the sheet covers it: taking the scrollbar away earlier would shift the page in sight)
    const lock = window.setTimeout(() => { html.style.overflow = "hidden"; }, 560);
    const focus = requestAnimationFrame(() => closeBtn.current?.focus({ preventScroll: true }));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      else if (e.key === "Tab") {
        // the focus stays among the viewer's own buttons
        const f = Array.from(box.current?.querySelectorAll<HTMLElement>("button") ?? []);
        if (!f.length) return;
        const a = document.activeElement as HTMLElement | null;
        const i = a ? f.indexOf(a) : -1;
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(lock);
      cancelAnimationFrame(focus);
      html.style.overflow = before;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, step]);

  // the neighbours' large pictures are asked for ahead, so that a step shows a sharp poster at once
  useEffect(() => {
    if (!open || !many) return;
    [1, -1].forEach((d) => {
      const n = list[(index + d + list.length) % list.length];
      if (!n) return;
      // (asked for the way the poster itself will be: the browser then takes the same size)
      const im = new Image();
      const set = hygraphSrcSet(n.src, WIDTHS);
      if (set) { im.sizes = SIZES; im.srcset = set; }
      im.src = optimizeHygraphImage(n.src, 1200);
    });
  }, [open, many, list, index]);

  const beside = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.target as HTMLElement;
    if (!el.closest("button, .pv-fig, .pv-tx")) onClose();
  };
  const onTouchStart = (e: TouchEvent) => { const p = e.touches[0]; touch.current = p ? { x: p.clientX, y: p.clientY } : null; };
  const onTouchEnd = (e: TouchEvent) => {
    const s = touch.current, p = e.changedTouches[0];
    touch.current = null;
    if (!s || !p || !many) return;
    const dx = p.clientX - s.x, dy = p.clientY - s.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
  };

  const ratioOf = (x?: ViewItem | null) => (x?.ratio && x.ratio > 0.3 && x.ratio < 3 ? x.ratio : 1 / 1.414);
  const ratio = ratioOf(item);
  return (
    <div
      ref={box}
      className={"pv" + (open ? " on" : "")}
      role="dialog"
      aria-modal="true"
      aria-label={item ? `${item.title} — ${t.label}` : t.label}
      lang={lang}
      inert={!open || undefined}
      onClick={beside}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="pv-sheet" aria-hidden="true"><i /></div>
      <div className="pv-in">
        <div className="pv-bar">
          <button ref={closeBtn} type="button" className="pv-b" aria-label={t.close} onClick={onClose}><Cross /></button>
        </div>
        {item && (
          <div className="pv-stage" style={{ ["--ar" as string]: ratio.toFixed(4), ["--pd" as string]: fresh ? ".34s" : "0s" }}>
            <div className="pv-figw">
              {was && was.id !== item.id && (
                <figure key={"was" + was.id} className="pv-fig was sharp" aria-hidden="true" style={{ ["--ar" as string]: ratioOf(was).toFixed(4), backgroundImage: `url("${optimizeHygraphImage(was.src, 400)}")` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={optimizeHygraphImage(was.src, 1200)} srcSet={hygraphSrcSet(was.src, WIDTHS)} sizes={SIZES} alt="" />
                </figure>
              )}
              <figure key={item.id} className={"pv-fig" + (sharp === item.id ? " sharp" : "")} style={{ backgroundImage: `url("${optimizeHygraphImage(item.src, 400)}")` }}>
                <CmsImg
                  src={optimizeHygraphImage(item.src, 1200)}
                  srcSet={hygraphSrcSet(item.src, WIDTHS)}
                  sizes={SIZES}
                  fallback={item.src}
                  alt={item.title}
                  decoding="async"
                  onLoad={() => setSharp(item.id)}
                />
              </figure>
            </div>
            <div className="pv-tx">
              <div key={item.id} className="pv-ln">
                <p className="y"><span>{item.year}</span></p>
                {item.channel ? <p className="ch"><span>{item.channel}</span></p> : null}
                <h2 className="ti"><span>{item.title}</span></h2>
              </div>
              {many && (
                <p className="pv-nav">
                  <button type="button" className="pv-b" aria-label={t.prev} onClick={() => step(-1)}><ArrowL /></button>
                  <button type="button" className="pv-b" aria-label={t.next} onClick={() => step(1)}><ArrowR /></button>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
