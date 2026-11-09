'use client'

// News page in the COUNTER /news structure: a year list on the left and
// date · source · title rows on the right. Items come from Hygraph via the page (server).
import Link from "next/link";
import { useMemo, useState } from "react";
import { NEWS_TEXT, type Lang } from "./content";
import { ArrowUR, CtaBlock, PageHead } from "./ui";

export type NewsListItem = {
  id: string;
  title: string;
  slug: string;
  externalUrl?: string | null;
  publishedDate?: string | null;
};

function formatDate(dateString?: string | null) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function sourceOf(url?: string | null) {
  if (!url) return "ABO MEDIA";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function NewsView({ lang, items }: { lang: Lang; items: NewsListItem[] }) {
  const t = NEWS_TEXT[lang];
  const [year, setYear] = useState("all");

  const years = useMemo(() => {
    const ys = new Set<string>();
    items.forEach((n) => {
      const y = formatDate(n.publishedDate).slice(0, 4);
      if (/^\d{4}$/.test(y)) ys.add(y);
    });
    return [...ys].sort((a, b) => Number(b) - Number(a));
  }, [items]);

  const shown = year === "all" ? items : items.filter((n) => formatDate(n.publishedDate).startsWith(year));

  return (
    <div className="c-page">
      <PageHead lang={lang} title="News" sub={t.title} crumb="News" />

      <section className="c-wrap" style={{ paddingTop: 72, paddingBottom: 140 }}>
        <div className="c-side">
          <ul className="c-side-nav">
            <li>
              <button type="button" aria-current={year === "all" ? "true" : undefined} onClick={() => setYear("all")}>
                {t.all}
              </button>
            </li>
            {years.map((y) => (
              <li key={y}>
                <button type="button" aria-current={year === y ? "true" : undefined} onClick={() => setYear(y)}>
                  {y}
                </button>
              </li>
            ))}
          </ul>

          <div style={{ borderTop: "1px solid var(--c-line)" }}>
            {shown.length === 0 ? (
              <div className="c-empty">
                <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{t.emptyTitle}</p>
                <p style={{ margin: "8px 0 0", fontSize: 14 }}>{t.emptySub}</p>
              </div>
            ) : (
              shown.map((n) => {
                const external = (n.externalUrl ?? "").trim().length > 0;
                const inner = (
                  <>
                    <span className="c-ndate">{formatDate(n.publishedDate)}</span>
                    <span className="c-nsrc">{sourceOf(external ? n.externalUrl : null)}</span>
                    <span className="c-ntitle">{n.title}</span>
                    <span style={{ justifySelf: "end" }}>
                      <ArrowUR size={20} stroke={1.4} />
                    </span>
                  </>
                );
                return external ? (
                  <a key={n.id} className="c-nrow" href={n.externalUrl!} target="_blank" rel="noopener noreferrer">
                    {inner}
                  </a>
                ) : (
                  <Link key={n.id} className="c-nrow" href={lang === "en" ? `/en/news/${n.slug}` : `/news/${n.slug}`}>
                    {inner}
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      <CtaBlock lang={lang} />
    </div>
  );
}
