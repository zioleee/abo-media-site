// app/page.tsx - 최종 버전: 2개 프로그램 인터랙티브 미리보기
'use client'

import Link from "next/link";
import Image from "next/image";
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

// 2025 프로그램 데이터
const programs = [
  {
    id: 'hankki',
    title: '밥 해드립니다 한끼합쇼',
    description: '이웃 간의 정이 허물어진 요즘, 따뜻한 밥상을 준비해 찾아온 <한끼합쇼>! 대한민국 최고 셰프들이 평범한 가정 속 음식 창고를 탈탈 털어 만든 \'선물 같은 한끼\'를 함께하는 프로그램',
    video: '/trailer-preview.mp4'
  },
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
  
  // 프로그램 미리보기 상태
  const [activeProgram, setActiveProgram] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // 유튜브 영상 상태
  const [isYouTubePlaying, setIsYouTubePlaying] = useState(true);
  const [showYouTubePlayButton, setShowYouTubePlayButton] = useState(false);
  const [youtubePlayer, setYoutubePlayer] = useState<any>(null);

  const aboutRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const comingSoonRef = useRef<HTMLElement>(null);
  const lineup2025Ref = useRef<HTMLElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const youtubeRef = useRef<HTMLDivElement>(null);
  const youtubeSecRef = useRef<HTMLElement>(null);

  const [aboutInView, setAboutInView] = useState(false);
  const [lineup2025InView, setLineup2025InView] = useState(false);
  const [youtubeInView, setYoutubeInView] = useState(false);

const works2025 = allWorks
  .filter(w => Number(w.year) === 2025)
  .sort((a, b) => {
    // 1) 같은 로고끼리 묶기 기준 (로고 url 우선, 없으면 client name, 없으면 "")
    const aKey = a.client?.logo?.url ?? a.client?.name ?? "";
    const bKey = b.client?.logo?.url ?? b.client?.name ?? "";

    // 2) 로고/클라이언트 기준으로 먼저 정렬
    const keyCompare = aKey.localeCompare(bKey);
    if (keyCompare !== 0) return keyCompare;

    // 3) 같은 로고 그룹 안에서는 제목(혹은 원하는 기준)으로 정렬
    return a.title.localeCompare(b.title);
  });

  // 프로그램 hover 핸들러
  const handleProgramHover = (index: number) => {
    setActiveProgram(index);
    setIsHovering(true);
    
    // 이전 비디오 정지
    const prevVideo = index === 0 ? videoRef2.current : videoRef1.current;
    const currentVideo = index === 0 ? videoRef1.current : videoRef2.current;
    
    if (prevVideo) prevVideo.pause();
    if (currentVideo) currentVideo.play();
  };

  const handleProgramLeave = () => {
    setIsHovering(false);
  };

  // 유튜브 영상 재생/일시정지 토글
  const toggleYouTubeVideo = () => {
    if (youtubePlayer) {
      if (isYouTubePlaying) {
        youtubePlayer.pauseVideo();
        setIsYouTubePlaying(false);
        setShowYouTubePlayButton(true);
      } else {
        youtubePlayer.playVideo();
        setIsYouTubePlaying(true);
        setShowYouTubePlayButton(false);
      }
    }
  };

  // 유튜브 마우스 이동 시 재생 버튼 숨기기
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      if (!isYouTubePlaying) {
        setShowYouTubePlayButton(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setShowYouTubePlayButton(false);
        }, 3000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isYouTubePlaying]);

 // YouTube iframe API 로드 + (KOR/ENG 라우팅 이동 후에도 재생되게)
