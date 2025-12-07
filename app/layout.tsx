// app/layout.tsx
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/ABO_Logo.png";
import Footer from "./components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "ABO MEDIA - 콘텐츠로 사람과 시장을 연결합니다",
    template: "%s | ABO MEDIA",
  },
  description: "예능·리얼리티·음악 등 방송/디지털 콘텐츠를 기획·제작하는 종합 미디어 기업",
  keywords: ["ABO미디어", "에이비오미디어", "방송제작", "콘텐츠제작", "예능제작", "미디어기업"],
  authors: [{ name: "ABO MEDIA" }],
  creator: "ABO MEDIA",
  publisher: "ABO MEDIA",
  robots: {
    index: false, // ✅ 개발 중에는 false
    follow: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://abo-media.co.kr", // ← 실제 도메인으로 변경
    title: "ABO MEDIA - 콘텐츠로 사람과 시장을 연결합니다",
    description: "예능·리얼리티·음악 등 방송/디지털 콘텐츠를 기획·제작하는 종합 미디어 기업",
    siteName: "ABO MEDIA",
    images: [
      {
        url: "/og-image.jpg", // ← 나중에 제작 필요 (1200x630px)
        width: 1200,
        height: 630,
        alt: "ABO MEDIA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ABO MEDIA",
    description: "콘텐츠로 사람과 시장을 연결합니다",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-dvh flex flex-col bg-background text-foreground antialiased">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-subtle">
          <nav className="container-main h-16 flex items-center justify-between">
            {/* 로고 */}
            <Link href="/" className="flex items-center gap-2" aria-label="ABO MEDIA Home">
              <Image src={logo} alt="ABO MEDIA 로고" width={200} height={61} priority />
            </Link>

            {/* GNB */}
            <div className="flex items-center gap-6 text-sm font-medium">
              <Link href="/about" className="hover:text-[var(--brand)] transition">
                회사소개
              </Link>
              <Link href="/business" className="hover:text-[var(--brand)] transition">
                사업영역
              </Link>
              <Link href="/works" className="hover:text-[var(--brand)] transition">
                포트폴리오
              </Link>
              <Link href="/news" className="hover:text-[var(--brand)] transition">
                공지·뉴스
              </Link>
              <Link href="/clients" className="hover:text-[var(--brand)] transition">
                고객사
              </Link>
              <Link href="/contact" className="hover:text-[var(--brand)] transition">
                문의
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}