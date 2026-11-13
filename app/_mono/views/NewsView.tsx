// News (board: M4-News): the first screen, then the list on sheared graph paper — the day in the serif, the headline,
// where it comes from, an arrow. The list is read on the server, as before.
import Link from "next/link";
import { Fragment } from "react";
import MonoRoot from "../MonoRoot";
import Hero from "../Hero";
import Footer from "../Footer";
import NextDoor from "../NextDoor";
import { ArrowUR, Tag, vars } from "../parts";
import { HERO, NEWS, TAGW, hrefOf, type Lang } from "../content";
import { dateParts, getNewsItems, sourceOf } from "../data";

export default async function NewsView({ lang }: { lang: Lang }) {
  const t = NEWS[lang];
  const path = "/news";
  const items = await getNewsItems();
  const rows = items.map((n) => {
    const external = (n.externalUrl ?? "").trim().length > 0;
    return { n, external, href: external ? n.externalUrl!.trim() : hrefOf(lang, `/news/${n.slug}`), d: dateParts(n.publishedDate) };
  });
  const years = Array.from(new Set(rows.map((r) => r.d?.y).filter(Boolean))) as string[];
  const range = years.length > 1 ? `${years[years.length - 1]} — ${years[0]}` : years[0] ?? "";

  return (
    <MonoRoot key={hrefOf(lang, path)} page="news" lang={lang} path={path} cur="news">
      <main>
        <Hero lang={lang} path={path} cur="news" name="News" tgw={TAGW.news} columns={HERO.news[lang]} />
        <section className="m1-hist">
          <div className="m1-paper" aria-hidden="true" />
          <div className="m1-pad m1-g12 m1-hgrid">
            <div className="m1-hside">
              <p data-m="line"><Tag text={t.label} cls="mid" /></p>
              {range && <p className="rg" data-m="fade" style={vars({ "--d": ".3s" })}>{range}</p>}
            </div>
            <div className="m1-hlist m1-nlist">
              {rows.length === 0 && (
                <p className="m1-nempty">{t.empty}<br />{t.emptySub}</p>
              )}
              {rows.map(({ n, external, href, d }, i) => {
                // the list is one year at a time: where it changes year, the year stands once
                const newYear = d && i > 0 && rows[i - 1].d?.y !== d.y;
                return (
                  <Fragment key={n.id}>
                    {newYear && <p className="m1-nyr" data-m="line">{d!.y}</p>}
                    <article className="m1-nrow">
                      <p className="dt">
                        {d ? <time dateTime={`${d.y}-${d.m}-${d.d}`} aria-label={`${d.y}.${d.m}.${d.d}`} data-m="line">{d.m}.{d.d}</time> : null}
                      </p>
                      <div className="hl">
                        <h2 data-m="rise" style={vars({ "--d": ".1s" })}>
                          {external ? (
                            <a href={href} target="_blank" rel="noopener noreferrer">{n.title}</a>
                          ) : (
                            <Link href={href}>{n.title}</Link>
                          )}
                        </h2>
                        <p className="src" data-m="fade" style={vars({ "--d": ".35s" })}>{sourceOf(n, t.site)}</p>
                      </div>
                      <span className="m1-go" aria-hidden="true"><ArrowUR /></span>
                    </article>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </section>
        <NextDoor lang={lang} cur="news" />
      </main>
      <Footer lang={lang} path={path} cur="news" />
    </MonoRoot>
  );
}
