// app/en/page.tsx
'use client'

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient(process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT as string, {
  headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_HYGRAPH_TOKEN}` },
});

const RECENT_WORKS = gql`
  query RecentWorks {
    works(orderBy: year_DESC, first: 12) {
      id
      title
      slug
      year
      category
      coverImage {
        url
        width
        height
      }
    }
  }
`;

type Asset = { url: string; width: number; height: number };
type Work = {
  id: string;
  title: string;
  slug: string;
  year: number;
  category: string;
  coverImage?: Asset | Asset[] | null;
};

async function getRecentWorks(): Promise<Work[]> {
  try {
    const data = await client.request<{ works: Work[] }>(RECENT_WORKS);
    return data.works ?? [];
  } catch {
    return [];
  }
}

export default function EnHome() {
  const [recentWorks, setRecentWorks] = useState<Work[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    getRecentWorks().then(setRecentWorks);
  }, []);

  const filledWorks = [...recentWorks];
  const remainder = filledWorks.length % 4;
  if (remainder !== 0) {
    const emptySlots = 4 - remainder;
    for (let i = 0; i < emptySlots; i++) {
      filledWorks.push({
        id: `empty-${i}`,
        title: '',
        slug: '',
        year: 0,
        category: '',
        coverImage: null
      });
    }
  }

  const totalPages = Math.ceil(filledWorks.length / 4);
  const currentWorks = filledWorks.slice(currentPage * 4, (currentPage + 1) * 4);

  return (
    <main>
      {/* HERO */}
      <section id="hero" className="relative overflow-hidden [contain:paint] min-h-screen flex items-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 size-full object-cover hero-static-overlay"
        >
          <source src="/ALPHA.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 hero-static-overlay bg-[linear-gradient(180deg,rgba(28,122,158,0.35)_0%,rgba(37,150,190,0.55)_60%,rgba(61,179,217,0.65)_100%)]" />
        <div className="absolute -right-24 -top-20 h-[28rem] w-[28rem] rounded-full blur-3xl hero-static-overlay bg-[#3db3d9]/25" />
        <div className="absolute -left-24 top-24 h-[22rem] w-[22rem] rounded-full blur-3xl hero-static-overlay bg-[#2596be]/20" />
        
        <div className="container-main relative z-10 w-full text-white">
          <span className="inline-block rounded-full bg-white/10 border border-white/20 px-3 py-1 text-sm animate-fade-in">
            Originality · Ability · Brilliant
          </span>

          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight animate-fade-in-delay-1">
            Connecting People and Markets<br className="hidden md:block" />
            through Content
          </h1>
          <p className="mt-4 max-w-3xl text-base md:text-lg text-white/85 leading-relaxed animate-fade-in-delay-2">
            ABO Media is a comprehensive media company specializing in planning and producing 
            entertainment, reality shows, and music content for broadcast and digital platforms, 
            expanding value through partnerships and distribution.
          </p>

          <div className="mt-12 animate-fade-in-delay-3">
            <div className="flex flex-col items-center gap-2 text-white/60">
              <span className="text-sm">Scroll</span>
              <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 md:py-24 bg-white">
        <div className="container-main text-center">
          <span className="inline-block px-3 py-1 rounded-full text-[12px] font-semibold tracking-wider bg-[#2596be]/10 text-[#2596be] border border-[#2596be]/30">
            ABO MEDIA
          </span>

          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight text-[#0A0F1A]">
            Creative Content Group<br className="hidden md:block" />
            Creating Stories, Moving the World
          </h2>

          <p className="mt-4 text-[15px] md:text-lg text-gray-600">
            Entertainment · Reality · Music · Digital — From Planning to Production and Distribution
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Originality", "Ability", "Brilliant"].map((k) => (
              <span
                key={k}
                className="px-3 py-1 rounded-full text-sm border border-gray-200 text-gray-700 bg-gray-50"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Works */}
      <section id="works" className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c7a9e] via-[#2596be] to-[#3db3d9]" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative container-main z-10">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider bg-white/20 text-white border border-white/30 uppercase mb-4">
              Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Works</h2>
          </div>

          <div className="grid grid-cols-4 gap-4 md:gap-6">
            {currentWorks.map((w) => {
              if (!w.title) {
                return (
                  <div
                    key={w.id}
                    className="overflow-hidden aspect-[2/3] bg-white/10 flex items-center justify-center text-white/50 rounded-xl border border-white/20"
                  >
                    No Image
                  </div>
                );
              }

              const img = Array.isArray(w.coverImage) ? w.coverImage[0] : w.coverImage;

              return (
                <div
                  key={w.id}
                  className="overflow-hidden group aspect-[2/3] cursor-pointer relative rounded-xl shadow-lg hover:shadow-2xl transition-all ring-1 ring-white/10 hover:ring-white/30"
                >
                  {img?.url ? (
                    <Image
                      src={img.url}
                      alt={w.title}
                      fill
                      sizes="25vw"
                      className="object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/10 text-white/50">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <div className="text-xs opacity-80">{w.year} · {w.category}</div>
                    <div className="font-bold mt-1">{w.title}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-center">
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition disabled:opacity-30 text-white backdrop-blur-sm"
                aria-label="Previous"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition disabled:opacity-30 text-white backdrop-blur-sm"
                aria-label="Next"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/en/works" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#2596be] font-semibold rounded-full hover:bg-white/95 transition shadow-lg"
            >
              View All Works
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="relative container-main py-16 md:py-20">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
            Contact & Partnership
          </h3>
          <p className="mt-2 text-center text-gray-600">
            Let's create the future of content together with ABO Media
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link 
              href="/en/contact" 
              className="btn btn-primary"
            >
              Contact Us
            </Link>
            <Link
              href="/en/ir"
              className="btn btn-ghost"
            >
              IR Information
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}