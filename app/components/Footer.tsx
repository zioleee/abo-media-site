// app/components/Footer.tsx
'use client'

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith('/en');

  return (
    <footer className="bg-[#0A0F1A] text-white py-16">
      <div className="container-main max-w-4xl">
        {/* 회사명 */}
        <h2 className="text-2xl font-bold mb-4">ABO MEDIA</h2>

        {/* 회사 정보 */}
        <div className="space-y-2.5 text-sm text-gray-400 leading-relaxed">
          <p className="text-white font-medium">
            {isEnglish ? 'ABO Media Co., Ltd.' : '㈜에이비오미디어'}
          </p>
          <p>
            {isEnglish ? 'Tel' : '대표번호'} 010-3889-4595
          </p>
          <p>
            {isEnglish 
              ? '705, Hanwha Bizmetro 1st, 551-17 Yangcheon-ro, Gangseo-gu, Seoul, Republic of Korea'
              : '서울특별시 강서구 양천로 551-17 한화비즈메트로 1차 705호'
            }
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} ABO MEDIA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}