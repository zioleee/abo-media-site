// app/news/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GraphQLClient, gql } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
const token = process.env.NEXT_PUBLIC_HYGRAPH_TOKEN;

const client = new GraphQLClient(
  endpoint as string,
  token
    ? {
        headers: { Authorization: `Bearer ${token}` },
      }
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
  // 레퍼런스처럼 깔끔하게 (YYYY.MM.DD 느낌)
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

/**
 * Hygraph RichText(raw) 최소 렌더러
 * - paragraph 위주
 * - 글씨를 더 크고 두껍게(가독성)
 */
function renderRichText(raw?: RichTextRaw | null) {
  const blocks = raw?.children ?? [];
  return blocks.map((block: any, idx: number) => {
    if (block?.type === 'paragraph') {
      const text = (block.children ?? [])
        .map((c: any) => (typeof c?.text === 'string' ? c.text : ''))
        .join('');

      if (!text.trim()) return <div key={idx} className="h-4" />;

      return (
        <p
          key={idx}
          className="
            text-gray-90
            text-[16px] md:text-[18px]
            font-medium
            leading-7 md:leading-8
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

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const news = await getNewsDetail(params.slug);
  if (!news) notFound();

  const categoryLabel = (news.category ?? '').trim();
  const w = news.coverImage?.width ?? null;
  const h = news.coverImage?.height ?? null;

  return (
    <main className="bg-white">
      {/* 본문 */}
      <article className="py-14 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
         {/* 메타 정보 */}
<div className="
  flex items-center gap-3
  text-[15px] md:text-[16px]
  font-bold
  text-gray-800
  mb-6
">
  {categoryLabel ? (
    <>
      <span className="uppercase tracking-wide">
        {categoryLabel}
      </span>
      <span className="text-gray-400">|</span>
    </>
  ) : null}
  <time className="font-semibold">
    {formatDate(news.publishedDate)}
  </time>
</div>


          {/* 제목: 더 크고 더 굵게 */}
          <h1 className="text-[28px] md:text-[40px] font-extrabold text-gray-900 leading-tight tracking-tight mb-10">
            {news.title}
          </h1>

          {/* 대표 이미지: "너무 크게 깨짐" 방지
              - 고정 높이 박스 안에서 원본 비율 유지(object-contain)
              - 가운데 정렬 + 최대 폭 제한 */}
          {news.coverImage?.url ? (
            <div className="mb-12">
              <div
                className="
                  relative
                  w-full
                  max-w-[720px]
                  mx-auto
                  h-[420px] md:h-[520px]
                  rounded-2xl
                  overflow-hidden
                  bg-gray-100
                "
              >
                <Image
                  src={news.coverImage.url}
                  alt={news.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 720px"
                  className="object-contain"
                  priority
                />
              </div>

              {/* (선택) 원본 비율/사이즈 정보가 필요하면 아래 주석 해제
              <p className="mt-3 text-center text-xs text-gray-400">
                {w && h ? `Image ${w}×${h}` : null}
              </p>
              */}
            </div>
          ) : null}

          {/* 본문 */}
          <div className="mt-2">{renderRichText(news.content?.raw ?? null)}</div>

          {/* 하단: 레퍼런스처럼 "목록보기" 버튼을 우측에 */}
          <div className="mt-16 pt-10 border-t border-gray-200 flex justify-end">
            <Link
              href="/news"
              className="
                inline-flex items-center justify-center
                px-6 py-3
                rounded-lg
                border border-gray-300
                bg-white
                text-gray-800
                font-semibold
                hover:bg-gray-50
                transition
              "
            >
              목록보기
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
