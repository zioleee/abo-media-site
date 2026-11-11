// Business (board: M4-Business): the four areas as an index (serif numeral, the English name in the serif, the text,
// the scope written vertically), then one leaning tube through the four on the blue field.
import Link from "next/link";
import MonoRoot from "../MonoRoot";
import Hero from "../Hero";
import Footer from "../Footer";
import { ArrowUR, Tag, vars } from "../parts";
import { BUSINESS, HERO, TAGW, hrefOf, type Lang } from "../content";

export default function BusinessView({ lang }: { lang: Lang }) {
  const b = BUSINESS[lang];
  const path = "/business";
  return (
    <MonoRoot key={hrefOf(lang, path)} page="business" lang={lang} path={path} cur="business">
      <main>
        <Hero lang={lang} path={path} cur="business" name="Business" tgw={TAGW.business} columns={HERO.business[lang]} />
        <section className="m1-idn m1-pad">
          <div className="m1-g12">
            <p style={{ gridColumn: "1 / 6" }} data-m="line"><Tag text={b.label} cls="mid" /></p>
            <p className="m1-ititle m1-hl" style={vars({ gridColumn: "6 / 13", "--d": ".12s" })} data-m="rise">
              {b.lead[0]}<span className="kw">{b.lead[1]}</span>{b.lead[2]}
            </p>
          </div>
          <div className="m1-areas">
            {b.items.map((it) => {
              const sp = it.tag.indexOf(" ");
              return (
                <article key={it.id} className="m1-g12 m1-area">
                  <p className="no"><span data-m="line" style={{ display: "inline-block" }}>{it.id}</span></p>
                  <p className="en" data-m="rise" style={vars({ "--d": ".08s" })}>{it.tag.slice(0, sp)}<br />{it.tag.slice(sp + 1)}</p>
                  <div className="bd" data-m="rise" style={vars({ "--d": ".18s" })}>
                    <h3>{it.title}</h3>
                    <p className="ds">{it.description}</p>
                    <ul className="m1-kws">{it.keywords.map((k) => <li key={k}>{k}</li>)}</ul>
                  </div>
                  <p className="vs" data-m="fade" style={vars({ "--d": ".4s" })}>{it.subtitle}</p>
                </article>
              );
            })}
          </div>
        </section>
        <section className="m1-nums m1-pipeb">
          <div className="m1-paper" aria-hidden="true" />
          <div className="m1-pad" style={{ position: "relative" }}>
            <div className="m1-g12">
              <p style={{ gridColumn: "1 / 6" }} data-m="line"><Tag text={b.pipeLabel} cls="mid" /></p>
              <h2 className="m1-ititle" style={vars({ gridColumn: "6 / 13", "--d": ".12s" })} data-m="rise">{b.pipeTitle[0]}<br /><b>{b.pipeTitle[1]}</b></h2>
            </div>
            <div className="m1-tube" data-m="fade" data-at="0.84">
              {b.items.map((it, i) => (
                <div key={it.id}><span style={vars({ "--i": i })}><span className="n">{it.id}</span><span className="t">{it.title}</span></span></div>
              ))}
            </div>
            <div className="m1-g12 m1-pfoot">
              <p className="m1-ptext" data-m="rise">{b.pipeText}</p>
              <div className="m1-pcta" data-m="rise" style={vars({ "--d": ".12s" })}>
                <Link href={hrefOf(lang, "/contact")} className="m1-btn inv"><span>{b.pipeCta}</span><ArrowUR /></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} path={path} cur="business" />
    </MonoRoot>
  );
}
