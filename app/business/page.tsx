'use client'

import { useEffect, useRef, useState } from "react";

// ===== Inline SVG Icons (Lucide style, stroke-based) =====
type IconProps = { className?: string; strokeWidth?: number };

function IconTv({ className, strokeWidth = 1.25 }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m17 2-5 5-5-5" />
      <rect width="20" height="15" x="2" y="7" rx="2" />
    </svg>
  );
}

function IconYoutube({ className, strokeWidth = 1.25 }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function IconSparkles({ className, strokeWidth = 1.25 }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  );
}

function IconShoppingBag({ className, strokeWidth = 1.25 }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function BusinessIcon({
  id,
  className,
  strokeWidth,
}: {
  id: string;
  className?: string;
  strokeWidth?: number;
}) {
  const props = { className, strokeWidth };
  switch (id) {
    case "01":
      return <IconTv {...props} />;
    case "02":
      return <IconYoutube {...props} />;
    case "03":
      return <IconSparkles {...props} />;
    case "04":
      return <IconShoppingBag {...props} />;
    default:
      return null;
  }
}

export default function Business() {
  const [heroInView, setHeroInView] = useState(false);
  const [inView, setInView] = useState([false, false, false, false]);
  const [outroInView, setOutroInView] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useEffect(() => {
    const heroObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setHeroInView(true)),
      { threshold: 0.2 }
    );
    if (heroRef.current) heroObserver.observe(heroRef.current);

    const outroObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setOutroInView(true)),
      { threshold: 0.2 }
    );
    if (outroRef.current) outroObserver.observe(outroRef.current);

    const observers = sectionRefs.map((ref, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setInView((prev) => {
                const updated = [...prev];
                updated[index] = true;
                return updated;
              });
            }
          });
        },
        { threshold: 0.25 }
      );
      if (ref.current) observer.observe(ref.current);
      return observer;
    });

    return () => {
      heroObserver.disconnect();
      outroObserver.disconnect();
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  const businesses = [
    {
      id: "01",
      tag: "Broadcast Production",
      title: "방송 프로그램 제작",
      subtitle: "지상파 · 케이블 · 종편",
      description:
        "방송 환경에서 예능 · 교양 프로그램의 기획부터 촬영, 편집, 후반 작업까지 완성도 높은 콘텐츠를 안정적으로 제작합니다.",
      keywords: ["기획", "촬영", "편집", "후반작업"],
    },
    {
      id: "02",
      tag: "MCN & Digital Contents",
      title: "MCN · 디지털 콘텐츠",
      subtitle: "YouTube · 디지털 플랫폼",
      description:
        "유튜브 채널 기획과 운영을 중심으로, 디지털 플랫폼에 최적화된 콘텐츠를 통해 채널 성장과 시청자 반응을 함께 설계합니다.",
      keywords: ["채널 기획", "운영", "그로스", "퍼포먼스"],
    },
    {
      id: "03",
      tag: "Branded Content & Advertising",
      title: "브랜디드 콘텐츠 · 광고",
      subtitle: "Native Ads · 캠페인",
      description:
        "브랜드 메시지가 자연스럽게 스며드는 네이티브 애드와 캠페인형 콘텐츠로, 몰입도와 커뮤니케이션 목표를 함께 달성합니다.",
      keywords: ["네이티브 애드", "캠페인", "크리에이티브", "통합 운영"],
    },
    {
      id: "04",
      tag: "Commerce & IP Business",
      title: "커머스 연계 사업",
      subtitle: "IP 기반 상품화 · 유통",
      description:
        "콘텐츠 IP를 상품 기획과 유통까지 연결해, 제작 단계부터 커머스 확장 가능성을 함께 고려한 통합 수익 모델을 구축합니다.",
      keywords: ["IP 비즈니스", "상품 기획", "유통", "수익 모델"],
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* ===== HERO ===== */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-32 pb-24 md:pt-48 md:pb-40"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(37,150,190,0.04),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(28,122,158,0.03),transparent_60%)]" />

        {/* Background grid - increased opacity from 0.03 to 0.08 */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, #1c7a9e 1px, transparent 1px), linear-gradient(to bottom, #1c7a9e 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="container-main relative max-w-6xl">
          <div
            className={`transition-all duration-1000 ${
              heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-[#2596be]" />
              <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#2596be]">
                Business Areas
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.95] text-gray-900 tracking-tight mb-8">
              사업영역
            </h1>

            <div className="max-w-2xl ml-auto md:text-right">
              <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-light">
                방송 프로그램 제작부터 디지털 콘텐츠, 브랜디드 콘텐츠, 커머스까지<br />
                <span className="text-gray-900 font-normal">4가지 핵심 영역</span>
                으로 콘텐츠 가치를 확장합니다.
              </p>
            </div>

            {/* ===== Index list - 글씨 크기 키움 ===== */}
            <div
              className={`mt-20 md:mt-32 pt-8 transition-all duration-1000 delay-300 ${
                heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {businesses.map((b) => (
                  <a
                    key={b.id}
                    href={`#section-${b.id}`}
                    className="group flex flex-col gap-3 cursor-pointer"
                  >
                    {/* 01, 02, 03, 04 - 더 크게 */}
                    <span className="text-sm md:text-base font-mono tracking-[0.2em] text-[#2596be] font-semibold">
                      {b.id}
                    </span>
                    {/* 제목 - 더 크게 */}
                    <span className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-[#2596be] transition-colors duration-300 leading-tight">
                      {b.title}
                    </span>
                    <div className="h-px w-0 bg-[#2596be] group-hover:w-full transition-all duration-500" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BUSINESS SECTIONS (ZIGZAG) ===== */}
      <section className="py-16 md:py-24">
        <div className="container-main max-w-7xl">
          {businesses.map((business, index) => {
            const isReversed = index % 2 === 1;
            return (
              <div
                key={business.id}
                id={`section-${business.id}`}
                ref={sectionRefs[index]}
                className="relative py-16 md:py-32 scroll-mt-24"
              >
                {index > 0 && (
                  <div className="absolute top-0 left-0 right-0 h-px bg-gray-100" />
                )}

                <div
                  className={`grid md:grid-cols-12 gap-8 md:gap-16 items-center transition-all duration-1000 ${
                    inView[index]
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-16"
                  }`}
                >
                  {/* Visual side */}
                  <div
                    className={`md:col-span-5 ${
                      isReversed ? "md:order-2" : "md:order-1"
                    }`}
                  >
                    <div className="relative">
                      <div
                        className="absolute -top-8 md:-top-16 -left-4 md:-left-8 text-[180px] md:text-[280px] font-bold leading-none text-gray-50 select-none pointer-events-none"
                        aria-hidden
                      >
                        {business.id}
                      </div>

                      <div className="relative aspect-square max-w-md mx-auto">
                        <div className="absolute inset-0 rounded-full border border-gray-200" />
                        <div className="absolute inset-8 rounded-full border border-gray-100" />

                        <div
                          className={`absolute inset-12 rounded-full bg-gradient-to-br from-[#2596be]/8 via-[#3db3d9]/5 to-transparent transition-all duration-700 ${
                            inView[index] ? "scale-100 opacity-100" : "scale-90 opacity-0"
                          }`}
                          style={{ transitionDelay: "200ms" }}
                        />

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className={`transition-all duration-700 ${
                              inView[index] ? "scale-100 opacity-100" : "scale-50 opacity-0"
                            }`}
                            style={{ transitionDelay: "400ms" }}
                          >
                            <BusinessIcon
                              id={business.id}
                              className="w-20 h-20 md:w-28 md:h-28 text-[#1c7a9e]"
                              strokeWidth={1.25}
                            />
                          </div>
                        </div>

                        <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-[#2596be]/40" />
                        <div className="absolute bottom-8 left-2 w-1 h-1 rounded-full bg-[#2596be]/30" />
                        <div className="absolute top-1/2 left-0 w-1 h-1 rounded-full bg-[#2596be]/20" />
                      </div>
                    </div>
                  </div>

                  {/* Text side */}
                  <div
                    className={`md:col-span-7 ${
                      isReversed ? "md:order-1" : "md:order-2"
                    }`}
                  >
                    <div className="space-y-6 md:space-y-8">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono tracking-[0.2em] text-[#2596be]">
                          — {business.id}
                        </span>
                        <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-gray-400">
                          {business.tag}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-3">
                          {business.title}
                        </h2>
                        <p className="text-base md:text-lg text-[#2596be] font-medium">
                          {business.subtitle}
                        </p>
                      </div>

                      <div className="h-px w-16 bg-gray-900" />

                      <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-xl font-light">
                        {business.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {business.keywords.map((kw, i) => (
                          <span
                            key={kw}
                            className={`px-4 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 rounded-full hover:border-[#2596be] hover:text-[#2596be] transition-all duration-300 ${
                              inView[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                            style={{
                              transitionDelay: `${500 + i * 80}ms`,
                              transitionProperty: "opacity, transform, border-color, color",
                              transitionDuration: "500ms",
                            }}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== OUTRO ===== */}
      <section
        ref={outroRef}
        className="relative overflow-hidden py-24 md:py-40 bg-gradient-to-br from-[#1c7a9e] via-[#2596be] to-[#3db3d9]"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_50%)]" />
        </div>

        <div className="container-main relative max-w-4xl text-center">
          <div
            className={`transition-all duration-1000 ${
              outroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-white/30" />
              <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/80">
                One Pipeline
              </span>
              <div className="h-px w-12 bg-white/30" />
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] mb-8">
              기획부터 유통까지<br />
              하나의 흐름으로
            </h2>

            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto font-light leading-relaxed mb-12">
              에이비오미디어는 4가지 사업 영역을 유기적으로 연결해<br className="hidden md:block" />
              콘텐츠가 가진 가치를 끝까지 확장합니다.
            </p>

            <a
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#1c7a9e] font-semibold rounded-full hover:scale-105 hover:shadow-2xl transition-all duration-500 text-sm tracking-wide group"
            >
              협업 문의하기
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}