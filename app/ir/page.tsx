// app/ir/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function IrPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">IR 정보</h1>
        <p className="text-gray-600">준비 중입니다</p>
      </div>
    </main>
  );
}