useEffect(() => {
  const PLAYER_ID = "youtube-player";
  const SCRIPT_ID = "yt-iframe-api";

  let playerInstance: any = null;

  const initPlayer = () => {
    // YT 준비 안 됐으면 종료
    if (!(window as any).YT?.Player) return;

    playerInstance = new (window as any).YT.Player(PLAYER_ID, {
      videoId: "Kgvnxaj0cGk",
      playerVars: {
        autoplay: 1,
        mute: 1,
        loop: 1,
        playlist: "Kgvnxaj0cGk",
        controls: 0,
        showinfo: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onReady: (event: any) => {
          setYoutubePlayer(event.target);

          // 라우팅 직후 검정 화면 방지용 보험
          try {
            event.target.mute();
            event.target.playVideo();
          } catch {}
        },
        onStateChange: (event: any) => {
          if (event.data === 0) event.target.playVideo();
        },
      },
    });
  };

  // 1) 이미 API 로드되어 있으면 바로 플레이어 생성
  if ((window as any).YT?.Player) {
    initPlayer();
    return () => {
      try { playerInstance?.destroy(); } catch {}
      setYoutubePlayer(null);
    };
  }

  // 2) 아직 로드 전이면: ready 콜백 지정
  (window as any).onYouTubeIframeAPIReady = () => {
    initPlayer();
  };

  // 3) 스크립트 중복 삽입 방지
  if (!document.getElementById(SCRIPT_ID)) {
    const tag = document.createElement("script");
    tag.id = SCRIPT_ID;
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  } else {
    // 스크립트는 있는데 YT가 아직 안 생긴 경우 대비
    const t = setInterval(() => {
      if ((window as any).YT?.Player) {
        clearInterval(t);
        initPlayer();
      }
    }, 50);

    return () => {
      clearInterval(t);
      try { playerInstance?.destroy(); } catch {}
      setYoutubePlayer(null);
    };
  }

  // cleanup
  return () => {
    try { playerInstance?.destroy(); } catch {}
    setYoutubePlayer(null);
  };
}, []);


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
        if (entry.isIntersecting) setLineup2025InView(true);
      });
    }, observerOptions);

    const youtubeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setYoutubeInView(true);
      });
    }, observerOptions);

    if (aboutRef.current) aboutObserver.observe(aboutRef.current);
    if (lineup2025Ref.current) lineup2025Observer.observe(lineup2025Ref.current);
    if (youtubeSecRef.current) youtubeObserver.observe(youtubeSecRef.current);

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

        <div className="absolute inset-0 bg-gradient-to-b from-[#1c7a9e]/30 via-[#2596be]/40 to-[#1c7a9e]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(61,179,217,0.15),transparent_70%)]" />

        <div
          className={`relative z-10 w-full max-w-5xl mx-auto px-8 text-center text-white transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        >
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-white/40" />
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-white/80">
              ABO Media
            </span>
            <div className="h-px w-12 bg-white/40" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8">
            콘텐츠로 사람과<br />시장을 연결합니다
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-white/75 leading-relaxed mb-16 font-light">
            예능·리얼리티·음악 등 방송/디지털 콘텐츠를 기획·제작하고,<br className="hidden md:block" />
            파트너십과 유통을 통해 가치를 확장하는 종합 미디어 기업입니다
          </p>

          <div className="flex flex-wrap justify-center gap-2 text-xs tracking-wider">
            {["Ability", "Originality", "Brilliant"].map((word, idx) => (
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

      {/* 2025 프로그램 미리보기 - 인터랙티브 */}
      <section
        ref={comingSoonRef}
        className="relative overflow-hidden min-h-screen flex items-center justify-center"
        style={{
          opacity: scrollProgress,
        }}
      >
        {/* 배경 영상들 */}
        <div className="absolute inset-0">
          {programs.map((program, idx) => (
            <video
              key={program.id}
              ref={idx === 0 ? videoRef1 : videoRef2}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 size-full object-cover transition-opacity duration-700"
              style={{
                opacity: activeProgram === idx ? 1 : 0,
              }}
            >
              <source src={program.video} type="video/mp4" />
            </video>
          ))}
        </div>

        {/* 어두운 오버레이 */}
        <div
          className="absolute inset-0 bg-black"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 1.5),
          }}
        />
        
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />

        {/* 프로그램 정보 (우측 상단) */}
        <div
          className="absolute top-24 right-8 md:right-16 max-w-md z-20 transition-all duration-700"
          style={{
            opacity: scrollProgress * (isHovering ? 1 : 0.7),
          }}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-px w-6 bg-white/40" />
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/80">
                2025 
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
              {programs[activeProgram].title}
            </h2>
            
            <p className="text-sm text-white/70 leading-relaxed line-clamp-4">
              {programs[activeProgram].description}
            </p>
          </div>
        </div>

        {/* 프로그램 선택 리스트 (좌측 하단) */}
        <div
          className="absolute bottom-24 left-8 md:left-16 z-20 space-y-3"
          style={{
            opacity: scrollProgress,
          }}
        >
          <div className="mb-4">
            
            <div className="h-px w-full bg-gradient-to-r from-white/40 to-transparent" />
          </div>

          {programs.map((program, idx) => (
            <div
              key={program.id}
              className={`cursor-pointer transition-all duration-300 ${
                activeProgram === idx 
                  ? 'translate-x-2' 
                  : 'translate-x-0 hover:translate-x-1'
              }`}
              onMouseEnter={() => handleProgramHover(idx)}
              onMouseLeave={handleProgramLeave}
            >
              <div className={`flex items-center gap-3 transition-all duration-300 ${
                activeProgram === idx
                  ? 'text-white'
                  : 'text-white/60 hover:text-white/90'
              }`}>
                <div className={`w-1 h-8 rounded-full transition-all duration-300 ${
                  activeProgram === idx
                    ? 'bg-white'
                    : 'bg-white/30'
                }`} />
                <div>
                  <div className="text-sm font-semibold leading-tight">
                    {program.title}
                  </div>
                  <div className="text-[10px] text-white/50 mt-0.5">
                    {idx === 0 ? '예능' : '리얼리티'}
                  </div>
                </div>
              </div>
            </div>
          ))}
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

        {/* 스크롤 인디케이터 */}
        <div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
          style={{
            opacity: scrollProgress,
          }}
        >
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

      {/* 2025 LINEUP */}
      <section
        ref={lineup2025Ref}
        className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-[#1c7a9e] via-[#2596be] to-[#3db3d9]"
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
                    {img?.url ? (
                      <Image
                        src={img.url}
                        alt={work.title}
                        fill
                        sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, (max-width: 1024px) 16vw, 12vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}

                    {work.client?.logo?.url && (
                      <div className="absolute bottom-1.5 right-1.5 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-md p-1 shadow-sm">
                        <div className="relative w-full h-full">
                          <Image
                            src={work.client.logo.url}
                            alt={work.client.name}
                            fill
                            sizes="32px"
                            className="object-contain"
                          />
                        </div>
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

      {/* YOUTUBE VIDEO SECTION */}
      <section
        ref={youtubeSecRef}
        className={`relative overflow-hidden min-h-screen flex items-center justify-center bg-black cursor-pointer group transition-all duration-1000 ${youtubeInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={toggleYouTubeVideo}
      >
        <div ref={youtubeRef} className="absolute inset-0 w-full h-full">
          <div
            id="youtube-player"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '177.77777778vh',
              height: '56.25vw',
              minHeight: '100vh',
              minWidth: '100vw',
            }}
          />
        </div>

        <div className="absolute inset-0 bg-black/20" />

        <div
          className={`absolute inset-0 flex flex-col items-center justify-start pt-8 md:pt-12 z-10 pointer-events-none transition-opacity duration-500 ${isYouTubePlaying ? 'opacity-0 group-hover:opacity-80' : 'opacity-90'}`}
        >
          <div className="w-full flex flex-col items-center text-center px-8">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-px w-12 bg-white/40" />
              <span className="text-xs font-medium tracking-[0.3em] uppercase text-white/80">
                YouTube Channel
              </span>
              <div className="h-px w-12 bg-white/40" />
            </div>

            

           

            <a
              href="https://www.youtube.com/@Ji_Daeri"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 mt-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold rounded-full hover:bg-white/20 transition-all pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              채널 방문하기
            </a>
          </div>
        </div>

       

        <div className="absolute bottom-8 right-8 z-10">
          <div className="text-right">
            <div className="text-white/90 text-sm font-medium mb-1 tracking-wide">
              ABO Media
            </div>
            <div className="text-white/60 text-xs tracking-wider">
              YouTube
            </div>
          </div>
        </div>
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