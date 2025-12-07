// app/components/Footer.tsx
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0A0F1A] text-white">
      <div className="container-main py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* 왼쪽: 회사 정보 */}
          <div>
            {/* 로고 */}
            <div className="mb-6">
              <Link href="/" className="inline-block">
                <Image
                  src="/ABO_Logo.png"
                  alt="ABO MEDIA"
                  width={140}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* 회사명 & 주소 */}
            <div className="space-y-2 text-sm text-gray-400">
              <p className="text-white font-semibold text-base">
                ㈜에이비오미디어 (ABO Media Co., Ltd.)
              </p>
              <p>서울특별시 마포구 월드컵북로 396 (상암동, 누리꿈스퀘어 비즈니스타워) 22층</p>
              <p>
                <span className="text-gray-500">대표이사</span> 홍길동{" "}
                <span className="text-gray-500 ml-3">사업자등록번호</span> 107-87-21272
              </p>
            </div>

            {/* 연락처 */}
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 w-16">대표번호</span>
                <a
                  href="tel:02-1234-5678"
                  className="text-white hover:text-blue-400 transition"
                >
                  02-1234-5678
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 w-16">팩스</span>
                <span className="text-gray-400">02-1234-5679</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 w-16">이메일</span>
                <a
                  href="mailto:contact@abomedia.kr"
                  className="text-white hover:text-blue-400 transition"
                >
                  contact@abomedia.kr
                </a>
              </div>
            </div>
          </div>

          {/* 오른쪽: 링크 & SNS */}
          <div className="flex flex-col justify-between">
            {/* 빠른 링크 */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <h4 className="text-sm font-semibold mb-3 text-gray-300">회사</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="/about" className="hover:text-white transition">
                      회사소개
                    </Link>
                  </li>
                  <li>
                    <Link href="/business" className="hover:text-white transition">
                      사업영역
                    </Link>
                  </li>
                  <li>
                    <Link href="/ir" className="hover:text-white transition">
                      IR 정보
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3 text-gray-300">콘텐츠</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="/works" className="hover:text-white transition">
                      포트폴리오
                    </Link>
                  </li>
                  <li>
                    <Link href="/news" className="hover:text-white transition">
                      뉴스·공지
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white transition">
                      제휴문의
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* SNS 아이콘 */}
            <div>
              <h4 className="text-sm font-semibold mb-3 text-gray-300">소셜 미디어</h4>
              <div className="flex gap-3">
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
 
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-pink-600 flex items-center justify-center transition"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-500 flex items-center justify-center transition"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-sky-500 flex items-center justify-center transition"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2025 ABO Media Co., Ltd. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="hover:text-white transition">
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
