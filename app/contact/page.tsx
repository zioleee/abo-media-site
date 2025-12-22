'use client'

import { useEffect, useRef } from "react";

type NaverMaps = {
  maps: {
    LatLng: new (lat: number, lng: number) => unknown;
    Map: new (el: HTMLElement, options: unknown) => unknown;
    Marker: new (options: unknown) => unknown;
    InfoWindow: new (options: { content: string }) => {
      open: (map: unknown, marker: unknown) => void;
    };
    Position: {
      TOP_RIGHT: unknown;
    };
  };
};

declare global {
  interface Window {
    naver?: NaverMaps;
  }
}

export default function Contact() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    if (!clientId) {
      console.warn("NEXT_PUBLIC_NAVER_MAP_CLIENT_ID is missing");
      return;
    }

    const initMap = () => {
      if (!mapRef.current || !window.naver) return;

      const location = new window.naver.maps.LatLng(37.5595, 126.8464);

      const map = new window.naver.maps.Map(mapRef.current, {
        center: location,
        zoom: 17,
        zoomControl: true,
        zoomControlOptions: { position: window.naver.maps.Position.TOP_RIGHT },
      });

      const marker = new window.naver.maps.Marker({
        position: location,
        map,
        title: "에이비오미디어",
      });

      const infoWindow = new window.naver.maps.InfoWindow({
        content:
          '<div style="padding:15px;font-size:14px;"><strong>에이비오미디어</strong><br/>서울 강서구 양천로 551-17</div>',
      });

      infoWindow.open(map, marker);
    };

    // ✅ 이미 스크립트가 있으면: return 하지 말고 "지도 초기화"만 시도
    const existing = document.querySelector<HTMLScriptElement>('script[data-naver-maps="true"]');
    if (existing) {
      // 이미 로드되어 window.naver가 있으면 즉시 init
      if (window.naver) initMap();
      // 아직 로드 중이면 load 이벤트 한 번만 걸기
      else existing.addEventListener("load", initMap, { once: true });
      return;
    }

    // ✅ 스크립트가 없으면 새로 로드
    const script = document.createElement("script");
    script.dataset.naverMaps = "true";
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;

    script.addEventListener("load", initMap);
    document.head.appendChild(script);

    // ✅ script는 지우지 않는 편이 안정적 (페이지 이동 시 재로딩/깜빡임 방지)
    return () => {
      script.removeEventListener("load", initMap);
    };
  }, []);

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1c7a9e] via-[#2596be] to-[#3db3d9] text-white py-20">
        <div className="container-main">
          <h1 className="text-4xl md:text-5xl font-bold">CONTACT</h1>
          <p className="mt-4 text-lg text-white/90">
            에이비오미디어와 함께 콘텐츠의 미래를 만들어보세요
          </p>
        </div>
      </section>

      {/* 찾아오시는 길 */}
      <section className="py-16 md:py-20">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-12">
            {/* 왼쪽 정보 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Location</h2>

              <div className="space-y-6">
                {/* 주소 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#2596be]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#2596be]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">주소</h3>
                    <p className="text-gray-600 leading-relaxed">
                      서울특별시 강서구 양천로 551-17<br />
                      한화비즈메트로 1차 705호
                    </p>
                  </div>
                </div>

                {/* 전화번호 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#2596be]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#2596be]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">연락처</h3>
                    <p className="text-gray-600">
                      <a href="tel:010-3889-4595" className="hover:text-[#2596be] transition">
                        010-3889-4595
                      </a>
                    </p>
                  </div>
                </div>

                {/* 이메일 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#2596be]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#2596be]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">이메일</h3>
                    <p className="text-gray-600">
                      <a href="mailto:abo@abomedia.co.kr" className="hover:text-[#2596be] transition">
                        abo@abomedia.co.kr
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* 네이버 지도/길찾기 버튼 */}
              <div className="mt-8 flex gap-3">
                <a
                  href="https://map.naver.com/p/search/서울특별시 강서구 양천로 551-17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2596be] text-white font-semibold rounded-full hover:bg-[#1c7a9e] transition shadow-lg"
                >
                  길찾기
                </a>

                <a
                  href="https://map.naver.com/p/search/서울특별시 강서구 양천로 551-17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#2596be] text-[#2596be] font-semibold rounded-full hover:bg-[#2596be] hover:text-white transition"
                >
                  지도 보기
                </a>
              </div>
            </div>

            {/* 오른쪽 : 지도 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Map</h2>

              <div
                ref={mapRef}
                className="w-full h-[400px] rounded-2xl shadow-lg border border-gray-200"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
