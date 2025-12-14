// app/components/Header.tsx
'use client'

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import transparentLogo from "@/public/ABO_Logo_Transparent.png";

export default function Header() {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith('/en');

  // 네비게이션 아이템 (언어별)
  const navItems = isEnglish ? [
    { href: '/en/about', label: 'About' },
    { href: '/en/business', label: 'Business' },
    { href: '/en/works', label: 'Works' },
    { href: '/en/news', label: 'News' },
    { href: '/en/clients', label: 'Clients' },
    { href: '/en/contact', label: 'Contact' },
  ] : [
    { href: '/about', label: 'About' },
    { href: '/business', label: 'Business' },
    { href: '/works', label: 'Works' },
    { href: '/news', label: 'News' },
    { href: '/clients', label: 'Clients' },
    { href: '/contact', label: 'Contact' },
  ];

  // 언어 전환 URL 생성
  const toggleLanguageUrl = () => {
    if (isEnglish) {
      // 영어 → 한국어
      return pathname.replace('/en', '') || '/';
    } else {
      // 한국어 → 영어
      return '/en' + pathname;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-subtle shadow-sm">
      <nav className="container-main h-20 flex items-center justify-between px-8">
        {/* 로고 */}
        <Link href={isEnglish ? '/en' : '/'} className="flex items-center" aria-label="ABO MEDIA Home">
          <Image 
            src={transparentLogo} 
            alt="ABO MEDIA 로고" 
            width={160} 
            height={50} 
            priority 
          />
        </Link>

        {/* GNB + 언어 전환 */}
        <div className="flex items-center gap-8">
          {/* 네비게이션 */}
          <div className="flex items-center gap-8 text-[15px] font-semibold">
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
      </nav>
    </header>
  );
}