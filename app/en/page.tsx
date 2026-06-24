// app/en/page.tsx
'use client'

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { GraphQLClient, gql } from "graphql-request";

// ENV Guard
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

// ===== Mobile Carousel =====
const YOUTUBE_CARDS = [
  { href: "https://www.youtube.com/@sookyung.yi_career", src: "/이수경배너.png", alt: "Lee Sookyung", objPos: "object-top" },
  { href: "https://www.youtube.com/@알바_정", src: "/정성호배너.png", alt: "Jung Sung-ho's Employment Agency", objPos: "" },
  { href: "https://www.youtube.com/@Ji_Daeri", src: "/지상렬배너.jpg", alt: "Ji Sang-ryul Agency", objPos: "" },
  { href: "https://youtube.com/@guru_han_s2?si=Ke-cFE9bAnuukKwS", src: "/한그루배너.png", alt: "Han Gru - Because It's Gru", objPos: "" },
];

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
        {cards.map((card, idx) => (
          <a
            key={idx}
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-[220px] aspect-[2/3] shrink-0 overflow-hidden rounded-2xl shadow-lg"
            onClick={(e) => {
              if (Math.abs(posRef.current - startPos.current) > 8) {
                e.preventDefault();
              }
            }}
          >
            <img
              src={card.src}
              alt={card.alt}
              draggable={false}
              className={`absolute inset-0 w-full h-full object-cover ${card.objPos}`}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
// ===== Mobile Carousel End =====

// Hygraph image optimization
function optimizeHygraphImage(url: string, width: number = 400): string {
  if (!url) return url;
  if (url.includes('hygraph.com') || url.includes('graphassets.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=80&fm=webp`;
  }
  return url;
}

export default function EnHome() {
  const [allWorks, setAllWorks] = useState<Work[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer states
  const [aboutInView, setAboutInView] = useState(false);
  const [lineup2025InView, setLineup2025InView] = useState(false);
  const [youtubeInView, setYoutubeInView] = useState(false);

  const aboutRef = useRef<HTMLElement>(null);
  const lineup2025Ref = useRef<HTMLElement>(null);
  const youtubeSecRef = useRef<HTMLElement>(null);

  const WORK_ORDER = [
    "namgyeoseo-mwohage",
    "sagikkundeul",
    "beolgeobeoseun-segyesa25",
    "beolgeobeoseun-hanguksa2",
    "nunan-naege-yeojaya",
    "solloraseo-sijeun2",
    "ijen-saranghal-su-isseulkka25",
    "jalsaenggin-teurot",
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

    if (aboutRef.current) aboutObserver.observe(aboutRef.current);
    if (lineup2025Ref.current) lineup2025Observer.observe(lineup2025Ref.current);
    if (youtubeSecRef.current) youtubeObserver.observe(youtubeSecRef.current);

    return () => {
      aboutObserver.disconnect();
      lineup2025Observer.disconnect();
      youtubeObserver.disconnect();
    };
  }, []);

  return (
    <main className="overflow-x-hidden">
      {/* HERO - Company Introduction Video */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
className="absolute inset-0 size-full object-contain md:object-cover md:scale-105 opacity-90"        >
<source src="/ABO_introduce.mp4" type="video/mp4" />        </video>


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
              Creating Stories,<br />Moving the World
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              From planning to production and distribution of entertainment, reality, music, and digital content
            </p>

            <div className="pt-4">
              <span className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-[#2596be] to-[#3db3d9] bg-clip-text text-transparent">
                Creative Content Group
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Section - YouTube Originals */}
      <section
        ref={youtubeSecRef}
        className="relative py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
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
              From YouTube originals to artist channels — ABO Media's digital content lineup
            </p>
          </div>

          {/* Mobile: auto-scroll + swipe */}
          <MobileCarousel />

          {/* Desktop: 4-column grid */}
          <div className="hidden md:block mx-auto max-w-[92%] px-4">
            <div className="grid grid-cols-4 gap-4">

              {/* Lee Sookyung */}
              <div className={`group relative aspect-[2/3] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${youtubeInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: '0ms' }}>
                <a href="https://www.youtube.com/@sookyung.yi_career" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  <img src="/이수경배너.png" alt="Lee Sookyung"
                    className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                </a>
              </div>

              {/* Jung Sung-ho */}
              <div className={`group relative aspect-[2/3] overflow-hidden rounded-2xl shadow-lg transition-all duration-500 ${youtubeInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: '100ms' }}>
                <a href="https://www.youtube.com/@알바_정" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  <img src="/정성호배너.png" alt="Jung Sung-ho's Employment Agency"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                </a>
              </div>

              {/* Ji Sang-ryul */}
              <div className={`group relative aspect-[2/3] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${youtubeInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: '200ms' }}>
                <a href="https://www.youtube.com/@Ji_Daeri" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  <img src="/지상렬배너.jpg" alt="Ji Sang-ryul Agency"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                </a>
              </div>

              {/* Han Gru */}
              <div className={`group relative aspect-[2/3] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${youtubeInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: '300ms' }}>
                <a href="https://youtube.com/@guru_han_s2?si=Ke-cFE9bAnuukKwS" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  <img src="/한그루배너.png" alt="Han Gru - Because It's Gru"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                </a>
              </div>

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
              TV · OTT
            </h2>
            <p className="text-white/70 text-sm font-light">
              ABO Media's works launching this year
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
                <p className="text-white/70">2025 works coming soon</p>
              </div>
            )}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/en/works"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#2596be] font-semibold rounded-full hover:bg-white/95 hover:shadow-2xl hover:scale-105 transition-all duration-500 shadow-xl group text-sm tracking-wide"
            >
              View All Works
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
              The Future of Content<br className="md:hidden" /> We'll Create Together
            </h3>

            <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto font-light leading-relaxed">
              Create new value through collaboration with ABO Media
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              <Link
                href="/en/contact"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-[#2596be] to-[#3db3d9] text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-500 shadow-lg group text-sm tracking-wide"
              >
                Contact Us
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
                href="/en/ir"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-gray-900 font-semibold rounded-full border-2 border-gray-200 hover:border-[#2596be]/50 hover:shadow-lg hover:scale-105 transition-all duration-500 text-sm tracking-wide"
              >
                IR Information
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}