// app/en/business/page.tsx
'use client'

import { useEffect, useRef, useState } from "react";

export default function EnBusiness() {
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
      title: "Broadcast Program Production",
      description:
        "We plan and produce entertainment and educational programs across terrestrial, cable, and general programming channels. From concept development through filming, editing, and post-production, we deliver stable, high-quality output aligned with each broadcaster's production standards.",
      icon: "📺",
      gradient: "from-[#1c7a9e] to-[#2596be]",
    },
    {
      id: 2,
      tag: "MCN & Digital Contents",
      title: "MCN / Digital Contents",
      description:
        "We produce digitally optimized content centered on YouTube channel planning and management. By combining broadcast-level production quality with a digital performance mindset, we design content that drives both audience engagement and measurable growth.",
      icon: "🎬",
      gradient: "from-[#2596be] to-[#3db3d9]",
    },
    {
      id: 3,
      tag: "Branded Content & Advertising",
      title: "Branded Content & Advertising",
      description:
        "We plan and produce native advertising and campaign-style branded content that seamlessly integrates brand messaging. Format, creative direction, and distribution are designed as a unified system — achieving clear communication goals without compromising content immersion.",
      icon: "💡",
      gradient: "from-[#3db3d9] to-[#2596be]",
    },
    {
      id: 4,
      tag: "Commerce & IP Business",
      title: "Commerce & IP Business",
      description:
        "We build revenue models that connect content IP through to product planning and distribution. Commerce potential is considered from the production stage itself, enabling IP-based merchandising, distribution, and related business initiatives.",
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
              BUSINESS
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              From broadcast production to digital content, branded content, and commerce —<br />
              <span className="font-semibold text-white">4 core areas</span> that expand the value of content
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