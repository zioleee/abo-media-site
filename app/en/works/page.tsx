// app/en/works/page.tsx
'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient(process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT as string, {
  headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_HYGRAPH_TOKEN}` },
});

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
    const data = await client.request<{ works: Work[] }>(QUERY);
    return data.works ?? [];
  } catch {
    return [];
  }
}

export default function WorksPageEN() {
  const [works, setWorks] = useState<Work[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("All");

  useEffect(() => {
    getWorks().then(setWorks);
  }, []);

  // 연도 목록 추출
  const years = ["All", ...Array.from(new Set(works.map(w => w.year.toString()))).sort((a, b) => Number(b) - Number(a))];

  // 필터링 (연도만)
  const filteredWorks = works.filter(w => {
    const yearMatch = selectedYear === "All" || w.year.toString() === selectedYear;
    return yearMatch;
  });

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1c7a9e] via-[#2596be] to-[#3db3d9] text-white py-20">
        <div className="container-main">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">WORKS</h1>
              <p className="text-lg text-white/90">
                Introducing ABO Media's Productions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section (연도만 남김) */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container-main">
          {/* 연도 필터 */}
          <div className="max-w-4xl">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Year</label>
            <div className="flex flex-wrap gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${selectedYear === year
                      ? 'bg-[#2596be] text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-[#2596be]/50'
                    }
                  `}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Works Grid */}
      <section className="py-16 md:py-20">
        <div className="container-main">
          {filteredWorks.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No works found</h3>
              <p className="text-gray-600">Please select a different year</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredWorks.map((w) => {
                const img = Array.isArray(w.coverImage) ? w.coverImage[0] : w.coverImage;

                return (
                  <div
                    key={w.id}
                    className="group bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:border-[#2596be]/30 hover:shadow-brand transition-all"
                  >
                    {/* 이미지 영역 */}
                    <div className="relative aspect-[2/3] bg-gray-100 overflow-hidden">
                      {img?.url ? (
                        <Image
                          src={img.url}
                          alt={w.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-xs text-gray-400">No Image</p>
                          </div>
                        </div>
                      )}

                      {/* 연도/카테고리 배지 */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                        <span className="px-2 py-1 rounded-md text-xs font-semibold bg-white/90 text-gray-900 backdrop-blur-sm">
                          {w.year}
                        </span>
                        <span className="px-2 py-1 rounded-md text-xs font-semibold bg-[#2596be]/90 text-white backdrop-blur-sm">
                          {w.category}
                        </span>
                      </div>
                    </div>

                    {/* 정보 영역 */}
                    <div className="p-4">
                      <h2 className="font-bold text-gray-900 line-clamp-2 mb-2 min-h-[3rem]">
                        {w.title}
                      </h2>

                      {/* 클라이언트 정보 */}
                      {w.client?.name && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            {w.client.logo?.url && (
                              <div className="relative w-6 h-6 flex-shrink-0">
                                <Image
                                  src={w.client.logo.url}
                                  alt={w.client.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            )}
                            <span className="text-sm text-gray-600 truncate">
                              {w.client.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}