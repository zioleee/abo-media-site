// app/en/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "ABO MEDIA - Connecting People and Markets through Content",
    template: "%s | ABO MEDIA",
  },
  description: "A comprehensive media company specializing in entertainment, reality shows, and music content production for broadcast and digital platforms",
  keywords: ["ABO Media", "Content Production", "Entertainment", "Reality Show", "Music Production", "Media Company"],
  authors: [{ name: "ABO MEDIA" }],
  creator: "ABO MEDIA",
  publisher: "ABO MEDIA",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.abomedia.kr/en",
    title: "ABO MEDIA - Connecting People and Markets through Content",
    description: "A comprehensive media company specializing in entertainment, reality shows, and music content production",
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
    description: "Connecting People and Markets through Content",
    images: ["/ABO_Logo.png"],
  },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return children;
}