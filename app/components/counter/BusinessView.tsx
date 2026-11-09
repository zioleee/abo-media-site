// Business page in the COUNTER /service structure:
// light page head with tilted blue-tinted images → lead → white card with (01) serif titles and pill tags → (One Pipeline) band.
import Link from "next/link";
import { BUSINESS, type Lang } from "./content";
import { ArrowUR, PageHead, Strips } from "./ui";

const HEAD_IMAGES: [string, number][] = [
  ["/1hoga.jpg", -6],
  ["/baeckuk.jpg", 4],
  ["/mypyeon.jpg", -3],
];

function titleCase(tag: string) {
  return tag
    .split(" ")
    .map((w) => (w === "&" || w === "MCN" || w === "IP" ? w : w.charAt(0) + w.slice(1).toLowerCase()))
    .join(" ");
}

export default function BusinessView({ lang }: { lang: Lang }) {
  const t = BUSINESS[lang];

  return (
    <div className="c-page">
      <PageHead
        lang={lang}
        title="Business"
        sub={t.title === "BUSINESS" ? t.label : t.title}
        crumb="Business"
        aside={
          <div className="c-pimgs c-desk" aria-hidden="true">
            {HEAD_IMAGES.map(([src, r]) => (
              <div key={src} style={{ transform: `rotate(${r}deg)` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        }
      />

      <section className="c-wrap" style={{ paddingTop: 72, paddingBottom: 56 }}>
        <p style={{ margin: 0, maxWidth: 860, fontSize: "clamp(18px, 1.65vw, 23px)", lineHeight: 1.85, fontWeight: 600, color: "var(--c-dark)" }}>
          {t.leadA}
          <br />
          <span style={{ color: "var(--c-blue)" }}>{t.leadEm}</span>
          {t.leadB}
        </p>
        <ul className="c-index">
          {t.items.map((b) => (
            <li key={b.id}>
              <a href={`#section-${b.id}`}>
                <span>({b.id})</span>
                {b.title}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="c-wrap" style={{ paddingTop: 8, paddingBottom: 120 }}>
        <div className="c-card">
          {t.items.map((b) => (
            <article key={b.id} id={`section-${b.id}`} className="c-biz">
              <h2 style={{ margin: 0, display: "flex", alignItems: "flex-start", gap: 10, color: "var(--c-blue)" }}>
                <span style={{ fontFamily: "var(--c-hn)", fontSize: 12, fontWeight: 500, marginTop: 6 }}>({b.id})</span>
                <span className="c-serif" style={{ fontSize: "clamp(36px, 3.6vw, 52px)" }}>
                  {titleCase(b.tag)}
                </span>
              </h2>
              <p style={{ margin: "14px 0 0", fontSize: 17, fontWeight: 700, color: "var(--c-dark)" }}>
                {b.title}
                <span style={{ fontWeight: 500, color: "var(--c-ink)", marginLeft: 10 }}>{b.subtitle}</span>
              </p>
              <p style={{ margin: "10px 0 22px", maxWidth: 760, fontSize: 15, lineHeight: 1.9, color: "var(--c-ink)" }}>{b.description}</p>
              <ul className="c-pills">
                {b.keywords.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="c-band">
        <Strips
          spec={[
            [62, 0, 22, 40, -1],
            [84, 40, 16, 60, -6],
          ]}
        />
        <div className="c-wrap" style={{ position: "relative", paddingTop: 96, paddingBottom: 110 }}>
          <p className="c-serif" style={{ marginBottom: 40 }}>
            ({t.pipeLabel})
          </p>
          <h2 style={{ margin: 0, fontSize: "clamp(32px, 3.6vw, 52px)", lineHeight: 1.3, fontWeight: 700 }}>
            {t.pipeTitle[0]}
            <br />
            {t.pipeTitle[1]}
          </h2>
          <p style={{ margin: "24px 0 40px", maxWidth: 560, fontSize: 16, lineHeight: 1.9 }}>{t.pipeText}</p>
          <Link href={t.pipeHref} className="c-btn-white">
            {t.pipeCta} <ArrowUR size={18} stroke={1.8} />
          </Link>
        </div>
      </section>
    </div>
  );
}
