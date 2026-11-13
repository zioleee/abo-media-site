"use client";
// About's history: an index on sheared graph paper; every programme carries its poster in blue (in its own colours,
// and large, under the pointer). The posters are the works' covers from the CMS, read in the browser like the
// Works page's; until they are in, every programme has an empty blue frame of the poster's shape.
import { useEffect, useState } from "react";
import { useMono } from "../MonoRoot";
import { MarkSvg, Tag, vars } from "../parts";
import { ABOUT, HISTORY_EN, HISTORY_KO, type Lang } from "../content";
import { coverOf, getWorks, optimizeHygraphImage, ratioOf, workOfProgramme, type Work } from "../data";

const clean = (s: string) => s.replace(/[<>]/g, "").trim();

export default function AboutHistory({ lang }: { lang: Lang }) {
  const [works, setWorks] = useState<Work[] | null>(null);
  const { rescan } = useMono();
  useEffect(() => {
    let alive = true;
    getWorks(100).then((w) => { if (alive) setWorks(w); });
    return () => { alive = false; };
  }, []);
  useEffect(() => { if (works) rescan(); }, [works, rescan]);

  const shown = lang === "ko" ? HISTORY_KO : HISTORY_EN;
  const years = shown.map((item, yi) => {
    const rows: { net: string; prog: string | null; ko: string | null }[] = [];
    item.events.forEach((ev, ei) => {
      const kev = HISTORY_KO[yi]?.events[ei];
      if (!ev.shows.length) rows.push({ net: ev.network, prog: null, ko: null });
      ev.shows.forEach((s, si) => rows.push({ net: ev.network, prog: clean(s), ko: kev ? clean(kev.shows[si] ?? "") : null }));
    });
    return { year: item.year, rows };
  });

  return (
    <section className="m1-hist">
      <div className="m1-paper" aria-hidden="true" />
      <div className="m1-pad m1-g12 m1-hgrid">
        <div className="m1-hside">
          <p data-m="line"><Tag text={ABOUT[lang].historyLabel} cls="mid" /></p>
          <p className="rg" data-m="fade" style={vars({ "--d": ".3s" })}>{years[0].year} — {years[years.length - 1].year}</p>
        </div>
        <div className="m1-hlist">
          {years.map(({ year, rows }) => (
            <div key={year} className="m1-yr">
              <h3><span className="y" data-m="line">{year}</span></h3>
              <ul className="m1-ents">
                {rows.map((r, j) => {
                  const d = `${(Math.min(j, 9) * 0.05).toFixed(2)}s`;
                  if (r.prog === null) {
                    return (
                      <li key={j} className="m1-ent found" data-m="rise" style={vars({ "--d": d })}>
                        <span className="th mk"><MarkSvg /></span>
                        <span className="tx"><span className="pg">{r.net}</span></span>
                      </li>
                    );
                  }
                  const w = works && r.ko ? workOfProgramme(r.ko, year, works) : null;
                  const cover = w ? coverOf(w) : null;
                  const ratio = ratioOf(cover) ?? 1 / 1.414;
                  const src = cover ? optimizeHygraphImage(cover.url, 400) : null;
                  return (
                    <li
                      key={j}
                      className="m1-ent"
                      data-p={src ? "" : undefined}
                      data-m="rise"
                      style={vars(src ? { "--d": d, "--src": `url("${src}")`, "--ar": ratio.toFixed(4) } : { "--d": d })}
                    >
                      <span className="th" style={{ aspectRatio: ratio.toFixed(4) }}>
                        {src && <img src={src} alt="" loading="lazy" decoding="async" />}
                      </span>
                      <span className="tx"><span className="ch">{r.net}</span><span className="pg">{r.prog}</span></span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
