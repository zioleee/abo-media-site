// About (board: M4-About): the first screen, the three values as the logo's forms on graph paper (each under its letter;
// the boards' 01–03 beside the letters are gone — user, 2026-11-13), the statement, the history with every programme's
// poster, the numbers.
import MonoRoot from "../MonoRoot";
import Hero from "../Hero";
import Footer from "../Footer";
import AboutHistory from "./AboutHistory";
import { GridForm, Tag, vars } from "../parts";
import { ABOUT, HERO, STATS, TAGW, hrefOf, type Lang } from "../content";

export default function AboutView({ lang }: { lang: Lang }) {
  const a = ABOUT[lang];
  const path = "/about";
  return (
    <MonoRoot key={hrefOf(lang, path)} page="about" lang={lang} path={path} cur="about">
      <main>
        <Hero lang={lang} path={path} cur="about" name="About" tgw={TAGW.about} columns={HERO.about[lang]} />
        <section className="m1-idn m1-pad">
          <div className="m1-g12">
            <p style={{ gridColumn: "1 / 6" }} data-m="line"><Tag text={a.idLabel} cls="mid" /></p>
            <h2 className="m1-ititle" style={vars({ gridColumn: "6 / 13", "--d": ".12s" })} data-m="rise"><b>ABO</b> MEDIA{a.idTitle}</h2>
          </div>
          <div className="m1-panels">
            {a.values.map((v, i) => (
              <article key={v.letter} className="m1-panel" data-m="rise" style={vars({ "--d": `${(i * 0.12).toFixed(2)}s` })}>
                <p className="k"><b>{v.letter}</b></p>
                <div className="fm"><GridForm g={v.letter as "A" | "B" | "O"} uid={`m1g${v.letter}`} /></div>
                <p className="vd">{v.desc[0]}{" "}<br />{v.desc[1]}</p>
                <p className="w">{v.word}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="m1-stmt m1-pad m1-g12">
          <p className="m1-say m1-hl" data-m="rise" data-at="0.82">
            {a.statement.map((s, i) => (s.em ? <span key={i} className="kw">{s.em}</span> : s.t))}
          </p>
        </section>
        <AboutHistory lang={lang} />
        <section className="m1-nums">
          <div className="m1-paper" aria-hidden="true" />
          <div className="m1-pad">
            <div className="m1-ngrid" data-m="fade" data-count="" data-at="0.8">
              {STATS.map((s, i) => {
                const num = s.value.replace(/\+$/, "");
                return (
                  <div key={s.label} data-m="rise" style={vars({ "--d": `${(i * 0.1).toFixed(1)}s` })}>
                    <p className="n" aria-label={s.value}>
                      <span data-to={num} aria-hidden="true">{num}</span>
                      {s.value.endsWith("+") && <i aria-hidden="true">+</i>}
                    </p>
                    <p className="l">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} path={path} cur="about" />
    </MonoRoot>
  );
}
