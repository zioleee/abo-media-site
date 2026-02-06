// app/layout.tsx
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SITE_URL } from "./lib/site";
import type { Metadata } from "next";

const NAVER_VERIFICATION = "358efa793fdb1d77773d4c5232f93baa8f272d33";

// ✅ 카카오/OG 미리보기 전용 이미지 (public/og_abomedia_white.png)
const OG_IMAGE = "/og_abomedia_white.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: SITE_URL },

  title: {
    default: "ABO MEDIA - 콘텐츠로 사람과 시장을 연결합니다",
    template: "%s | ABO MEDIA",
  },
  description:
    "예능·리얼리티·음악 등 방송/디지털 콘텐츠를 기획·제작하는 종합 미디어 기업",
  keywords: [
    "ABO미디어",
    "에이비오미디어",
    "ABO MEDIA",
    "방송제작",
    "콘텐츠제작",
    "예능제작",
    "미디어기업",
  ],
  authors: [{ name: "ABO MEDIA" }],
  creator: "ABO MEDIA",
  publisher: "ABO MEDIA",

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    title: "ABO MEDIA - 콘텐츠로 사람과 시장을 연결합니다",
    description:
      "예능·리얼리티·음악 등 방송/디지털 콘텐츠를 기획·제작하는 종합 미디어 기업",
    siteName: "ABO MEDIA",
    images: [
      {
        url: OG_IMAGE, // ✅ 변경
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
    images: [OG_IMAGE], // ✅ 변경
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      {/* ✅ 네이버가 요구하는 HTML 태그를 head에 "직접" 넣기 (가장 확실) */}
      <head>
        <meta name="naver-site-verification" content={NAVER_VERIFICATION} />
      </head>

      <body className="min-h-dvh flex flex-col bg-background text-foreground antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
