// About page in the COUNTER /company structure:
// blue hero with grid-paper strips → identity (2 columns) → (Values) circles → (History) → (Numbers) band → CTA.
import { ABOUT, HISTORY_EN, HISTORY_KO, STATS, type Lang } from "./content";
import { CtaBlock, Strips } from "./ui";

export default function AboutView({ lang }: { lang: Lang }) {
  const t = ABOUT[lang];
  const history = lang === "en" ? HISTORY_EN : HISTORY_KO;
  const first = history[0]?.year;
  const last = history[history.length - 1]?.year;

  return (
    <div className="c-page">
      {/* hero */}
      <section className="c-hero">
        <Strips
          keepFirst
          spec={[
            [34, 0, 66, 37, 0],
            [33, 37, 12, 63, -4],
            [55, 37, 45, 43, -8],
          ]}
        />
        <div className="c-hero-title c-wrap">
          <h1 className="c-h">About Us</h1>
          <p>{t.title}</p>
        </div>
      </section>

      {/* identity */}
      <section className="c-wrap" style={{ paddingTop: 88, paddingBottom: 120 }}>
        <div className="c-2col">
          <div>
            <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: "var(--c-blue)" }}>{t.idLabel}</p>
            <h2 style={{ margin: 0, fontSize: "clamp(22px, 2vw, 28px)", lineHeight: 1.5, fontWeight: 600, color: "var(--c-dark)" }}>
              {t.idTitle}
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: "clamp(16px, 1.35vw, 19px)", lineHeight: 2, color: "var(--c-dark)" }}>
            {t.statement.map((part, i) =>
              "em" in part ? (
                <strong key={i} style={{ color: "var(--c-blue)" }}>
                  {part.em}
                </strong>
              ) : (
                <span key={i}>{part.t}</span>
              )
            )}
          </p>
        </div>
      </section>

      {/* values */}
      <section className="c-wrap" style={{ paddingTop: 40, paddingBottom: 130, textAlign: "center" }}>
        <h2 className="c-serif" style={{ color: "var(--c-blue)", marginBottom: 56 }}>
          (Values)
        </h2>
        <ul className="c-circles">
          {t.values.map((v) => (
            <li key={v.letter}>
              <span className="c-label" style={{ color: "var(--c-blue)" }}>
                {v.letter}
              </span>
              <div className="c-circle">
                <p style={{ margin: 0, fontFamily: "var(--c-serif)", fontSize: "clamp(26px, 2.5vw, 36px)", color: "var(--c-blue)" }}>
                  {v.word.charAt(0) + v.word.slice(1).toLowerCase()}
                </p>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--c-dark)" }}>
                  {v.desc1}
                  <br />
                  {v.desc2}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* history */}
      <section className="c-wrap" style={{ paddingTop: 40, paddingBottom: 120 }}>
        <h2 className="c-serif" style={{ color: "var(--c-blue)", marginBottom: 64 }}>
          (History)
        </h2>
        <div className="c-histwrap">
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "var(--c-blue)" }}>
            {t.historyLabel}
            <br />
            <span style={{ fontWeight: 500 }}>
              {first} — {last}
            </span>
          </p>
          <div className="c-hist">
            {history.map((item) => (
              <div key={item.year}>
                <h3 className="c-serif" style={{ fontSize: "clamp(34px, 3.1vw, 44px)", color: "var(--c-blue)" }}>
                  {item.year}
                </h3>
                <ul>
                  {item.events.map((ev, i) =>
                    ev.shows.length === 0 ? (
                      <li key={i} style={{ fontWeight: 700, color: "var(--c-blue)" }}>
                        {ev.network}
                      </li>
                    ) : (
                      ev.shows.map((show, j) => (
                        <li key={`${i}-${j}`}>
                          <span style={{ color: "var(--c-blue)", marginRight: 8, fontSize: 11 }}>{ev.network}</span>
                          {show}
                        </li>
                      ))
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* numbers */}
      <section className="c-band">
        <Strips
          spec={[
            [56, 0, 24, 36, -2],
            [80, 0, 20, 48, -7],
          ]}
        />
        <div className="c-wrap" style={{ position: "relative", paddingTop: 72, paddingBottom: 110 }}>
          <h2 className="c-serif" style={{ marginBottom: 72 }}>
            (Numbers)
          </h2>
          <div className="c-stats">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="c-stat-v">{s.value}</p>
                <p className="c-stat-l">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBlock lang={lang} />
    </div>
  );
}
