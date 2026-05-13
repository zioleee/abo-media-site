// app/en/layout.tsx
import { Metadata } from "next";
import { SITE_URL } from "../lib/site";

// OG 미리보기 전용 이미지 (한국어 버전과 통일)
const OG_IMAGE = "/og_abomedia_white.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: `${SITE_URL}/en` },

  title: {
    default: "ABO MEDIA",
    template: "%s | ABO MEDIA",
  },

  description:
    "A comprehensive media company planning and producing entertainment, reality, music, and other broadcast/digital content",

  keywords: [
    "ABO Media",
    "ABO MEDIA",
    "Content Production",
    "Entertainment",
    "Reality Show",
    "Music Production",
    "Broadcast Production",
    "Media Company",
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
    locale: "en_US",
    url: `${SITE_URL}/en`,
    title: "ABO MEDIA",
    description:
      "A comprehensive media company planning and producing entertainment, reality, music, and other broadcast/digital content",
    siteName: "ABO MEDIA",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "ABO MEDIA",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ABO MEDIA",
    description:
      "A comprehensive media company planning and producing entertainment, reality, music, and other broadcast/digital content",
    images: [OG_IMAGE],
  },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 회사명 신호 강화: 구조화데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "ABO MEDIA",
            alternateName: "에이비오미디어",
            url: `${SITE_URL}/en`,
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
            name: "ABO MEDIA",
            alternateName: "에이비오미디어",
            url: `${SITE_URL}/en`,
            inLanguage: "en",
          }),
        }}
      />

      {children}
    </>
  );
}