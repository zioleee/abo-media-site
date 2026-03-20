// app/en/ir/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function EnIrPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">IR Information</h1>
        <p className="text-gray-600">Coming soon</p>
      </div>
    </main>
  );
}