// app/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="bg-[#0A0F1A] text-white py-16">
      <div className="container-main max-w-4xl">
        {/* 회사명 (텍스트) */}
        <h2 className="text-2xl font-bold mb-4">ABO MEDIA</h2>

       

        {/* 회사 정보 */}
        <div className="space-y-2.5 text-sm text-gray-400 leading-relaxed">
          <p className="text-white font-medium">㈜에이비오미디어</p>
          <p>대표번호 0507-1385-0877</p>
          <p>서울특별시 강서구 양천로 551-17 한화비즈메트로 1차 705호</p>
        </div>
      </div>
    </footer>
  );
}