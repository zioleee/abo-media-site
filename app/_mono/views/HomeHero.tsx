"use client";
// The main page's first screen (Home B): the ABO mark is the window onto the company's film, toned in the one blue;
// scrolling goes in through the O until the film is the whole window (motion/home.js). Under the mark: what the
// company is, in its own words; at the foot, the news line.
import { useEffect, useRef } from "react";
import Header from "../Header";
import HomeNews from "./HomeNews";
import { ArrowD, Tag, vars } from "../parts";
import { FILM, HOME, type Lang } from "../content";
import { MARK_CLIP } from "../marks";

const CUT = 28.15; // the film closes on the company's logo: inside the mark that would be the logo within the logo, so there it starts over before it

export default function HomeHero({ lang }: { lang: Lang }) {
  const h = HOME[lang];
  const film = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  // the film plays in the page as laid out too (some hosts drop the muted attribute, and then nothing would start);
  // it takes the still's place once it is really running
  useEffect(() => {
    const v = video.current, f = film.current;
    if (!v || !f) return;
    const onTime = () => {
      if (v.currentTime > 0.02 && v.readyState >= 2) f.classList.add("run");
      const root = f.closest(".mono");
      if (root && !root.classList.contains("live") && v.currentTime > CUT) {
        try { v.currentTime = 0; } catch {}
      }
    };
    try {
      v.muted = true;
      v.addEventListener("timeupdate", onTime);
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } catch {}
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

  return (
    <section className="b-hero">
      <div className="b-pin">
        <Header lang={lang} path="/" wordmark />
        <svg className="b-clipdef" width="0" height="0" aria-hidden="true" focusable="false">
          <defs><clipPath id="bmk" clipPathUnits="objectBoundingBox"><path d={MARK_CLIP} /></clipPath></defs>
        </svg>
        <div className="b-band" aria-hidden="true" />
        <div ref={film} className="b-film" style={{ clipPath: "url(#bmk)" }}>
          <div className="vd">
            <i className="st" aria-hidden="true" />
            <video ref={video} src={FILM} autoPlay muted loop playsInline preload="auto" aria-label={h.film} />
            <div className="tn" aria-hidden="true"><i className="a" /><i className="b" /><i className="g" /></div>
          </div>
          <div className="ov" aria-hidden="true"><i /></div>
          <div className="sh" aria-hidden="true" />
          <div className="b-bar2" aria-hidden="true"><Header lang={lang} path="/" wordmark ghost /></div>
          <p className="fc" aria-hidden="true">Scroll<i><ArrowD /></i></p>
        </div>
        <div className="b-und">
          <div className="b-txt">
            <div className="b-ab">
              <p className="b-abl"><Tag text={h.aboutLabel} cls="mid" /></p>
              <p className="b-abp">{h.aboutP[0]}<br />{h.aboutP[1]}</p>
            </div>
            <h1 className="b-say m1-hl">
              <span className="ln" style={vars({ "--j": 0 })}>{h.say[0]}</span>{" "}
              <span className="ln" style={vars({ "--j": 1 })}>{h.say[1]}</span>{" "}
              <span className="ln" style={vars({ "--j": 2 })}><span className="kw">{h.sayEm}</span></span>
            </h1>
          </div>
          <p className="m1-cue" aria-hidden="true">Scroll<i><ArrowD /></i></p>
          <HomeNews lang={lang} />
        </div>
      </div>
    </section>
  );
}
