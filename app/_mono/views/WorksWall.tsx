"use client";
// The wall of works, by year (newest first; the newest year three to a row, the others five). On a phone a year opens
// and closes at a tap (the newest is open). No count of the works beside the label (user, 2026-11-13).
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { useMono } from "../MonoRoot";
import { Minus, Plus, Poster, Tag, vars } from "../parts";
import { WORKS, type Lang } from "../content";
import { coverOf, getWorks, ratioOf, type Work } from "../data";

export default function WorksWall({ lang }: { lang: Lang }) {
  const t = WORKS[lang];
  const { rescan } = useMono();
  const [works, setWorks] = useState<Work[] | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  useEffect(() => {
    let alive = true;
    getWorks(100).then((w) => { if (alive) setWorks(w); });
    return () => { alive = false; };
  }, []);

  const years = useMemo(() => {
    const groups = new Map<string, Work[]>();
    for (const w of works ?? []) {
      const y = String(w.year);
      if (!groups.has(y)) groups.set(y, []);
      groups.get(y)!.push(w);
    }
    return Array.from(groups.entries()).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [works]);

  // the layout changed: what is still waiting to arrive is measured again
  useEffect(() => { if (works) rescan(); }, [works, open, rescan]);

  // the index of years: the page travels to the year (it used to jump there), and the address keeps the year without
  // adding a step to the way back
  const goYear = (e: MouseEvent<HTMLAnchorElement>, y: string) => {
    const el = document.getElementById(`y${y}`);
    if (!el || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const still = !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
    try { window.history.replaceState(window.history.state, "", `#y${y}`); } catch {}
  };

  const isOpen = (y: string, i: number) => open[y] ?? i === 0;
  const toggle = (y: string, i: number) => setOpen((o) => ({ ...o, [y]: !(o[y] ?? i === 0) }));

  return (
    <section className="m1-wsec m1-pad">
      <div className="m1-g12 m1-whead">
        <p className="m1-wtag" data-m="line">
          <Tag text={t.label} cls="mid" />
        </p>
        <nav className="m1-yidx" aria-label={t.years} data-m="fade" style={vars({ "--d": ".3s" })}>
          {years.map(([y]) => <a key={y} href={`#y${y}`} aria-label={t.year(y)} onClick={(e) => goYear(e, y)}>{y}</a>)}
        </nav>
      </div>
      <div className="m1-wall">
        {works && works.length === 0 && <p className="m1-wempty">{t.empty}</p>}
        {years.map(([y, list], yi) => {
          const o = isOpen(y, yi);
          return (
            <section key={y} id={`y${y}`} className={"m1-wy" + (o ? " open" : "") + (yi === 0 ? " now" : "")}>
              <header className="m1-wyh" onClick={() => toggle(y, yi)}>
                <h2 aria-label={y}><span data-m="line">{y}</span></h2>
                <button
                  type="button"
                  className="tg"
                  aria-expanded={o}
                  aria-controls={`yg${y}`}
                  aria-label={t.toggle(y)}
                  onClick={(e) => { e.stopPropagation(); toggle(y, yi); }}
                >
                  <Plus /><Minus />
                </button>
              </header>
              <div className="m1-wgrid" id={`yg${y}`}>
                {list.map((w, j) => {
                  const c = coverOf(w);
                  const ch = w.client?.name?.trim();
                  return (
                    <div key={w.id} className="m1-work" data-m="rise" style={vars({ "--d": `${((j % (yi === 0 ? 3 : 5)) * 0.06).toFixed(2)}s` })}>
                      <span className="th"><Poster src={c?.url} ratio={ratioOf(c)} alt={w.title} sizes={yi === 0 ? "(max-width: 760px) 44vw, min(23vw, 390px)" : "(max-width: 760px) 44vw, min(13vw, 224px)"} /></span>
                      {ch && <span className="ch">{ch}</span>}
                      <span className="ti">{w.title}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
