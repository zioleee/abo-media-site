// app/layout.tsx
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SITE_URL } from "./lib/site";
import type { Metadata } from "next";

const NAVER_VERIFICATION = "358efa793fdb1d77773d4c5232f93baa8f272d33";

const OG_IMAGE = "/og_abomedia_white.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: SITE_URL },

  title: {
    default: "에이비오미디어",
    template: "%s | 에이비오미디어",
  },

  description:
    "이야기를 만들고 세상을 움직이는 크리에이티브 콘텐츠 그룹. 예능·OTT·유튜브 오리지널부터 AI 제작까지",

  keywords: [
    "에이비오미디어",
    "ABO미디어",
    "ABO MEDIA",
    "방송제작",
    "콘텐츠제작",
    "예능제작",
    "미디어기업",
    "AI영상제작",
    "OTT콘텐츠",
    "유튜브오리지널",
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
    title: "에이비오미디어",
    description:
      "이야기를 만들고 세상을 움직이는 크리에이티브 콘텐츠 그룹. 예능·OTT·유튜브 오리지널부터 AI 제작까지",
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
    title: "에이비오미디어",
    description:
      "이야기를 만들고 세상을 움직이는 크리에이티브 콘텐츠 그룹. 예능·OTT·유튜브 오리지널부터 AI 제작까지",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="naver-site-verification" content={NAVER_VERIFICATION} />

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