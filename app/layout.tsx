// app/layout.tsx
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SITE_URL } from "./lib/site";
import type { Metadata } from "next";

const NAVER_VERIFICATION = "358efa793fdb1d77773d4c5232f93baa8f272d33";

//  카카오/OG 미리보기 전용 이미지 (public/og_abomedia_white.png)
const OG_IMAGE = "/og_abomedia_white.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: SITE_URL },

  // B안: 완전 한글
  title: {
    default: "에이비오미디어",
    template: "%s | 에이비오미디어",
  },

  // 설명도 한글로 유지 (원하면 “에이비오미디어” 문구를 더 넣어도 됨)
  description:
    "예능·리얼리티·음악 등 방송/디지털 콘텐츠를 기획·제작하는 종합 미디어 기업",

  // 검색 키워드: 여기 있음 (layout.tsx 맞아)
  keywords: [
    "에이비오미디어",
    "ABO미디어",
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

    // OG도 한글로
    title: "에이비오미디어",
    description:
      "예능·리얼리티·음악 등 방송/디지털 콘텐츠를 기획·제작하는 종합 미디어 기업",
    siteName: "에이비오미디어",

    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "에이비오미디어",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    // 트위터도 한글로
    title: "에이비오미디어",
    description:
      "예능·리얼리티·음악 등 방송/디지털 콘텐츠를 기획·제작하는 종합 미디어 기업",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="naver-site-verification" content={NAVER_VERIFICATION} />

        {/* (강추) 회사명 신호 강화: 구조화데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "에이비오미디어",
              alternateName: "ABO MEDIA",
              url: SITE_URL,
              logo: `${SITE_URL}${OG_IMAGE}`,
            }),
          }}
        />

        <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "에이비오미디어",
        alternateName: "ABO MEDIA",
        url: SITE_URL,
      }),
    }}
  />
      </head>

      <body className="min-h-dvh flex flex-col bg-background text-foreground antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
