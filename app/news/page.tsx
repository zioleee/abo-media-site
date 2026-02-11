'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
const token = process.env.NEXT_PUBLIC_HYGRAPH_TOKEN;

if (!endpoint) console.warn('NEXT_PUBLIC_HYGRAPH_ENDPOINT is missing');

const client = new GraphQLClient(
  endpoint as string,
  token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
);

const QUERY = gql`
  query NewsList {
    newsItems(orderBy: publishedDate_DESC, first: 100) {
      id
      title
      slug
      externalUrl
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

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [ogMap, setOgMap] = useState<Record<string, string | null>>({});

  useEffect(() => {
    let alive = true;

    (async () => {
      const items = await getNewsItems();
      if (!alive) return;

      setNewsItems(items);
console.log("items externalUrl:", items.map(i => ({ id: i.id, title: i.title, externalUrl: i.externalUrl })));

      const externals = items.filter((n) => (n.externalUrl ?? '').trim().length > 0);
      if (externals.length === 0) return;

      const results = await Promise.all(
        externals.map(async (n) => {
          try {
            const res = await fetch(`/api/og?url=${encodeURIComponent(n.externalUrl!)}`);
            const json = await res.json();
            console.log("OG", n.externalUrl, json?.ogImage);
            return [n.id, (json?.ogImage as string) ?? null] as const;
          } catch {
            return [n.id, null] as const;
          }
        })
      );

      const next: Record<string, string | null> = {};
      results.forEach(([id, ogImage]) => (next[id] = ogImage));
      console.log("ogMap next:", next);

      if (alive) setOgMap(next);
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1c7a9e] via-[#2596be] to-[#3db3d9] text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">NEWS</h1>
          <p className="text-lg text-white/90">에이비오미디어의 최신 소식을 전해드립니다</p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          {newsItems.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">소식이 없습니다</h3>
              <p className="text-gray-600">곧 새로운 소식을 전해드리겠습니다</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.map((news) => {
                const external = (news.externalUrl ?? '').trim().length > 0;
                const href = external ? news.externalUrl! : `/news/${news.slug}`;
                const rawOg = ogMap[news.id];
const proxiedOg = rawOg ? `/api/img?url=${encodeURIComponent(rawOg)}` : null;

const thumb = news.coverImage?.url || proxiedOg || null;


                const className =
                  'group bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:border-[#2596be]/30 hover:shadow-lg transition-all';

                const CardInner = (
                  <>
                    {/* 이미지 */}
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

                    {/* 제목 */}
                    <div className="p-6">
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
