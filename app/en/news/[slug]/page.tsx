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

      if (!text.trim()) return <div key={idx} className="h-5" />;

      return (
        <p
          key={idx}
          className="
            text-gray-900
            text-[17px] md:text-[19px]
            font-normal
            leading-8 md:leading-9
            mb-6
            whitespace-pre-line
          "
        >
          {text}
        </p>
      );
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
    <main className="bg-white">
      <article className="py-14 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Meta (category | date) */}
          <div className="flex items-center gap-3 text-[16px] md:text-[17px] font-bold text-gray-800 mb-6">
            {categoryLabel ? (
              <>
                <span className="uppercase tracking-wide">{categoryLabel}</span>
                <span className="text-gray-400">|</span>
              </>
            ) : null}
            <time className="font-bold">{formatDate(news.publishedDate)}</time>
          </div>

          {/* Title */}
          <h1 className="text-[30px] md:text-[42px] font-extrabold text-gray-900 leading-tight tracking-tight mb-10">
            {news.title}
          </h1>

          {/* Cover image */}
          {news.coverImage?.url ? (
            <div className="mb-12">
              <div className="relative w-full max-w-[720px] mx-auto h-[320px] md:h-[420px] rounded-2xl overflow-hidden">
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

          {/* Body */}
          <div className="mt-2">{renderRichText(news.content?.raw ?? null)}</div>

          {/* Back button */}
          <div className="mt-16 pt-10 border-t border-gray-200 flex justify-end">
            <Link
              href="/en/news"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 font-semibold hover:bg-gray-50 transition"
            >
              Back to List
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}