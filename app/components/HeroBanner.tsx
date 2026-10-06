'use client';

import { useState, useEffect } from 'react';

interface HeroMovie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  media_type?: string;
  first_air_date?: string;
}

interface HeroBannerProps {
  movies: HeroMovie[];
  onSelectMovie: (movie: HeroMovie) => void;
}

export default function HeroBanner({ movies, onSelectMovie }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!movies || movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 8000);
    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) return null;
  const current = movies[currentIndex] || movies[0];
  if (!current) return null;

  const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';
  const backdropImage = current.backdrop_path || current.poster_path;

  const isSeries = current.media_type === 'tv' || !!current.first_air_date || !current.title;
  const contentTypeTag = isSeries ? 'Featured Series' : 'Featured Movie';

  return (
    <div className="relative w-full h-[65vh] sm:h-[75vh] bg-black overflow-hidden mb-6">
      {/* Background Image */}
      {backdropImage && (
        <img
          src={`${BACKDROP_BASE}${backdropImage}`}
          alt={current.title || current.name || 'Hero Banner'}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out scale-105"
        />
      )}
      
      {/* Vignette Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-black/60 to-transparent w-full md:w-2/3" />

      {/* Main Content Details */}
      <div className="absolute bottom-12 left-4 md:left-12 max-w-xl z-20 space-y-3">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-red-500 tracking-widest uppercase">
          <span className="bg-red-600/20 border border-red-500/40 text-red-400 text-[9px] px-2 py-0.5 rounded-full font-bold">
            TP EXCLUSIVE
          </span>
          <span>{contentTypeTag}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-md leading-tight">
          {current.title || current.name}
        </h1>

        {/* Updated Resolution Badges to 1080p */}
        <div className="flex items-center gap-3 text-xs text-gray-300 font-semibold">
          <span className="text-amber-400 font-bold">★ {current.vote_average ? current.vote_average.toFixed(1) : 'N/A'}</span>
          <span className="border border-gray-700 bg-black/40 px-1.5 py-0.5 rounded text-[9px] text-emerald-400 font-bold">1080p Full HD</span>
          <span className="border border-gray-700 bg-black/40 px-1.5 py-0.5 rounded text-[9px]">Fast Stream</span>
          <span className="text-gray-400">5.1 Surround</span>
        </div>

        <p className="text-gray-300 text-xs sm:text-sm line-clamp-3 leading-relaxed max-w-md drop-shadow">
          {current.overview || 'Stream high-definition movies and series with instant fast-server playback.'}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => onSelectMovie(current)}
            className="bg-red-600 hover:bg-red-500 text-white font-extrabold px-6 py-2.5 rounded-lg text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xl hover:scale-105"
          >
            <span className="text-base">▶</span> Watch Now
          </button>
          
          <button
            onClick={() => onSelectMovie(current)}
            className="bg-gray-900/80 hover:bg-gray-800 text-white font-bold px-5 py-2.5 rounded-lg text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-2 border border-gray-700"
          >
            <span>ℹ</span> View Details
          </button>
        </div>
      </div>

      {/* Carousel Indicator Dots */}
      <div className="absolute bottom-4 right-4 md:right-12 z-20 flex items-center gap-1.5">
        {movies.slice(0, 5).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === idx ? 'w-6 bg-red-600' : 'w-2 bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
