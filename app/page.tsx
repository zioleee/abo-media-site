'use client'

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { GraphQLClient, gql } from "graphql-request";

// ENV 가드
const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT ?? "";
const token = process.env.NEXT_PUBLIC_HYGRAPH_TOKEN ?? "";

const client = endpoint && token
  ? new GraphQLClient(endpoint, { headers: { Authorization: `Bearer ${token}` } })
  : null;

const ALL_WORKS = gql`
  query AllWorks {
    works(orderBy: year_DESC, first: 50) {
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
      client {          
        name
        website
        logo {
          url
          width
          height
        }
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

async function getAllWorks(): Promise<Work[]> {
  if (!client) return [];

  try {
    const data = await client.request<{ works: Work[] }>(ALL_WORKS);
    return data.works ?? [];
  } catch (error) {
    console.error('Failed to fetch works:', error);
    return [];
  }
}

// Hygraph 이미지 최적화 함수
function optimizeHygraphImage(url: string, width: number = 400): string {
  if (!url) return url;
  
  // Hygraph CDN URL인지 확인
  if (url.includes('hygraph.com') || url.includes('graphassets.com')) {
    // 이미 쿼리 파라미터가 있는지 확인
    const separator = url.includes('?') ? '&' : '?';
    // width, quality, format 파라미터 추가
    return `${url}${separator}w=${width}&q=80&fm=webp`;
  }
  
  return url;
}

// 2025 프로그램 데이터 - 1개만
const programs = [
  {
    id: 'nunan',
    title: '누난 내게 여자야',
    description: '나이 차이라는 현실의 벽을 넘어, 사랑 앞에 과감하고 솔직한 연상연하 남녀들의 도발적이고 진솔한 연애세포 재생 리얼리티',
    video: '/nunan-trailer.mp4'
  }
];

export default function Home() {
  const [allWorks, setAllWorks] = useState<Work[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Intersection Observer 상태
  const [aboutInView, setAboutInView] = useState(false);
  const [lineup2025InView, setLineup2025InView] = useState(false);
  const [youtubeInView, setYoutubeInView] = useState(false); // 배너 섹션용으로 재사용

  const aboutRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const comingSoonRef = useRef<HTMLElement>(null);
  const lineup2025Ref = useRef<HTMLElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const youtubeSecRef = useRef<HTMLElement>(null); // 배너 섹션용으로 재사용

  const works2025 = allWorks
    .filter(w => Number(w.year) === 2025)
    .sort((a, b) => {
      const aKey = a.client?.logo?.url ?? a.client?.name ?? "";
      const bKey = b.client?.logo?.url ?? b.client?.name ?? "";
      const keyCompare = aKey.localeCompare(bKey);
      if (keyCompare !== 0) return keyCompare;
      return a.title.localeCompare(b.title);
    });

  useEffect(() => {
    getAllWorks().then(setAllWorks);
    setIsVisible(true);

    const handleScroll = () => {
      if (!heroRef.current || !comingSoonRef.current) return;

      const HEADER_H = 80;
      const heroBottom = heroRef.current.offsetHeight;
      const scrolled = window.scrollY;
      const comingSoonTop = comingSoonRef.current.offsetTop;

      const transitionStart = heroBottom * 0.3;
      const transitionEnd = comingSoonTop - HEADER_H;
      const denom = Math.max(1, transitionEnd - transitionStart);

      if (scrolled < transitionStart) {
        setScrollProgress(0);
      } else if (scrolled > transitionEnd) {
        setScrollProgress(1);
      } else {
        const progress = (scrolled - transitionStart) / denom;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setAboutInView(true);
      });
    }, observerOptions);

    const lineup2025Observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setLineup2025InView(entry.isIntersecting);
      });
    }, observerOptions);

    const youtubeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setYoutubeInView(true); // 배너 섹션 애니메이션용
      });
    }, observerOptions);

    if (aboutRef.current) aboutObserver.observe(aboutRef.current);
    if (lineup2025Ref.current) lineup2025Observer.observe(lineup2025Ref.current);
    if (youtubeSecRef.current) youtubeObserver.observe(youtubeSecRef.current); // 배너 섹션

    return () => {
      window.removeEventListener('scroll', handleScroll);
      aboutObserver.disconnect();
      lineup2025Observer.disconnect();
      youtubeObserver.disconnect();
    };
  }, []);

  return (
    <main className="overflow-x-hidden">
      {/* HERO - 회사 소개 영상 */}
      <section
        ref={heroRef}
        className="relative overflow-hidden min-h-screen flex items-center justify-center"
        style={{
          opacity: 1 - scrollProgress * 0.5,
          transform: `scale(${1 - scrollProgress * 0.1})`,
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 size-full object-cover scale-105 opacity-90"
        >
          <source src="/ALPHA.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-[#1c7a9e]/12 via-[#2596be]/16 to-[#1c7a9e]/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(61,179,217,0.06),transparent_70%)]" />

        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10">
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
      </section>

      {/* 2025 프로그램 미리보기 */}
      <section
        ref={comingSoonRef}
        className="relative overflow-hidden min-h-screen flex items-center justify-center"
        style={{
          opacity: scrollProgress,
        }}
      >
        {/* 배경 영상 - 1개만 */}
        <video
          ref={videoRef1}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 size-full object-cover"
        >
          <source src={programs[0].video} type="video/mp4" />
        </video>

        {/* 어두운 오버레이 */}
        <div
          className="absolute inset-0 bg-black"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 1.5),
          }}
        />
        
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />

        {/* 프로그램 정보 */}
        <div
          className="absolute top-20 md:top-24 left-1/2 -translate-x-1/2 md:left-auto md:right-16 md:translate-x-0 w-[90%] md:w-auto max-w-md z-20 transition-all duration-700"
          style={{
            opacity: scrollProgress * 0.85,
          }}
        >
          <div className="bg-white/25 backdrop-blur-md rounded-2xl p-6 border border-white/30">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
              {programs[0].title}
            </h2>
            
            <p className="text-sm text-white/85 leading-relaxed line-clamp-4 font-medium">
              {programs[0].description}
            </p>
          </div>
        </div>

        {/* ABO Media 워터마크 */}
        <div
          className="absolute bottom-8 right-8 z-10"
          style={{
            opacity: scrollProgress,
          }}
        >
          <div className="text-right">
            <div className="text-white/90 text-sm font-medium mb-1 tracking-wide">
              ABO Media
            </div>
            <div className="text-white/60 text-xs tracking-wider">
              2025
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section ref={aboutRef} className="relative py-32 md:py-48 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,150,190,0.03),transparent_70%)]" />

        <div className="container-main relative max-w-4xl">
          <div
            className={`text-center space-y-8 transition-all duration-1000 ${aboutInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#2596be]/30" />
              <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#2596be]">
                About Us
              </span>
              <div className="h-px w-8 bg-[#2596be]/30" />
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.15] text-gray-900">
              이야기를 만들고<br />세상을 움직이는
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              예능·리얼리티·음악·디지털 콘텐츠 기획부터 제작·유통까지
            </p>

            <div className="pt-4">
              <span className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-[#2596be] to-[#3db3d9] bg-clip-text text-transparent">
                크리에이티브 콘텐츠 그룹
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 배너 섹션 - 지상렬 & 한그루 */}
      <section
        ref={youtubeSecRef}
        className="relative py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,150,190,0.03),transparent_70%)]" />
        
        <div className="container-main relative max-w-7xl">
          {/* 배너 섹션 타이틀 (2025 라인업 톤 통일) */}
