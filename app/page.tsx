// app/page.tsx
'use client'

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient(process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT as string, {
  headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_HYGRAPH_TOKEN}` },
});

const RECENT_WORKS = gql`
  query RecentWorks {
    works(orderBy: year_DESC, first: 8) {
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

export default function Home() {
  const [recentWorks, setRecentWorks] = useState<Work[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const worksRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const [worksInView, setWorksInView] = useState(false);
  const [aboutInView, setAboutInView] = useState(false);

  useEffect(() => {
    getRecentWorks().then(setRecentWorks);
    setIsVisible(true);

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const worksObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setWorksInView(true);
        }
      });
    }, observerOptions);

    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setAboutInView(true);
        }
      });
    }, observerOptions);

    if (worksRef.current) worksObserver.observe(worksRef.current);
    if (aboutRef.current) aboutObserver.observe(aboutRef.current);

    return () => {
      worksObserver.disconnect();
      aboutObserver.disconnect();
    };
  }, []);

  return (
    <main className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 size-full object-cover scale-105 opacity-90"
        >
          <source src="/ALPHA.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-[#1c7a9e]/30 via-[#2596be]/40 to-[#1c7a9e]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(61,179,217,0.15),transparent_70%)]" />

        <div
          className={`relative z-10 w-full max-w-5xl mx-auto px-8 text-center text-white transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* 상단 라벨 */}
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-white/40" />
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-white/80">
              ABO Media
            </span>
            <div className="h-px w-12 bg-white/40" />
          </div>

          {/* 메인 타이틀 */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8">
            콘텐츠로 사람과<br />시장을 연결합니다
          </h1>

          {/* 설명 */}
          <p className="max-w-2xl mx-auto text-base md:text-lg text-white/75 leading-relaxed mb-16 font-light">
            예능·리얼리티·음악 등 방송/디지털 콘텐츠를 기획·제작하고,<br className="hidden md:block" />
            파트너십과 유통을 통해 가치를 확장하는 종합 미디어 기업입니다
          </p>

          {/* 키워드 배지 */}
          <div className="flex flex-wrap justify-center gap-2 text-xs tracking-wider">
            {[ "Ability","Originality", "Brilliant"].map((word, idx) => (
              <span
                key={word}
                className="px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm bg-white/5 text-white/90 transition-all duration-300 hover:bg-white/10 hover:border-white/40"
                style={{
                  animationDelay: `${idx * 0.15 + 0.5}s`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(10px)",
                  transition: `all ${0.6 + idx * 0.1}s ease-out`,
                }}
              >
                {word}
              </span>
            ))}
          </div>

          {/* 스크롤 인디케이터 */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
            <div
              className="flex flex-col items-center gap-2 text-white/50 animate-bounce"
              style={{ animationDuration: "2s" }}
            >
              <span className="text-[10px] font-light tracking-[0.2em] uppercase">Scroll</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section ref={aboutRef} className="relative py-32 md:py-48 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,150,190,0.03),transparent_70%)]" />

        <div className="container-main relative max-w-4xl">
          <div
            className={`text-center space-y-8 transition-all duration-1000 ${
              aboutInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
          >
            {/* 상단 라벨 */}
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#2596be]/30" />
              <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#2596be]">
                About Us
              </span>
              <div className="h-px w-8 bg-[#2596be]/30" />
            </div>

            {/* 메인 타이틀 */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.15] text-gray-900">
              이야기를 만들고<br />세상을 움직이는
            </h2>

            {/* 설명 */}
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              예능·리얼리티·음악·디지털 콘텐츠 기획부터 제작·유통까지
            </p>

            {/* 크리에이티브 콘텐츠 그룹 */}
            <div className="pt-4">
              <span className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-[#2596be] to-[#3db3d9] bg-clip-text text-transparent">
                크리에이티브 콘텐츠 그룹
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Works */}
      <section
        ref={worksRef}
        className="relative py-32 md:py-48 overflow-hidden bg-gradient-to-br from-[#1c7a9e] via-[#2596be] to-[#3db3d9]"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.08),transparent_50%)]" />
        </div>

        <div className="relative container-main max-w-7xl z-10">
          {/* 타이틀 섹션 */}
          <div
            className={`text-center mb-20 transition-all duration-1000 ${
              worksInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-white/30" />
              <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/80">
                Portfolio
              </span>
              <div className="h-px w-8 bg-white/30" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">Recent Works</h2>
            <p className="text-white/70 text-base font-light">최근 작업한 프로젝트를 만나보세요</p>
          </div>

          {/* Works 그리드 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
            {recentWorks.slice(0, 8).map((work, idx) => {
              const img = Array.isArray(work.coverImage) ? work.coverImage[0] : work.coverImage;

              return (
                <div
                  key={work.id}
                  className="group relative aspect-[3/4] overflow-hidden rounded-xl transition-all duration-700 hover:scale-[1.02] cursor-pointer"
                  style={{
                    animationDelay: `${idx * 0.08}s`,
                    opacity: worksInView ? 1 : 0,
                    transform: worksInView ? "translateY(0)" : "translateY(30px)",
                    transition: `all ${0.6 + idx * 0.05}s cubic-bezier(0.4, 0, 0.2, 1)`,
                  }}
                >
                  {/* 이미지 */}
                  {img?.url ? (
                    <Image
                      src={img.url}
                      alt={work.title}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover transition-all duration-700 group-hover:scale-110 brightness-95 group-hover:brightness-100"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm text-white/50 text-sm">
                      No Image
                    </div>
                  )}

                  {/* 호버 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* 정보 */}
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="text-[10px] font-medium text-white/60 mb-2 uppercase tracking-widest">
                      {work.year} · {work.category}
                    </div>
                    <div className="font-bold text-base leading-tight">{work.title}</div>
                  </div>

                  {/* 테두리 */}
                  <div className="absolute inset-0 ring-1 ring-white/10 group-hover:ring-white/30 rounded-xl transition-all duration-500" />
                </div>
              );
            })}
          </div>

          {/* 전체 보기 버튼 */}
          <div className="mt-20 text-center">
            <Link
              href="/works"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#2596be] font-semibold rounded-full hover:bg-white/95 hover:shadow-2xl hover:scale-105 transition-all duration-500 shadow-xl group text-sm tracking-wide"
            >
              전체 작품 보기
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(37,150,190,0.03),transparent_70%)]" />

        <div className="relative container-main py-32 md:py-48 max-w-4xl">
          <div className="text-center space-y-8">
            {/* 상단 라벨 */}
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#2596be]/30" />
              <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#2596be]">
                Contact
              </span>
              <div className="h-px w-8 bg-[#2596be]/30" />
            </div>

            {/* 타이틀 */}
            <h3 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              함께 만들어갈<br className="md:hidden" /> 콘텐츠의 미래
            </h3>

            {/* 설명 */}
            <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto font-light leading-relaxed">
              에이비오미디어와 협력하여 새로운 가치를 창조하세요
            </p>

            {/* 버튼 */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-[#2596be] to-[#3db3d9] text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-500 shadow-lg group text-sm tracking-wide"
              >
                문의하기
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/ir"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-gray-900 font-semibold rounded-full border-2 border-gray-200 hover:border-[#2596be]/50 hover:shadow-lg hover:scale-105 transition-all duration-500 text-sm tracking-wide"
              >
                IR 정보 보기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
