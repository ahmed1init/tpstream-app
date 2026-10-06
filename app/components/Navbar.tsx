'use client';

import { useState } from 'react';

interface NavbarProps {
  onOpenFavorites: () => void;
  onOpenSettings: () => void;
  onOpenDownloads: () => void;
  onOpenAuth: () => void;
  userEmail: string | null;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navbar({
  onOpenFavorites,
  onOpenSettings,
  onOpenDownloads,
  onOpenAuth,
  userEmail,
  onLogout,
  searchQuery,
  setSearchQuery
}: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black via-black/80 to-transparent backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-900/50">
      
      {/* Left: Logo & Nav Links */}
      <div className="flex items-center gap-8">
        <h1 className="text-red-600 font-black text-xl tracking-tighter cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          TP STREAM
        </h1>
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-300">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">Movies</a>
          <a href="#" className="hover:text-white transition-colors">TV Series</a>
          <button onClick={onOpenFavorites} className="hover:text-white transition-colors cursor-pointer">Favorites</button>
          <button onClick={onOpenDownloads} className="hover:text-white transition-colors cursor-pointer">Downloads</button>
        </nav>
      </div>

      {/* Right: Sign In Button on the Left of Search + Search Bar + Three Dots Settings */}
      <div className="flex items-center gap-3">
        
        {/* Sign In Button placed right to the left of the search bar */}
        {!userEmail ? (
          <button
            onClick={onOpenAuth}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            Sign In
          </button>
        ) : (
          <button
            onClick={onLogout}
            className="bg-gray-800 hover:bg-red-900/80 text-gray-200 font-bold px-3 py-1.5 rounded-lg text-xs border border-gray-700 transition-all cursor-pointer whitespace-nowrap"
            title="Click to logout"
          >
            {userEmail.split('@')[0]} (Out)
          </button>
        )}

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-900/90 border border-gray-800 text-white text-xs rounded-xl px-3.5 py-1.5 pl-8 focus:outline-none focus:border-red-600 w-32 sm:w-48 transition-all"
          />
          <span className="absolute left-2.5 top-2 text-gray-400 text-xs">🔍</span>
        </div>

        {/* Three Dots Menu for Settings */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 hover:border-gray-700 flex items-center justify-center text-gray-300 hover:text-white font-bold transition-all cursor-pointer"
          >
            ⋮
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0b0c10] border border-gray-800 rounded-xl shadow-2xl py-2 z-50">
              <button
                onClick={() => { setShowDropdown(false); onOpenSettings(); }}
                className="w-full text-left px-4 py-2 text-xs text-gray-200 hover:bg-red-600 hover:text-white font-semibold transition-colors flex items-center gap-2"
              >
                <span>⚙️</span> Video & Audio Settings
              </button>
              <button
                onClick={() => { setShowDropdown(false); onOpenFavorites(); }}
                className="w-full text-left px-4 py-2 text-xs text-gray-200 hover:bg-red-600 hover:text-white font-semibold transition-colors flex items-center gap-2 md:hidden"
              >
                <span>❤️</span> Favorites
              </button>
              <button
                onClick={() => { setShowDropdown(false); onOpenDownloads(); }}
                className="w-full text-left px-4 py-2 text-xs text-gray-200 hover:bg-red-600 hover:text-white font-semibold transition-colors flex items-center gap-2 md:hidden"
              >
                <span>⬇️</span> Downloads
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
