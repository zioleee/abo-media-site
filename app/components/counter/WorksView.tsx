'use client'

// Works page in the COUNTER /creative-case structure: rows with a thumbnail on the left,
// title on the right, grouped by year, with a year list on the left.
// Data comes from Hygraph exactly as on the current site.
import { useEffect, useMemo, useState } from "react";
import { GraphQLClient, gql } from "graphql-request";
import { WORKS_TEXT, type Lang } from "./content";
import { CtaBlock, PageHead } from "./ui";

const QUERY = gql`
  query Works {
    works(orderBy: year_DESC, first: 100) {
      id
      title
      slug
      year
      category
      coverImage { url width height }
      client {
        name
        website
        logo { url width height }
      }
    }
  }
`;

type Asset = { url: string; width: number; height: number };
type Client = { name: string; website?: string | null; logo?: Asset | null };
type Work = {
  id: string;
  title: string;
  slug: string;
  year: number;
  category: string;
  coverImage?: Asset | Asset[] | null;
  client?: Client | null;
};

async function getWorks(): Promise<Work[]> {
  try {
    const client = new GraphQLClient(process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT as string, {
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_HYGRAPH_TOKEN}` },
    });
    const data = await client.request<{ works: Work[] }>(QUERY);
    return data.works ?? [];
  } catch {
    return [];
  }
}

function cover(w: Work) {
  return Array.isArray(w.coverImage) ? w.coverImage[0] : w.coverImage;
}

export default function WorksView({ lang }: { lang: Lang }) {
  const t = WORKS_TEXT[lang];
  const [works, setWorks] = useState<Work[] | null>(null);
  const [year, setYear] = useState<string>("all");

  useEffect(() => {
    getWorks().then(setWorks);
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, Work[]>();
    for (const w of works ?? []) {
      const y = String(w.year);
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(w);
    }
    return [...map.entries()].sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [works]);

  const shown = year === "all" ? groups : groups.filter(([y]) => y === year);

  return (
    <div className="c-page">
      <PageHead lang={lang} title="Works" sub={t.title} crumb="Works" />

      <section className="c-wrap" style={{ paddingTop: 56, paddingBottom: 120 }}>
        <div className="c-side">
          <ul className="c-side-nav" aria-label={t.yearLabel}>
            <li>
              <button type="button" aria-current={year === "all" ? "true" : undefined} onClick={() => setYear("all")}>
                {t.all}
                {works && <sup>{works.length}</sup>}
              </button>
            </li>
            {groups.map(([y, list]) => (
              <li key={y}>
                <button type="button" aria-current={year === y ? "true" : undefined} onClick={() => setYear(y)}>
                  {y}
                  <sup>{list.length}</sup>
                </button>
              </li>
            ))}
          </ul>

          <div>
            {works === null && <p className="c-empty">{t.loading}</p>}
            {works !== null && shown.length === 0 && (
              <div className="c-empty">
                <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{t.emptyTitle}</p>
                <p style={{ margin: "8px 0 0", fontSize: 14 }}>{t.emptySub}</p>
              </div>
            )}
            {shown.map(([y, list]) => (
              <section key={y} className="c-ygroup">
                <div className="c-yhead">
                  <h2 className="c-serif" style={{ fontSize: "clamp(40px, 4vw, 58px)", color: "var(--c-blue)" }}>
                    {y}
                  </h2>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--c-dark)" }}>{t.count(list.length)}</span>
                </div>
                <div className="c-wgrid">
                  {list.map((w) => {
                    const img = cover(w);
                    return (
                      <div key={w.id} className="c-wrow">
                        <div className="c-wthumb">
                          {img?.url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={img.url} alt={w.title} loading="lazy" />
                          )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p className="c-wtitle">{w.title}</p>
                          <p className="c-wmeta">
                            {w.client?.name && <span>{w.client.name}</span>}
                            {w.category && <span>{w.category}</span>}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <CtaBlock lang={lang} />
    </div>
  );
}
