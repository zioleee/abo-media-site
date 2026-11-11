// The main page (board: M4-HomeB): the mark as the window onto the film; YouTube Originals as a list with one large
// poster; the lineup that travels while its section holds; Contact's close; the footer.
import Link from "next/link";
import MonoRoot from "../MonoRoot";
import Footer from "../Footer";
import HomeHero from "./HomeHero";
import HomeLineup from "./HomeLineup";
import { ArrowUR, Poster, Tag, vars, verticalTitle } from "../parts";
import { CHANNELS, HOME, hrefOf, type Lang } from "../content";

export default function HomeView({ lang }: { lang: Lang }) {
  const h = HOME[lang];
  const ct = verticalTitle(h.ctH.map((s, i) => (i === h.ctBold ? [{ b: s }] : [s])), lang);
  const two = (i: number) => String(i).padStart(2, "0");
  return (
    <MonoRoot key={hrefOf(lang, "/")} page="home" lang={lang} path="/" motion="home">
      <main>
        <HomeHero lang={lang} />

        <section className="m1-hist b-yt">
          <div className="m1-paper" aria-hidden="true" />
          <div className="m1-pad" style={{ position: "relative" }}>
            <div className="m1-g12 h-head">
              <div className="h-hd">
                <h2 data-m="line"><Tag text={h.ytTitle} cls="mid" /></h2>
                <p className="rg" data-m="fade" style={vars({ "--d": ".3s" })}>{h.ytLabel}</p>
              </div>
              <p className="h-desc" data-m="rise" style={vars({ "--d": ".15s" })}>{h.ytDesc[0]}<br />{h.ytDesc[1]}</p>
            </div>
            <div className="b-ytb">
              <ol className="b-yl">
                {CHANNELS.map((c, i) => {
                  const name = lang === "ko" ? c.ko : c.en;
                  const inner = (
                    <>
                      <span className="th" aria-hidden="true"><Poster src={c.src} ratio={1 / 1.414} alt="" /></span>
                      <span className="tx">
                        <span className="no" aria-hidden="true">{two(i + 1)}</span>
                        <span className="nm"><span className="kw">{name}</span></span>
                      </span>
                      {c.href && <span className="ar" aria-hidden="true"><ArrowUR /></span>}
                    </>
                  );
                  return (
                    <li key={c.src} className={"b-yr" + (i === 0 ? " on" : "")} data-m="rise" style={vars({ "--d": `${(i * 0.06).toFixed(2)}s` })}>
                      {c.href ? <a className="rw" href={c.href} target="_blank" rel="noopener noreferrer">{inner}</a> : <div className="rw">{inner}</div>}
                    </li>
                  );
                })}
              </ol>
              <div className="b-yp" aria-hidden="true" data-m="rise" style={vars({ "--d": ".2s" })}>
                <div className="st">
                  {CHANNELS.map((c, i) => (
                    <div key={c.src} className={"pc" + (i === 0 ? " on" : "")}><Poster src={c.src} ratio={1 / 1.414} alt={lang === "ko" ? c.ko : c.en} /></div>
                  ))}
                </div>
                <p className="ct"><b>01</b> / {two(CHANNELS.length)}</p>
              </div>
            </div>
          </div>
        </section>

        <HomeLineup lang={lang} />

        <section className="h-ct" style={vars({ "--vn": ct.vn })}>
          <div className="h-cts">
            <div className="m1-slabw" aria-hidden="true" data-m="slab" data-at="0.9"><div className="m1-slab"><i /></div></div>
            <div className="h-vtw">
              <h2 className="h-vt" data-m="vt" data-at="0.84" aria-label={h.ctH.join(" ")}><span aria-hidden="true">{ct.node}</span></h2>
            </div>
            <p className="h-ctlab" data-m="line" data-at="0.96"><Tag text={h.ctLabel} /></p>
          </div>
          <div className="h-ctx">
            <p data-m="rise">{h.ctP}</p>
            <p className="h-btns" data-m="rise" style={vars({ "--d": ".12s" })}>
              <Link href={hrefOf(lang, "/contact")} className="m1-btn fill"><span>{h.ctBtn1}</span><ArrowUR /></Link>
              <Link href={hrefOf(lang, "/ir")} className="m1-btn"><span>{h.ctBtn2}</span><ArrowUR /></Link>
            </p>
          </div>
        </section>
      </main>
      <Footer lang={lang} path="/" />
    </MonoRoot>
  );
}
