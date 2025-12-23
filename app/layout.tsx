// app/layout.tsx
import "./globals.css";
import Header from "./components/Header";
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
  icons: {                                    
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://abo-media.co.kr",
    title: "ABO MEDIA - 콘텐츠로 사람과 시장을 연결합니다",
    description: "예능·리얼리티·음악 등 방송/디지털 콘텐츠를 기획·제작하는 종합 미디어 기업",
    siteName: "ABO MEDIA",
    images: [
      {
        url: "/ABO_Logo.png",
        width: 800,
        height: 800,
        alt: "ABO MEDIA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ABO MEDIA",
    description: "콘텐츠로 사람과 시장을 연결합니다",
    images: ["/ABO_Logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-dvh flex flex-col bg-background text-foreground antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}