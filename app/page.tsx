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

// ===== YouTube 배너 데이터 (모바일 캐러셀 / 데스크탑 그리드 공통) =====
// href가 빈 문자열("")이면 링크 없이 이미지만 렌더링됩니다.
type YoutubeCard = { href: string; src: string; alt: string; objPos: string };

const YOUTUBE_CARDS: YoutubeCard[] = [
  { href: "https://www.youtube.com/@jung_eum", src: "/황정음배너.png", alt: "황정음", objPos: "object-top" },
  { href: "", src: "/한채아배너.png", alt: "한채아 - 채아뜰", objPos: "object-top" },
  { href: "https://www.youtube.com/@sookyung.yi_career", src: "/이수경배너.png", alt: "이수경 경력직", objPos: "object-top" },
  { href: "https://youtube.com/@guru_han_s2?si=Ke-cFE9bAnuukKwS", src: "/한그루배너.png", alt: "한그루 - 그루니까 말이야", objPos: "" },
  { href: "", src: "/헬로민영배너.png", alt: "헬로민영", objPos: "object-top" },
  { href: "https://www.youtube.com/@Ji_Daeri", src: "/지상렬배너.jpg", alt: "지상렬 대리점", objPos: "" },
];

// ===== 모바일 캐러셀 =====
function MobileCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startPos = useRef(0);

  const cards = [...YOUTUBE_CARDS, ...YOUTUBE_CARDS];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const SPEED = 1.5;

    const tick = () => {
      if (!isDragging.current) {
        const halfWidth = track.scrollWidth / 2;
        posRef.current += SPEED;
        if (posRef.current >= halfWidth) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    startPos.current = posRef.current;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = startX.current - e.touches[0].clientX;
    posRef.current = Math.max(0, startPos.current + delta);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
  };

  const onTouchEnd = () => {
    isDragging.current = false;
  };

  const cardClass =
    "relative w-[260px] aspect-[2/3] shrink-0 overflow-hidden rounded-2xl shadow-lg";

  return (
    <div
      className="md:hidden overflow-hidden select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        ref={trackRef}
        className="flex gap-3 px-4 will-change-transform"
        style={{ width: "max-content" }}
      >
        {cards.map((card, idx) => {
          const img = (
            <img
              src={card.src}
              alt={card.alt}
              draggable={false}
              className={`absolute inset-0 w-full h-full object-cover ${card.objPos}`}
            />
          );

          // href가 있으면 링크(<a>), 없으면 이미지만(<div>)
          return card.href ? (
            <a
              key={idx}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cardClass}
              onClick={(e) => {
                if (Math.abs(posRef.current - startPos.current) > 8) {
                  e.preventDefault();
                }
              }}
            >
              {img}
            </a>
          ) : (
            <div key={idx} className={cardClass}>
              {img}
            </div>
          );
        })}
      </div>
    </div>
  );
}
// ===== 모바일 캐러셀 끝 =====

