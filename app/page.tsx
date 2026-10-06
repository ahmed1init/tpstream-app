'use client';

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MovieCard from './components/MovieCard';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average: number;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Settings states
  const [videoQuality, setVideoQuality] = useState('1080p');
  const [audioVolume, setAudioVolume] = useState(80);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Modal states
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDownloadsModal, setShowDownloadsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [tempEmailInput, setTempEmailInput] = useState('');

  // Comprehensive movie catalog for daily rotation
  const fullCatalog: Movie[] = [
    { 
      id: 1, 
      title: "Insidious: Out of the Further", 
      poster_path: "/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg", 
      backdrop_path: "/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
      vote_average: 7.8, 
      release_date: "2026-05-12", 
      overview: "Gemma explores the mysterious dark realms of The Further, discovering she possesses the ability to bring lives back to the real world with multi-audio and subtitle options." 
    },
    { 
      id: 2, 
      title: "Spider-Man: Brand New Day", 
      poster_path: "/5icunheM8Yl4jKPCTz9k56s9j7x.jpg", 
      backdrop_path: "/5icunheM8Yl4jKPCTz9k56s9j7x.jpg",
      vote_average: 8.2, 
      release_date: "2026-06-20", 
      overview: "Peter Parker charts a brand new course across New York City, balancing personal relationships and heroic duties with native language dubs." 
    },
    { 
      id: 3, 
      title: "Lanterns", 
      name: "Lanterns", 
      poster_path: "/wTEh5mMWkeN1Exv9aH0009mP9b2.jpg", 
      backdrop_path: "/wTEh5mMWkeN1Exv9aH0009mP9b2.jpg",
      vote_average: 7.9, 
      first_air_date: "2026-01-15", 
      overview: "Intergalactic peacekeepers investigate a dark planetary conspiracy on Earth equipped with full subtitle support in all global languages." 
    },
    { 
      id: 4, 
      title: "Onslaught", 
      poster_path: "/kuf6dutpsT0vSVehic3EZIqkOBt.jpg", 
      backdrop_path: "/kuf6dutpsT0vSVehic3EZIqkOBt.jpg",
      vote_average: 6.8, 
      release_date: "2026-03-10", 
      overview: "An elite tactical team faces an unprecedented wave of hostile forces in high definition streaming." 
    },
    { 
      id: 5, 
      title: "Fall 2: Deadpoint", 
      poster_path: "/uVwIAq6435XXdcvbJj78K1PjH1l.jpg", 
      backdrop_path: "/uVwIAq6435XXdcvbJj78K1PjH1l.jpg",
      vote_average: 7.1, 
      release_date: "2026-04-05", 
      overview: "High altitude survival pushes extreme athletes to their limits with immersive sound and localized subtitle choices." 
    }
  ];

  // Daily rotating banner index calculated dynamically based on today's day of the year
  const getDailyBanner = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return fullCatalog[dayOfYear % fullCatalog.length];
  };

  const [currentBanner, setCurrentBanner] = useState<Movie>(fullCatalog[0]);

  useEffect(() => {
    // Set daily banner on load
    setCurrentBanner(getDailyBanner());

    const savedFavs = localStorage.getItem('tp_favorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error(e);
      }
    }

    const savedEmail = localStorage.getItem('tp_user_email');
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  const handleToggleFavorite = (movie: Movie, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(movie.id)) {
      updated = favorites.filter(id => id !== movie.id);
    } else {
      updated = [...favorites, movie.id];
    }
    setFavorites(updated);
    localStorage.setItem('tp_favorites', JSON.stringify(updated));
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempEmailInput.trim()) {
      setUserEmail(tempEmailInput.trim());
      localStorage.setItem('tp_user_email', tempEmailInput.trim());
      setShowAuthModal(false);
      setTempEmailInput('');
      alert("Signed in successfully as: " + tempEmailInput);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tp_user_email');
    setUserEmail(null);
    alert("Signed out successfully!");
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white selection:bg-red-600 selection:text-white pb-24">
      
      {/* Top Navbar */}
      <Navbar 
        onOpenFavorites={() => setShowFavoritesModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenDownloads={() => setShowDownloadsModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        userEmail={userEmail}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Daily Rotating Cinematic Hero Banner */}
      <section className="relative h-[80vh] w-full flex items-end px-6 sm:px-16 pb-16 pt-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`https://image.tmdb.org/t/p/original${currentBanner.backdrop_path || currentBanner.poster_path}`} 
            alt={currentBanner.title || currentBanner.name}
            className="w-full h-full object-cover object-center opacity-70 transition-opacity duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-2xl space-y-4 z-10">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded tracking-widest uppercase shadow-lg">
              Featured Premiere Today
            </span>
            <span className="text-[10px] text-gray-300 bg-black/60 px-2 py-0.5 rounded border border-gray-700 backdrop-blur-md">
              All Languages & Subtitles Available
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-2xl">
            {currentBanner.title || currentBanner.name}
          </h1>

          <div className="flex items-center gap-3 text-xs text-gray-200 font-semibold">
            <span className="text-amber-400 font-bold">★ {currentBanner.vote_average}</span>
            <span className="bg-zinc-800/80 px-2 py-0.5 rounded text-[11px] border border-zinc-700">{videoQuality} HD</span>
            <span className="text-zinc-400 font-normal">Multi-Language & Subtitles Ready</span>
          </div>

          <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 max-w-xl font-normal drop-shadow">
            {currentBanner.overview}
          </p>

          <div className="flex items-center gap-3 pt-3">
            <button className="bg-white hover:bg-white/90 text-black font-extrabold px-7 py-3 rounded-md text-xs flex items-center gap-2 shadow-xl transition-all cursor-pointer">
              <span className="text-sm">▶</span> Play Now
            </button>
            <button className="bg-zinc-500/50 hover:bg-zinc-500/40 text-white font-bold px-6 py-3 rounded-md text-xs transition-all cursor-pointer backdrop-blur-md border border-zinc-600/50 flex items-center gap-2">
              <span>ℹ</span> More Info
            </button>
          </div>
        </div>
      </section>

      {/* Netflix Style Category Rows */}
      <div className="space-y-10 mt-8 px-6 sm:px-12">
        
        {/* Row 1: Trending Now */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Trending Now
            </h3>
            <span className="text-xs text-zinc-400">All Languages & Subtitles Included</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {fullCatalog.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onSelectMovie={(m) => setSelectedMovie(m)}
                isFavorite={favorites.includes(movie.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </section>

        {/* Row 2: Popular on TP Stream */}
        <section>
          <h3 className="text-base sm:text-lg font-bold text-white mb-4 tracking-wide">
            Popular on TP Stream
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {fullCatalog.slice().reverse().map((movie) => (
              <MovieCard 
                key={movie.id + 100} 
                movie={movie} 
                onSelectMovie={(m) => setSelectedMovie(m)}
                isFavorite={favorites.includes(movie.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </section>

      </div>

      {/* SIGN IN MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-800 w-full max-w-md rounded-xl p-6 shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">Sign In</h3>
              <button onClick={() => setShowAuthModal(false)} className="text-gray-400 hover:text-white font-bold text-lg cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleSaveEmail} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Email or phone number</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={tempEmailInput}
                  onChange={(e) => setTempEmailInput(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs rounded-md px-3.5 py-3 focus:outline-none focus:border-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md text-xs transition-all shadow-lg cursor-pointer"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FAVORITES MODAL */}
      {showFavoritesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-800 w-full max-w-2xl rounded-xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">My Favorites</h3>
              <button onClick={() => setShowFavoritesModal(false)} className="text-gray-400 hover:text-white font-bold text-lg cursor-pointer">✕</button>
            </div>
            
            {favorites.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-xs">
                Your favorites list is empty. Click the heart icon on any movie to add it here.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {fullCatalog.filter(m => favorites.includes(m.id)).map(fav => (
                  <div key={fav.id} className="bg-zinc-900 border border-zinc-800 rounded-md p-3 text-xs flex flex-col justify-between">
                    <p className="font-bold text-white truncate">{fav.title || fav.name}</p>
                    <p className="text-[10px] text-red-500 mt-2 font-semibold">Saved</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-800 w-full max-w-md rounded-xl p-6 shadow-2xl relative space-y-5">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">Playback Settings</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-gray-400 hover:text-white font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Video Resolution</label>
              <div className="grid grid-cols-4 gap-2">
                {['1080p', '720p', '480p', '360p'].map((res) => (
                  <button
                    key={res}
                    onClick={() => setVideoQuality(res)}
                    className={`py-2 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                      videoQuality === res 
                        ? 'bg-red-600 text-white border-red-500' 
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-400 uppercase tracking-wider">Default Audio Volume</span>
                <span className="text-red-500 font-bold">{audioVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={audioVolume}
                onChange={(e) => setAudioVolume(Number(e.target.value))}
                className="w-full accent-red-600 bg-zinc-900 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* DOWNLOADS MODAL */}
      {showDownloadsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-800 w-full max-w-md rounded-xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Downloads</h3>
              <button onClick={() => setShowDownloadsModal(false)} className="text-gray-400 hover:text-white font-bold text-lg cursor-pointer">✕</button>
            </div>
            <div className="py-8 text-center text-gray-400 text-xs space-y-2">
              <p>No offline downloads available.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
