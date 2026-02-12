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

  // 모바일 메뉴 열렸을 때 body 스크롤 방지
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // 네비게이션 아이템 (언어별)
  const navItems = isEnglish ? [
    { href: '/en/about', label: 'About' },
    { href: '/en/business', label: 'Business' },
    { href: '/en/works', label: 'Works' },
    { href: '/en/news', label: 'News' },
    { href: '/en/contact', label: 'Contact' },
  ] : [
    { href: '/about', label: 'About' },
    { href: '/business', label: 'Business' },
    { href: '/works', label: 'Works' },
    { href: '/news', label: 'News' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-subtle shadow-sm">
        <nav className="container-main h-20 flex items-center justify-between px-4 md:px-8">
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
              className="w-[120px] md:w-[160px] h-auto"
            />
          </Link>

          {/* 데스크톱: GNB + 언어 전환 */}
          <div className="hidden md:flex items-center gap-8">
            {/* 네비게이션 */}
            <div className="flex items-center gap-10 text-[18px] font-semibold">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="hover:text-[var(--brand)] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* 언어 전환 버튼 */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
              <Link
                href={pathname.replace('/en', '') || '/'}
                className={`
                  px-3 py-1.5 text-sm font-semibold rounded-md transition-all
                  ${!isEnglish 
                    ? 'text-[var(--brand)] bg-[var(--brand)]/10' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                KOR
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href={'/en' + (isEnglish ? pathname.replace('/en', '') : pathname)}
                className={`
                  px-3 py-1.5 text-sm font-semibold rounded-md transition-all
                  ${isEnglish 
                    ? 'text-[var(--brand)] bg-[var(--brand)]/10' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                ENG
              </Link>
            </div>
          </div>

          {/* 모바일: 햄버거 버튼만 */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="메뉴 열기"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
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
      </header>

      {/* 모바일 메뉴 (전체 화면 오버레이) */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* 반투명 배경 - 페이드 인 */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            style={{
              animation: 'fadeIn 0.3s ease-out'
            }}
          />
          
          {/* 메뉴 패널 - 슬라이드 인 */}
          <div 
            className="absolute top-0 right-0 w-[65%] max-w-[280px] h-full bg-white shadow-2xl flex flex-col overflow-hidden"
            style={{
              animation: 'slideInRight 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <div className="flex justify-end p-4 border-b border-gray-200 flex-shrink-0">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="메뉴 닫기"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>

            {/* 메뉴 아이템 */}
            <nav className="flex flex-col px-6 pt-8 gap-1 flex-1">
              {navItems.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-4 text-4xl font-semibold hover:bg-gray-50 hover:text-[var(--brand)] rounded-lg transition-all"
                  style={{
                    animation: `fadeInUp 0.4s ease-out ${idx * 0.05}s both`
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* 언어 전환 - 메뉴 하단 (기존 스타일 그대로) */}
            <div 
              className="flex items-center gap-1.5 px-6 pb-6 pt-4 border-t border-gray-200 flex-shrink-0 justify-center"
              style={{
                animation: 'fadeInUp 0.4s ease-out 0.3s both'
              }}
            >
              <Link
                href={pathname.replace('/en', '') || '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  px-2.5 py-1 text-xs font-semibold rounded transition-all
                  ${!isEnglish 
                    ? 'text-[var(--brand)] bg-[var(--brand)]/10' 
                    : 'text-gray-500'
                  }
                `}
              >
                KOR
              </Link>
              <span className="text-gray-300 text-xs">|</span>
              <Link
                href={'/en' + (isEnglish ? pathname.replace('/en', '') : pathname)}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  px-2.5 py-1 text-xs font-semibold rounded transition-all
                  ${isEnglish 
                    ? 'text-[var(--brand)] bg-[var(--brand)]/10' 
                    : 'text-gray-500'
                  }
                `}
              >
                ENG
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 애니메이션 CSS */}
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