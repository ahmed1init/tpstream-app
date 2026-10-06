'use client';

import React, { useState } from 'react';
import WatchModal from './WatchModal';

interface Movie {
  title: string;
  description: string;
  trailerUrl: string;
  year: number;
  rating: string;
  genre: string[];
  cast: string[];
  director: string;
  posterUrl: string;
  category: 'Trending' | 'Movies' | 'Series' | 'Documentaries';
}

const allMovies: Movie[] = [
  {
    title: 'Fall 2: Deadpoint',
    description: 'High-altitude survival continuation. Climbers test their limits with immersive sound and high-tension sequences.',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1',
    year: 2026,
    rating: '16+',
    genre: ['Action', 'Thriller'],
    cast: ['Grace Fulton', 'Mason Gooding'],
    director: 'Scott Mann',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    category: 'Trending',
  },
  {
    title: 'Cyber Heist: Nairobi',
    description: 'A high-stakes techno-thriller following underground hackers pulling off a massive digital asset transfer.',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1',
    year: 2026,
    rating: '18+',
    genre: ['Crime', 'Drama'],
    cast: ['Brian Ogola', 'Sarah Hassan'],
    director: 'Topg Director',
    posterUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80',
    category: 'Trending',
  },
  {
    title: 'Savannah Titans',
    description: 'An epic documentary exploring the raw power and survival mechanics of apex predators in East Africa.',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1',
    year: 2025,
    rating: 'PG',
    genre: ['Documentary', 'Nature'],
    cast: ['David Attenborough'],
    director: 'Wildlife Studios',
    posterUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
    category: 'Documentaries',
  },
  {
    title: 'Shadow Syndicate S1',
    description: 'An underground investigative drama unravelling multi-national corporate corruption.',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1',
    year: 2026,
    rating: '18+',
    genre: ['Mystery', 'Series'],
    cast: ['Nick Mutuma', 'Foi Wambui'],
    director: 'Topg Production',
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    category: 'Series',
  },
];

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredMovies = allMovies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'All' || movie.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <main className="min-h-screen bg-[#141414] text-white selection:bg-red-600 selection:text-white pb-20">
      
      {/* Netflix Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-black/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-900">
        <div className="flex items-center gap-8">
          <span className="text-red-600 font-black text-2xl tracking-tighter cursor-pointer">TPSTREAM</span>
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            {['All', 'Trending', 'Movies', 'Series', 'Documentaries'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`transition ${activeCategory === cat ? 'text-white font-bold' : 'hover:text-gray-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right side: Search & Three Dots Menu */}
        <div className="flex items-center gap-4 relative">
          <input
            type="text"
            placeholder="Search movies, series..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/60 border border-gray-700 text-sm px-4 py-1.5 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-red-600 w-40 md:w-64 transition"
          />

          {/* Three Dots Quick Menu Button */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-[#222] hover:bg-[#333] p-2 rounded-full text-white font-bold text-lg w-10 h-10 flex items-center justify-center transition"
            >
              ⋮
            </button>

            {/* Quick Menu Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#181818] border border-gray-800 rounded-lg shadow-2xl py-2 z-50 text-sm">
                <div className="px-4 py-2 border-b border-gray-800 font-bold text-gray-400 text-xs uppercase">
                  Quick Settings & Menu
                </div>
                <button className="w-full text-left px-4 py-2.5 hover:bg-red-600 hover:text-white transition flex items-center gap-2">
                  ⚙️ Audio & Visual Settings
                </button>
                <button className="w-full text-left px-4 py-2.5 hover:bg-red-600 hover:text-white transition flex items-center gap-2">
                  ❤️ My Favorites Album
                </button>
                <button className="w-full text-left px-4 py-2.5 hover:bg-red-600 hover:text-white transition flex items-center gap-2">
                  📥 My Downloads
                </button>
                <div className="border-t border-gray-800 my-1"></div>
                <button className="w-full text-left px-4 py-2.5 hover:bg-red-600/20 text-red-500 transition font-medium">
                  🚪 Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Banner Showcase with 20s looping feel */}
      <div className="relative h-[65vh] w-full flex items-center px-8 md:px-16 bg-gradient-to-r from-black via-black/40 to-transparent">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img
            src={allMovies[0].posterUrl}
            alt="Hero background"
            className="w-full h-full object-cover opacity-40 blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/60"></div>
        </div>

        <div className="max-w-2xl space-y-4 z-10">
          <span className="bg-red-600/80 text-white text-xs font-bold px-3 py-1 rounded">FEATURED PREMIERE</span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">{allMovies[0].title}</h1>
          <p className="text-gray-300 text-sm md:text-base line-clamp-3">{allMovies[0].description}</p>
          <div className="flex gap-4 pt-2">
            <button
              onClick={() => setSelectedMovie(allMovies[0])}
              className="bg-white hover:bg-gray-200 text-black font-bold px-8 py-3 rounded flex items-center gap-2 transition shadow-lg"
            >
              ▶ Play Trailer & Stream
            </button>
            <button
              onClick={() => setSelectedMovie(allMovies[0])}
              className="bg-gray-800/80 hover:bg-gray-700 text-white font-bold px-8 py-3 rounded border border-gray-600 transition"
            >
              ℹ More Info & Downloads
            </button>
          </div>
        </div>
      </div>

      {/* Movie Grid Categories */}
      <div className="px-8 md:px-16 mt-8 space-y-8">
        <h2 className="text-2xl font-bold tracking-wide">{activeCategory === 'All' ? 'Trending Now & Releases' : activeCategory}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movie, index) => (
            <div
              key={index}
              onClick={() => setSelectedMovie(movie)}
              className="group cursor-pointer bg-[#181818] rounded-md overflow-hidden border border-gray-800 hover:border-gray-600 transition-all duration-300 transform hover:scale-105 hover:z-20 shadow-xl"
            >
              <div className="relative aspect-[2/3] w-full bg-black">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <span className="text-xs font-bold text-red-500 uppercase tracking-wide">Click to Stream / Download</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate">{movie.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                  <span>{movie.year}</span>
                  <span className="text-red-500 font-bold">{movie.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Watch Modal / Split Screen Popup */}
      <WatchModal
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
        movie={selectedMovie}
        relatedMovies={allMovies.map(m => ({ title: m.title, posterUrl: m.posterUrl, year: m.year, genre: m.genre[0] }))}
      />
    </main>
  );
}