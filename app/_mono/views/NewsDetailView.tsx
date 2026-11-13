// A news article (the boards drew none): the list's language read at length — the label and the day in the serif
// beside the headline on sheared graph paper, then the picture whole in a hairline frame, the text, the way back.
import Link from "next/link";
import { notFound } from "next/navigation";
import MonoRoot from "../MonoRoot";
import Header from "../Header";
import Footer from "../Footer";
import { ArrowUR, Tag } from "../parts";
import { NEWS, hrefOf, type Lang } from "../content";
import { dateParts, getNewsDetail, optimizeHygraphImage, paragraphsOf } from "../data";

export default async function NewsDetailView({ lang, slug }: { lang: Lang; slug: string }) {
  const news = await getNewsDetail(slug);
  if (!news) notFound();
  const t = NEWS[lang];
  const path = `/news/${slug}`;
  const d = dateParts(news.publishedDate);
  const category = (news.category ?? "").trim();
  const paras = paragraphsOf(news.content?.raw ?? null);
  return (
    <MonoRoot key={hrefOf(lang, path)} page="article" lang={lang} path={path} cur="news">
      <main>
        <section className="m1-ahead m1-pad">
          <div className="m1-paper" aria-hidden="true" />
          <Header lang={lang} path={path} cur="news" />
          <div className="m1-g12">
            <p className="m1-ameta" data-m="line">
              <Tag text={t.label} />
              {d && <time dateTime={`${d.y}-${d.m}-${d.d}`}>{d.y}.{d.m}.{d.d}</time>}
              {category && <span className="cat">{category}</span>}
            </p>
            <h1 className="m1-atitle" data-m="rise">{news.title}</h1>
          </div>
        </section>
        <article className="m1-abody m1-pad">
          <div className="m1-g12">
            <div className="m1-acol">
              {news.coverImage?.url && (
                <figure className="m1-acov" data-m="fade">
                  <img src={optimizeHygraphImage(news.coverImage.url, 1600)} alt={news.title} decoding="async" />
                </figure>
              )}
              <div className="m1-atext" data-m="rise">
                {paras.map((p, i) => (p.trim() ? <p key={i}>{p}</p> : <div key={i} className="gap" />))}
              </div>
              <p className="m1-aback">
                <Link href={hrefOf(lang, "/news")} className="m1-btn"><span>{t.back}</span><ArrowUR /></Link>
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer lang={lang} path={path} cur="news" />
    </MonoRoot>
  );
}