// Hygraph 이미지 최적화 함수
function optimizeHygraphImage(url: string, width: number = 400): string {
  if (!url) return url;

  if (url.includes('hygraph.com') || url.includes('graphassets.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=80&fm=webp`;
  }

  return url;
}

export default function Home() {
  const [allWorks, setAllWorks] = useState<Work[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer 상태
  const [aboutInView, setAboutInView] = useState(false);
  const [lineup2025InView, setLineup2025InView] = useState(false);
  const [youtubeInView, setYoutubeInView] = useState(false);
  const [ctaInView, setCtaInView] = useState(false);

  const aboutRef = useRef<HTMLElement>(null);
  const lineup2025Ref = useRef<HTMLElement>(null);
  const youtubeSecRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const WORK_ORDER = [
  "yeonaejeonjaeng",            // 연애전쟁 - 맨 앞
  "yeolhyeolnonggudan2",        // 열혈농구단2 - 연애전쟁 바로 뒤
  "namgyeoseo-mwohage",
  "sagikkundeul",
  "beolgeobeoseun-segyesa25",
  "beolgeobeoseun-hanguksa2",
  "nunan-naege-yeojaya",
  "solloraseo-sijeun2",        // 6번째로 이동
  "ijen-saranghal-su-isseulkka25",
  "jalsaenggin-teurot",        // 8번째로 이동
  "neujgi-jeone-eohagyeonsu-syallasyalla",
  "hankkihapsyo",
  "oraedoen-mannam-chugu-1gi",
  "yubyeolnan-yeoksa-han-kki",
  "baedarwasssuda",
  "naepyeonhaja4",
  "ijanguui-duyunojipbap",
  "1ho-ga-doel-sun-eopseo-2",
];

const works2025 = allWorks
  .filter(w =>
    (Number(w.year) === 2025 || Number(w.year) === 2026) &&
    w.slug !== "baeckupjjari-achimsiksa" &&
    w.slug !== "beolgeobeoseun-segyesa26" &&
    w.slug !== "namgyeoseo-mwohage26"
  )
  .sort((a, b) => {
    const ai = WORK_ORDER.indexOf(a.slug);
    const bi = WORK_ORDER.indexOf(b.slug);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  useEffect(() => {
    getAllWorks().then(setAllWorks);
    setIsVisible(true);

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
        setYoutubeInView(entry.isIntersecting);
      });
    }, observerOptions);

    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setCtaInView(true);
      });
    }, observerOptions);

    if (aboutRef.current) aboutObserver.observe(aboutRef.current);
    if (lineup2025Ref.current) lineup2025Observer.observe(lineup2025Ref.current);
    if (youtubeSecRef.current) youtubeObserver.observe(youtubeSecRef.current);
    if (ctaRef.current) ctaObserver.observe(ctaRef.current);

    return () => {
      aboutObserver.disconnect();
      lineup2025Observer.disconnect();
      youtubeObserver.disconnect();
      ctaObserver.disconnect();
    };
  }, []);

  return (
<main className="overflow-x-hidden pt-20 md:pt-0">      {/* HERO - 회사 소개 영상 */}
      {/* HERO - 회사 소개 영상 */}
<section className="relative overflow-hidden bg-white md:min-h-screen md:flex md:items-center md:justify-center md:bg-black">
  <video
    autoPlay
    loop
    muted
    playsInline
    className="relative block w-full h-auto object-contain opacity-90 md:absolute md:inset-0 md:size-full md:object-cover md:scale-105 md:translate-y-8"
  >
    <source src="/ABO_introduce.mp4" type="video/mp4" />
  </video>

  <div className="hidden md:block absolute bottom-32 left-1/2 -translate-x-1/2 z-10">
    <div
      className="flex flex-col items-center gap-2 text-white/50 animate-bounce"
      style={{ animationDuration: "2s" }}
    >
      <span className="text-[10px] font-light tracking-[0.2em] uppercase">
        Scroll
      </span>
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  </div>
</section>

      {/* About */}
      <section ref={aboutRef} className="relative pt-24 pb-40 md:py-56 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,150,190,0.03),transparent_70%)]" />

        <div className="container-main relative max-w-4xl">
          <div className="text-center space-y-12">
            <div
              className={`inline-flex items-center gap-3 mb-4 transition-all duration-700 ease-out ${aboutInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "0ms" }}
            >
              <div className="h-px w-8 bg-[#2596be]/30" />
              <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#2596be]">
                About Us
              </span>
              <div className="h-px w-8 bg-[#2596be]/30" />
            </div>

            <h2
              className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.15] text-gray-900 transition-all duration-700 ease-out ${aboutInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "150ms" }}
            >
              이야기를 만들고<br />세상을 움직이는
            </h2>

            <p
              className={`text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light transition-all duration-700 ease-out ${aboutInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "300ms" }}
            >
              예능·리얼리티·음악·디지털 콘텐츠 기획부터 제작·유통까지
            </p>

            <div
              className={`pt-4 transition-all duration-700 ease-out ${aboutInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "450ms" }}
            >
              <span className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-[#2596be] to-[#3db3d9] bg-clip-text text-transparent">
                크리에이티브 콘텐츠 그룹
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 배너 섹션 - YouTube Originals */}
<section
  ref={youtubeSecRef}
  className="relative pt-20 pb-36 md:pt-32 md:pb-48 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,150,190,0.03),transparent_70%)]" />

  <div className="relative">
    <div className="text-center mb-8 md:mb-12 px-4">
      <div className="inline-flex items-center gap-3 mb-3">
        <div className="h-px w-8 bg-[#2596be]/30" />
        <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#2596be]">
          Digital Contents
        </span>
        <div className="h-px w-8 bg-[#2596be]/30" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        YouTube Originals
      </h2>
      <p className="text-gray-600 text-sm font-light">
        유튜브 오리지널부터 아티스트 채널까지, 에이비오미디어의 디지털 제작 라인업
      </p>
    </div>

    {/* 모바일: 자동스크롤 + 스와이프 */}
    <MobileCarousel />

    {/* 데스크탑: 6열 그리드 (lg 미만은 3열 2줄) */}
    <div className="hidden md:block mx-auto max-w-[96%] px-4">
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
        {YOUTUBE_CARDS.map((card, idx) => {
          const inner = (
            <>
              <img
                src={card.src}
                alt={card.alt}
                className={`absolute inset-0 w-full h-full object-cover ${card.objPos} group-hover:scale-105 transition-transform duration-700`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            </>
          );

          return (
            <div
              key={card.src}
              className={`group relative aspect-[2/3] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ${card.href ? "cursor-pointer" : ""} ${youtubeInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              {card.href ? (
                <a href={card.href} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  {inner}
                </a>
              ) : (
                <div className="block w-full h-full">{inner}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  </div>
</section>

      {/* 2026 LINEUP */}
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
                2026 Lineup
              </span>
              <div className="h-px w-8 bg-white/30" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              TV · OTT
            </h2>
            <p className="text-white/70 text-sm font-light">
              올해 선보이는 에이비오미디어의 작품들
            </p>
          </div>

          <div
            className={[
              "transition-all duration-700",
              lineup2025InView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none",
            ].join(" ")}
          >
            {works2025.length > 0 ? (
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
                        transform: "translateX(-100px) rotate(-10deg)",
                        animation: lineup2025InView
                          ? `cardDeal 0.6s ease-out ${idx * 0.05}s forwards`
                          : "none",
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
                        <div className="absolute bottom-1.5 right-1.5 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-md p-1 shadow-sm hidden md:block">
                          <img
                            src={logoUrl}
                            alt={work.client?.name ?? ""}
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
            ) : (
              <div className="text-center py-12">
                <p className="text-white/70">2025년도 작품이 준비 중입니다</p>
              </div>
            )}
          </div>

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
      <section ref={ctaRef} className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(37,150,190,0.03),transparent_70%)]" />

        <div className="relative container-main py-32 md:py-48 max-w-4xl">
          <div className="text-center space-y-8">
            <div
              className={`inline-flex items-center gap-3 mb-6 transition-all duration-700 ease-out ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "0ms" }}
            >
              <div className="h-px w-8 bg-[#2596be]/30" />
              <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#2596be]">
                Contact
              </span>
              <div className="h-px w-8 bg-[#2596be]/30" />
            </div>

            <h3
              className={`text-4xl md:text-6xl font-bold text-gray-900 leading-tight transition-all duration-700 ease-out ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "150ms" }}
            >
              함께 만들어갈<br className="md:hidden" /> 콘텐츠의 미래
            </h3>

            <p
              className={`text-base md:text-lg text-gray-600 max-w-xl mx-auto font-light leading-relaxed transition-all duration-700 ease-out ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "300ms" }}
            >
              에이비오미디어와 협력하여 새로운 가치를 창조하세요
            </p>

            <div
              className={`flex flex-col sm:flex-row justify-center gap-4 pt-8 transition-all duration-700 ease-out ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "450ms" }}
            >
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