<div className="text-center mb-8 md:mb-12">
  <div className="inline-flex items-center gap-3 mb-3">
    <div className="h-px w-8 bg-[#2596be]/30" />
    <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#2596be]">
      Digital Contents
    </span>
    <div className="h-px w-8 bg-[#2596be]/30" />
  </div>

  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
    디지털 콘텐츠
  </h2>

  <p className="text-gray-600 text-sm font-light">
    유튜브 오리지널부터 아티스트 채널까지, 에이비오미디어의 디지털 제작 라인업
  </p>
</div>

          <div className={`space-y-8 md:space-y-12 transition-all duration-1000 ${youtubeInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
            
            {/* 상단 배너 - 지상렬 대리점 */}
            <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
              <a 
                href="https://www.youtube.com/@Ji_Daeri" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src="/지상렬배너.png"
                  alt="지상렬 대리점 - 지상렬의 당황 디테일"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </a>
            </div>

            {/* 하단 배너 - 한그루 */}
            <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
              <a 
                href="https://www.youtube.com/@Han_Groo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src="/한그루배너.png"
                  alt="한그루 - 그루나까 말이야"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 2025 LINEUP */}
      <section
        ref={lineup2025Ref}
        className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-[#1c7a9e] via-[#2596be] to-[#3db3d9] z-20"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.08),transparent_50%)]" />
        </div>

        <div className="relative w-full max-w-none px-8 z-10">
          <div className={`text-center mb-8 transition-all duration-1000 ${lineup2025InView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}>
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-white/30" />
              <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/80">
                2025 Lineup
              </span>
              <div className="h-px w-8 bg-white/30" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              2025년 라인업
            </h2>
            <p className="text-white/70 text-sm font-light">
              올해 선보이는 에이비오미디어의 작품들
            </p>
          </div>

          {lineup2025InView && works2025.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
              {works2025.map((work, idx) => {
                const img = Array.isArray(work.coverImage) ? work.coverImage[0] : work.coverImage;
                const optimizedUrl = img?.url ? optimizeHygraphImage(img.url, 400) : null;
                const logoUrl = work.client?.logo?.url ? optimizeHygraphImage(work.client.logo.url, 80) : null;

                return (
                  <div
                    key={work.id}
                    className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer"
                    style={{
                      opacity: 0,
                      transform: 'translateX(-100px) rotate(-10deg)',
                      animation: `cardDeal 0.6s ease-out ${idx * 0.05}s forwards`,
                    }}
                  >
                    {optimizedUrl ? (
                      <img
                        src={optimizedUrl}
                        alt={work.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}

                    {logoUrl && (
                      <div className="absolute bottom-1.5 right-1.5 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-md p-1 shadow-sm">
                        <img
                          src={logoUrl}
                          alt={work.client?.name ?? ''}
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-[9px] text-white/70 mb-0.5">{work.category}</p>
                        <h3 className="text-[10px] font-bold text-white leading-tight line-clamp-2">
                          {work.title}
                        </h3>
                        {work.client?.name && (
                          <p className="text-[8px] text-white/60 mt-0.5 truncate">
                            {work.client.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="absolute inset-0 ring-1 ring-white/10 group-hover:ring-white/30 rounded-lg transition-all duration-300" />
                  </div>
                );
              })}
            </div>
          )}

          {lineup2025InView && works2025.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/70">2025년도 작품이 준비 중입니다</p>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/works"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#2596be] font-semibold rounded-full hover:bg-white/95 hover:shadow-2xl hover:scale-105 transition-all duration-500 shadow-xl group text-sm tracking-wide"
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

        <style jsx>{`
          @keyframes cardDeal {
            0% {
              opacity: 0;
              transform: translateX(-100px) rotate(-10deg) scale(0.8);
            }
            60% {
              opacity: 1;
              transform: translateX(10px) rotate(2deg) scale(1.05);
            }
            100% {
              opacity: 1;
              transform: translateX(0) rotate(0deg) scale(1);
            }
          }
        `}</style>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(37,150,190,0.03),transparent_70%)]" />

        <div className="relative container-main py-32 md:py-48 max-w-4xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#2596be]/30" />
              <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#2596be]">
                Contact
              </span>
              <div className="h-px w-8 bg-[#2596be]/30" />
            </div>

            <h3 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              함께 만들어갈<br className="md:hidden" /> 콘텐츠의 미래
            </h3>

            <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto font-light leading-relaxed">
              에이비오미디어와 협력하여 새로운 가치를 창조하세요
            </p>

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