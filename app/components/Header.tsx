// app/components/Header.tsx
'use client'

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import transparentLogo from "@/public/ABO_Logo_Transparent.png";

export default function Header() {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith('/en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navItems = isEnglish
    ? [
        { href: '/en/about', label: 'About' },
        { href: '/en/business', label: 'Business' },
        { href: '/en/works', label: 'Works' },
        { href: '/en/news', label: 'News' },
        { href: '/en/contact', label: 'Contact' },
      ]
    : [
        { href: '/about', label: 'About' },
        { href: '/business', label: 'Business' },
        { href: '/works', label: 'Works' },
        { href: '/news', label: 'News' },
        { href: '/contact', label: 'Contact' },
      ];

  const koreanPath = pathname.replace('/en', '') || '/';
  const englishPath = '/en' + (isEnglish ? pathname.replace('/en', '') : pathname);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="relative h-20">
          {/* 로고 + 메뉴는 기존 container-main 안에 유지 */}
          <nav className="container-main h-20 flex items-center md:px-8">
            {/* 로고 */}
            <Link
              href={isEnglish ? '/en' : '/'}
              className="flex items-center flex-shrink-0"
              aria-label="ABO MEDIA Home"
            >
              <Image
                src={transparentLogo}
                alt="ABO MEDIA 로고"
                width={200}
                height={60}
                priority
                className="w-[130px] md:w-[174px] h-auto"
              />
            </Link>

            {/* 데스크톱: GNB 메뉴 */}
            <div className="hidden md:flex items-center ml-auto mr-32">
              <div className="flex items-center gap-20 text-[20px] font-semibold">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-900 hover:text-[var(--brand)] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* 모바일: 햄버거 버튼 */}
            <div className="flex md:hidden items-center ml-auto">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="메뉴 열기"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </nav>

          {/* 데스크톱: 언어 전환만 화면 오른쪽 끝으로 분리 */}
<div className="hidden md:flex absolute right-12 top-1/2 -translate-y-1/2 items-center gap-2 pl-4 border-l border-gray-200">            <Link
              href={koreanPath}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all ${
                !isEnglish
                  ? 'text-[var(--brand)] bg-[var(--brand)]/10'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              KOR
            </Link>

            <span className="text-gray-300">|</span>

            <Link
              href={englishPath}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all ${
                isEnglish
                  ? 'text-[var(--brand)] bg-[var(--brand)]/10'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              ENG
            </Link>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            style={{ animation: 'fadeIn 0.3s ease-out' }}
          />

          <div
            className="absolute top-0 right-0 w-[65%] max-w-[280px] h-full bg-white shadow-2xl flex flex-col overflow-hidden"
            style={{ animation: 'slideInRight 0.3s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-4 border-b border-gray-200 flex-shrink-0">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="메뉴 닫기"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col px-6 pt-8 gap-1 flex-1">
              {navItems.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-4 text-4xl font-semibold hover:bg-gray-50 hover:text-[var(--brand)] rounded-lg transition-all"
                  style={{ animation: `fadeInUp 0.4s ease-out ${idx * 0.05}s both` }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div
              className="flex items-center gap-1.5 px-6 pb-6 pt-4 border-t border-gray-200 flex-shrink-0 justify-center"
              style={{ animation: 'fadeInUp 0.4s ease-out 0.3s both' }}
            >
              <Link
                href={koreanPath}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                  !isEnglish
                    ? 'text-[var(--brand)] bg-[var(--brand)]/10'
                    : 'text-gray-500'
                }`}
              >
                KOR
              </Link>

              <span className="text-gray-300 text-xs">|</span>

              <Link
                href={englishPath}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                  isEnglish
                    ? 'text-[var(--brand)] bg-[var(--brand)]/10'
                    : 'text-gray-500'
                }`}
              >
                ENG
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}