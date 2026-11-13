"use client";
// The main page's lineup: the works the page names (HOME_WORKS, in that order) on the blue field, without numbers or a
// count. While the page moves, the row of posters moves on by itself, slowly (motion/home.js); the poster passing the
// middle of the window is in its own colours. The works are read in the browser, as before; until they are in, the row
// holds empty frames.
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMono } from "../MonoRoot";
import { ArrowUR, Poster, Tag, vars } from "../parts";
import { HOME, HOME_WORKS, hrefOf, type Lang } from "../content";
import { coverOf, getWorks, ratioOf, type Work } from "../data";

const NB = "\u00a0"; // a non-breaking space: an empty caption keeps its line

export default function HomeLineup({ lang }: { lang: Lang }) {
  const h = HOME[lang];
  const { rescan } = useMono();
  const [works, setWorks] = useState<Work[] | null>(null);
  useEffect(() => {
    let alive = true;
    getWorks(50).then((w) => { if (alive) setWorks(w); });
    return () => { alive = false; };
  }, []);
  useEffect(() => { if (works) rescan(); }, [works, rescan]);

  const list = works ? (HOME_WORKS.map((s) => works.find((w) => w.slug === s)).filter(Boolean) as Work[]) : null;
  if (list && list.length === 0) return null;
  const n = list ? list.length : HOME_WORKS.length;

  return (
    <section className="b-lu">
      <div className="b-lpin">
        <div className="m1-paper" aria-hidden="true" />
        <div className="m1-pad b-lin">
          <div className="m1-g12 h-head">
            <div className="h-hd">
              <h2 data-m="line"><Tag text={h.luTitle} cls="mid" /></h2>
              <p className="rg" data-m="fade" style={vars({ "--d": ".3s" })}>{h.luLabel}</p>
            </div>
            <p className="h-desc" data-m="rise" style={vars({ "--d": ".15s" })}>{h.luDesc}</p>
          </div>
          <div className="b-tkw">
            <div className="b-tk">
              {Array.from({ length: n }, (_, i) => {
                const w = list ? list[i] : null;
                const c = w ? coverOf(w) : null;
                return (
                  <div key={i} className="b-lc" data-m="rise" style={vars({ "--d": `${((i % 5) * 0.07).toFixed(2)}s` })}>
                    <span className="th">{w ? <Poster src={c?.url} ratio={ratioOf(c)} alt={w.title} lazy={false} sizes="(max-width: 760px) 42vw, min(20.5vw, 354px)" /> : <span className="pst" />}</span>
                    <span className="cp">
                      <span className="ch">{w?.client?.name?.trim() || NB}</span>
                      <span className="ti">{w ? w.title : NB}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="b-lb">
            <p className="b-more" data-m="rise">
              <Link href={hrefOf(lang, "/works")} className="m1-btn inv"><span>{h.luCta}</span><ArrowUR /></Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
