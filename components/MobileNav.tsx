'use client';

import Link from 'next/link';

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#08090c]/95 backdrop-blur-xl border-t border-gray-800/80 px-6 py-2.5 md:hidden">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <Link href="/" className="flex flex-col items-center gap-1 text-red-500 font-medium">
          <span className="text-base font-bold">▶</span>
          Home
        </Link>
        <Link href="/search" className="flex flex-col items-center gap-1 hover:text-white transition-colors">
          <span className="text-base font-bold">🔍</span>
          Search
        </Link>
        <Link href="/library" className="flex flex-col items-center gap-1 hover:text-white transition-colors">
          <span className="text-base font-bold">🍿</span>
          Library
        </Link>
        <Link href="/pro" className="flex flex-col items-center gap-1 text-amber-400 font-semibold">
          <span className="text-base font-bold">⭐</span>
          Pro Pass
        </Link>
      </div>
    </nav>
  );
}
