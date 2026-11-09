// app/en/news/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GraphQLClient, gql } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
const token = process.env.NEXT_PUBLIC_HYGRAPH_TOKEN;

const client = new GraphQLClient(
  endpoint as string,
  token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : undefined
);

const QUERY = gql`
  query NewsDetail($slug: String!) {
    news(where: { slug: $slug }) {
      id
      title
      slug
      publishedDate
      category
      coverImage {
        url
        width
        height
      }
      content {
        raw
      }
    }
  }
`;

type Asset = { url: string; width?: number | null; height?: number | null };
type RichTextRaw = { children?: Array<any> };

type NewsDetail = {
  id: string;
  title: string;
  slug: string;
  publishedDate?: string | null;
  category?: string | null;
  coverImage?: Asset | null;
  content?: { raw?: RichTextRaw | null } | null;
};

async function getNewsDetail(slug: string): Promise<NewsDetail | null> {
  try {
    const data = await client.request<{ news: NewsDetail | null }>(QUERY, { slug });
    return data.news ?? null;
  } catch (e) {
    console.error('Failed to fetch news detail:', e);
    return null;
  }
}

function formatDate(dateString?: string | null) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

function renderRichText(raw?: RichTextRaw | null) {
  const blocks = raw?.children ?? [];
  return blocks.map((block: any, idx: number) => {
    if (block?.type === 'paragraph') {
      const text = (block.children ?? [])
        .map((c: any) => (typeof c?.text === 'string' ? c.text : ''))
        .join('');

      if (!text.trim()) return <div key={idx} style={{ height: 20 }} />;

      return <p key={idx}>{text}</p>;
    }
    return null;
  });
}

export default async function EnNewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const news = await getNewsDetail(slug);
  if (!news) notFound();

  const categoryLabel = (news.category ?? '').trim();

  return (
    <div className="c-page">
      <section className="c-phead c-wrap">
        <p className="c-h">News</p>
        <p className="c-phead-sub">
          {categoryLabel ? <span style={{ textTransform: 'uppercase', marginRight: 10 }}>{categoryLabel}</span> : null}
          <time>{formatDate(news.publishedDate)}</time>
        </p>
        <p className="c-crumb">
          <Link href="/en">TOP</Link>
          <span aria-hidden="true" style={{ color: 'inherit', margin: '0 6px' }}>·</span>
          <Link href="/en/news" style={{ color: 'var(--c-blue)' }}>News</Link>
        </p>
      </section>

      <article className="c-wrap" style={{ paddingTop: 64, paddingBottom: 140 }}>
        <div className="c-article">
          <h1 style={{ margin: '0 0 48px', fontSize: 'clamp(28px, 3vw, 42px)', lineHeight: 1.35, fontWeight: 800, letterSpacing: '-0.01em', color: 'var(--c-blue)' }}>
            {news.title}
          </h1>

          {news.coverImage?.url ? (
            <div style={{ marginBottom: 48, background: '#fff', border: '1px solid var(--c-line)' }}>
              <div className="relative w-full max-w-[720px] mx-auto h-[320px] md:h-[420px] overflow-hidden">
                <Image
                  src={news.coverImage.url}
                  alt={news.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 720px"
                  className="object-contain"
                  priority
                  unoptimized
                />
              </div>
            </div>
          ) : null}

          <div className="c-article-body">{renderRichText(news.content?.raw ?? null)}</div>

          <div style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--c-blue)', display: 'flex', justifyContent: 'flex-end' }}>
            <Link href="/en/news" className="c-btn-line">
              Back to List
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                <path d="M4 12h16M14 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
