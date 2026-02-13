'use client'

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Business() {
  const [inView, setInView] = useState([false, false, false, false]);
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useEffect(() => {
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
        { threshold: 0.2 }
      );

      if (ref.current) observer.observe(ref.current);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const businesses = [
    {
      id: 1,
      tag: "Broadcast Production",
      title: "방송 프로그램 제작",
      description:
        "지상파·케이블·종편을 포함한 방송 환경에서 예능/교양 프로그램 기획·제작을 수행합니다. 방송사의 제작 표준과 요구 품질에 맞춰 온열 경영을 기반으로, 기획부터 촬영·편집·후반까지 안정적으로 완성합니다.",
      source: "#",
      icon: "📺",
      gradient: "from-[#1c7a9e] to-[#2596be]",
    },
    {
      id: 2,
      tag: "MCN & Digital Contents",
      title: "MCN / 디지털 콘텐츠",
      description:
        "유튜브 채널 기획 및 운영을 중심으로, 디지털 플랫폼에 최적화된 콘텐츠를 제작합니다. 방송 수준의 제작력과 디지털 퍼포먼스 관점을 함께 적용해, 재미 성장과 시청자 반응을 동시에 설계합니다.",
      source: "#",
      icon: "🎬",
      gradient: "from-[#2596be] to-[#3db3d9]",
    },
    {
      id: 3,
      tag: "Branded Content & Advertising",
      title: "브랜디드 콘텐츠 & 광고",
      description:
        "브랜드 메시지가 자연스럽게 스며드는 네이티브 애드 및 캠페인형 브랜디드 콘텐츠를 기획·제작합니다. 콘텐츠의 몰입도를 해치지 않으면서도 명확한 커뮤니케이션 목표를 달성하도록, 포맷/크리에이티브/운영을 통합 설계합니다.",
      source: "#",
      icon: "💡",
      gradient: "from-[#3db3d9] to-[#2596be]",
    },
    {
      id: 4,
      tag: "Commerce & IP Business",
      title: "커머스 연계 사업",
      description:
        "콘텐츠 IP를 기반으로 상품 기획 및 유통까지 연결하는 수익 모델을 구축합니다. 제작 단계부터 커머스 환경 가능성을 함께 고려해, IP 기반 상품화/유통 및 연계 사업을 추진합니다.",
      source: "#",
      icon: "🛍️",
      gradient: "from-[#1c7a9e] to-[#3db3d9]",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1c7a9e] via-[#2596be] to-[#3db3d9] py-24 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.08),transparent_50%)]" />
        </div>

        <div className="container-main relative z-10">
          <div className="text-center text-white space-y-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-white/30" />
              <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/80">
                Business Areas
              </span>
              <div className="h-px w-8 bg-white/30" />
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              사업영역
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              방송 프로그램 제작부터 디지털 콘텐츠, 브랜디드 콘텐츠, 커머스까지<br />
              <span className="font-semibold text-white">4가지 핵심 영역</span>으로 콘텐츠 가치를 확장합니다
            </p>
          </div>
        </div>
      </section>

      {/* Business Cards */}
      <section className="py-16 md:py-24">
        <div className="container-main max-w-6xl">
          <div className="grid gap-8 md:gap-12">
            {businesses.map((business, index) => (
              <div
                key={business.id}
                ref={sectionRefs[index]}
                className={`group relative transition-all duration-1000 ${
                  inView[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-16"
                }`}
              >
                {/* Card */}
                <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500">
                  {/* Gradient Accent Bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${business.gradient}`}
                  />

                  <div className="p-8 md:p-12">
                    {/* Icon & Tag */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-5xl md:text-6xl">{business.icon}</div>
                      <div>
                        <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full tracking-wide">
                          {business.tag}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-[#2596be] transition-colors duration-300">
                      {business.title}
                    </h2>

                    {/* Description */}
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
                      {business.description}
                    </p>

                  </div>

                  {/* Hover Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${business.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                  />
                </div>

                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#2596be] to-[#3db3d9] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {business.id}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </main>
  );
}