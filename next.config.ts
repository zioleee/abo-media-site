// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // ← 이 부분만 추가!
  },
  images: {
    // 더 안전: 모든 graphassets 서브도메인 허용
    remotePatterns: [{ protocol: "https", hostname: "**.graphassets.com" }],
    // 만약 특정 리전만 쓰고 싶다면 아래처럼:
    // domains: ["ap-south-1.graphassets.com"],
  },
};

export default nextConfig;
