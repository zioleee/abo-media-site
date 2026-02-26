// app/en/news/page.tsx
import Link from 'next/link';
import { GraphQLClient, gql } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT!;
const token = process.env.NEXT_PUBLIC_HYGRAPH_TOKEN;

const client = new GraphQLClient(
  endpoint,
  token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
);

const QUERY = gql`
  query NewsList {
    newsItems(orderBy: publishedDate_DESC, first: 100) {
      id
      title
      slug
      externalUrl
      publishedDate
      coverImage {
        url
        width
        height
      }
    }
  }
`;

type Asset = { url: string; width?: number | null; height?: number | null };

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  externalUrl?: string | null;
  publishedDate?: string | null;
  coverImage?: Asset | null;
};

async function getNewsItems(): Promise<NewsItem[]> {
  try {
    const data = await client.request<{ newsItems: NewsItem[] }>(QUERY);
    return data.newsItems ?? [];
  } catch (e) {
    console.error('Failed to fetch newsItems:', e);
    return [];
  }
}

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const apiUrl = `${base}/api/og?url=${encodeURIComponent(url)}`;

    const res = await fetch(apiUrl, {
      next: { revalidate: 60 * 60 * 6 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    return (json?.ogImage as string) ?? null;
  } catch (e) {
    console.error('Failed to fetch OG for', url, e);
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

export default async function EnNewsPage() {
  const newsItems = await getNewsItems();

  const externals = newsItems.filter((n) => (n.externalUrl ?? '').trim().length > 0);

  const ogResults = await Promise.all(
    externals.map(async (n) => {
      const ogImage = await fetchOgImage(n.externalUrl!);
      return [n.id, ogImage] as const;
    })
  );

  const ogMap = Object.fromEntries(ogResults) as Record<string, string | null>;

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1c7a9e] via-[#2596be] to-[#3db3d9] text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">NEWS</h1>
          <p className="text-lg text-white/90">The latest news from ABO Media</p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          {newsItems.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No news yet</h3>
              <p className="text-gray-600">We'll be sharing updates soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.map((news) => {
                const external = (news.externalUrl ?? '').trim().length > 0;
                const href = external ? news.externalUrl! : `/en/news/${news.slug}`;

                const rawOg = ogMap[news.id];
                const proxiedOg = rawOg ? `/api/img?url=${encodeURIComponent(rawOg)}` : null;
                const thumb = news.coverImage?.url || proxiedOg || null;

                const className =
                  'group bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:border-[#2596be]/30 hover:shadow-lg transition-all';

                const CardInner = (
                  <>
                    <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={news.title}
                          className="absolute inset-0 w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-xs text-gray-400">No Image</p>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <time className="block text-base font-semibold text-gray-600 mb-3">
                        {formatDate(news.publishedDate)}
                      </time>

                      <h2 className="text-lg font-bold text-gray-900 line-clamp-3 group-hover:text-[#2596be] transition-colors leading-relaxed">
                        {news.title}
                      </h2>
                    </div>
                  </>
                );

                return external ? (
                  <a
                    key={news.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {CardInner}
                  </a>
                ) : (
                  <Link key={news.id} href={href} className={className}>
                    {CardInner}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}