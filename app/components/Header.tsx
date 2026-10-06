'use client';

import { useState, useEffect } from 'react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onGoPro: () => void;
  onOpenAuth: () => void;
}

export default function Header({ searchQuery, setSearchQuery, onGoPro, onOpenAuth }: HeaderProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('tpstream_user_email');
    if (saved) setUserEmail(saved);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0b0c10]/95 backdrop-blur border-b border-gray-800 px-4 md:px-8 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center p-1 bg-black/50 border border-gray-800 rounded-xl overflow-hidden">
          <img 
            src="/logo.png" 
            alt="TPSTREAM Logo" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src.endsWith('.png')) target.src = '/logo.jpg';
            }}
            className="w-full h-full object-contain animate-breathing"
          />
        </div>
        <h1 className="text-xl md:text-2xl font-black text-white tracking-wider uppercase cursor-pointer">
          TP<span className="text-red-600">STREAM</span>
        </h1>
      </div>

      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search movies, series, docs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 rounded-full px-4 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onGoPro}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm hover:opacity-90 transition-opacity shadow-lg"
        >
          Go PRO
        </button>

        {userEmail ? (
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full text-xs text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="max-w-[100px] truncate">{userEmail}</span>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
