'use client';

import { useState, useEffect } from 'react';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  media_type?: string;
}

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
}

interface MovieDetailsModalProps {
  movie: Movie;
  onClose: () => void;
  onGoPro: (amount: number, tier: string) => void;
  onSelectMovie: (movie: Movie) => void;
}

export default function MovieDetailsModal({ movie, onClose, onGoPro, onSelectMovie }: MovieDetailsModalProps) {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [relatedMovies, setRelatedMovies] = useState<any[]>([]);
  const [seasonsCount, setSeasonsCount] = useState<number>(0);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [serverSource, setServerSource] = useState<number>(1);
  const [playTrailerMode, setPlayTrailerMode] = useState<boolean>(true);
  const [showDownloadMenu, setShowDownloadMenu] = useState<boolean>(false);

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
  const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

  const releaseYear = parseInt((movie.release_date || movie.first_air_date || '').split('-')[0] || '0', 10);
  const isUnreleased = releaseYear >= 2026;
  const isSeries = movie.media_type === 'tv' || !movie.release_date;

  const getStreamUrl = () => {
    if (playTrailerMode && trailerKey) {
      return `https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&controls=1&start=0&end=20&loop=1&playlist=${trailerKey}`;
    }

    const epNum = selectedEpisode ? selectedEpisode.episode_number : 1;
    if (isSeries) {
      if (serverSource === 1) return `https://vidsrc.vip/embed/tv/${movie.id}/${selectedSeason}/${epNum}`;
      if (serverSource === 2) return `https://multiembed.mov/directstream.php?video_id=${movie.id}&tmdb=1&s=${selectedSeason}&e=${epNum}`;
      return `https://vidsrc.cc/v2/embed/tv/${movie.id}/${selectedSeason}/${epNum}`;
    } else {
      if (serverSource === 1) return `https://vidsrc.vip/embed/movie/${movie.id}`;
      if (serverSource === 2) return `https://multiembed.mov/directstream.php?video_id=${movie.id}&tmdb=1`;
      return `https://vidsrc.cc/v2/embed/movie/${movie.id}`;
    }
  };

  useEffect(() => {
    async function fetchDetails() {
      if (!API_KEY) return;
      const type = isSeries ? 'tv' : 'movie';
      try {
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${movie.id}?api_key=${API_KEY}&append_to_response=videos,credits,similar`);
        const data = await res.json();
        
        if (data.videos?.results) {
          const trailer = data.videos.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') || data.videos.results[0];
          if (trailer) setTrailerKey(trailer.key);
        }
        if (data.credits?.cast) setCast(data.credits.cast.slice(0, 8));
        if (data.genres) setGenres(data.genres);
        if (data.similar?.results) setRelatedMovies(data.similar.results.slice(0, 12));
        if (isSeries && data.number_of_seasons) setSeasonsCount(data.number_of_seasons);
      } catch (err) {
        console.error('Failed to fetch details:', err);
      }
    }
    fetchDetails();
  }, [movie.id, API_KEY, isSeries]);

  useEffect(() => {
    if (!isSeries || !API_KEY) return;
    async function fetchSeasonEpisodes() {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${movie.id}/season/${selectedSeason}?api_key=${API_KEY}`);
        const data = await res.json();
        if (data.episodes) {
          setEpisodes(data.episodes);
          if (data.episodes.length > 0) setSelectedEpisode(data.episodes[0]);
        }
      } catch (err) {
        console.error('Failed to fetch episodes:', err);
      }
    }
    fetchSeasonEpisodes();
  }, [selectedSeason, movie.id, API_KEY, isSeries]);

  const resolutions = [
    { label: 'Full HD (1080p)', size: '3.8 GB', price: 200, tier: '1080p Pass' },
    { label: 'HD (720p)', size: '1.9 GB', price: 100, tier: '720p Pass' },
    { label: 'SD (480p)', size: '850 MB', price: 50, tier: '480p Pass' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      
      {/* Modal Container */}
      <div className="bg-[#07080a] border border-gray-800/80 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col relative shadow-2xl overflow-hidden my-auto">
        
        {/* Background Cinematic Poster Header (Blended) */}
        <div className="absolute top-0 left-0 right-0 h-72 sm:h-96 overflow-hidden pointer-events-none opacity-25 z-0">
          <img 
            src={movie.backdrop_path ? `${BACKDROP_BASE}${movie.backdrop_path}` : `${IMAGE_BASE}${movie.poster_path}`} 
            alt="Backdrop" 
            className="w-full h-full object-cover filter blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07080a]/60 via-[#07080a]/90 to-[#07080a]" />
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 z-40 bg-black/80 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center transition-all border border-gray-700 shadow-xl text-xs sm:text-sm"
        >
          ✕
        </button>

        {/* Modal Main Body (2-Column Grid) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          
          {/* LEFT COLUMN: Player & Info */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Custom Header Badge & Title Above Player */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-red-500 tracking-widest uppercase">
                <span className="bg-red-600/20 border border-red-500/40 text-red-400 text-[9px] px-2 py-0.5 rounded-full font-bold">
                  TP EXCLUSIVE
                </span>
                <span>{isSeries ? 'Featured Series' : 'Featured Movie'}</span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow">
                {movie.title || movie.name}
              </h1>

              <div className="flex items-center gap-3 text-xs text-gray-300 font-semibold pt-0.5">
                <span className="text-amber-400 font-bold">★ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                <span className="border border-gray-700 bg-black/40 px-1.5 py-0.5 rounded text-[9px] text-emerald-400 font-bold">1080p Full HD</span>
                <span className="border border-gray-700 bg-black/40 px-1.5 py-0.5 rounded text-[9px]">Fast Stream</span>
                <span className="text-gray-400">5.1 Surround</span>
              </div>
            </div>

            {/* Video Player Box */}
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
              {(playTrailerMode || !isUnreleased) ? (
                <iframe
                  key={`${movie.id}-${selectedSeason}-${selectedEpisode?.id || 0}-${serverSource}-${playTrailerMode}`}
                  src={getStreamUrl()}
                  title={movie.title || movie.name}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4 text-center bg-black overflow-hidden">
                  <img 
                    src={movie.backdrop_path ? `${BACKDROP_BASE}${movie.backdrop_path}` : `${IMAGE_BASE}${movie.poster_path}`} 
                    alt="Backdrop" 
                    className="absolute inset-0 w-full h-full object-cover opacity-30 filter blur-sm scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-black/60 to-transparent" />

                  <div className="relative z-10 max-w-sm flex flex-col items-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold tracking-wider uppercase mb-2">
                      {isUnreleased ? 'Upcoming Release' : 'Stream Offline'}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white mb-1">
                      {movie.title || movie.name}
                    </h3>
                    <p className="text-[11px] text-gray-300 mb-3 max-w-xs leading-snug">
                      {isUnreleased 
                        ? `Releasing in ${releaseYear}. Direct streaming active upon official release.`
                        : 'Stream currently updating across mirrors. Watch preview loop below.'}
                    </p>
                    <div className="flex items-center gap-2">
                      {trailerKey && (
                        <button
                          onClick={() => setPlayTrailerMode(true)}
                          className="bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-lg transition-all shadow flex items-center gap-1.5"
                        >
                          <span>▶</span> Watch 20s Loop Preview
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Controls Bar */}
            <div className="bg-gray-950/80 backdrop-blur-md p-3.5 rounded-xl border border-gray-800 space-y-3 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xs sm:text-sm font-bold text-gray-200 truncate">
                    {selectedEpisode ? `E${selectedEpisode.episode_number}: ${selectedEpisode.name}` : (movie.title || movie.name)}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setPlayTrailerMode(false)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                      !playTrailerMode 
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/50' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <span>🎬</span> Watch Full Stream
                  </button>

                  <button
                    onClick={() => setPlayTrailerMode(true)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                      playTrailerMode 
                        ? 'bg-red-600/20 text-red-400 border-red-500/50' 
                        : 'bg-black/60 text-gray-300 hover:text-white border-gray-800'
                    }`}
                  >
                    ▶ 20s Loop
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                      className="bg-gray-900 hover:bg-gray-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-gray-700 flex items-center gap-1 transition-colors"
                    >
                      <span>⬇</span> <span>Download</span> <span className="text-[9px]">▼</span>
                    </button>

                    {showDownloadMenu && (
                      <div className="absolute right-0 top-9 z-40 bg-gray-950 border border-gray-800 rounded-xl p-2 w-48 shadow-2xl space-y-1">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-2 py-0.5 border-b border-gray-800">
                          Download Quality (Max 1080p)
                        </p>
                        {resolutions.map((res, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              onGoPro(res.price, res.tier);
                              setShowDownloadMenu(false);
                            }}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-between text-[11px] text-gray-200"
                          >
                            <div>
                              <p className="font-bold">{res.label}</p>
                              <p className="text-[8px] text-gray-400">{res.size}</p>
                            </div>
                            <span className="text-red-500 font-bold text-[10px]">Ksh {res.price}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {!playTrailerMode && !isUnreleased && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-800/80 text-[10px] text-gray-300">
                  <span className="font-bold text-gray-400">Select Streaming Server:</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3].map((srv) => (
                      <button
                        key={srv}
                        onClick={() => setServerSource(srv)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                          serverSource === srv ? 'bg-red-600 text-white' : 'bg-black/60 text-gray-400 hover:text-white border border-gray-800'
                        }`}
                      >
                        Server {srv}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                {genres.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {genres.map((g) => (
                      <span key={g.id} className="bg-red-950/40 border border-red-800/40 text-red-300 text-[9px] px-2 py-0.5 rounded font-medium">
                        {g.name}
                      </span>
                    ))}
                  </div>
                )}

                {isSeries && seasonsCount > 0 && (
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    className="bg-black border border-gray-700 text-[10px] text-white px-2.5 py-1 rounded focus:outline-none focus:border-red-600 ml-auto font-bold"
                  >
                    {[...Array(seasonsCount)].map((_, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        Season {idx + 1}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Synopsis & Cast Box */}
            <div className="bg-gray-950/60 p-4 rounded-xl border border-gray-800/80 space-y-3">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Storyline</h4>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {selectedEpisode?.overview || movie.overview || 'No synopsis available.'}
                </p>
              </div>

              {cast.length > 0 && (
                <div className="pt-2 border-t border-gray-800/80">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Top Cast</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cast.map((actor) => (
                      <span key={actor.id} className="bg-black/60 border border-gray-800 px-2.5 py-1 rounded text-[10px] text-gray-300">
                        {actor.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Sidebar (Expanded to fill vertical space) */}
          <div className="space-y-4 border-t lg:border-t-0 lg:border-l border-gray-800/80 lg:pl-6 pt-4 lg:pt-0 flex flex-col">
            
            {/* TV Episodes List */}
            {isSeries && episodes.length > 0 && (
              <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800 space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-white flex items-center justify-between">
                  <span>Episodes ({episodes.length})</span>
                  <span className="text-[10px] text-red-500 font-bold">Season {selectedSeason}</span>
                </h4>
                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-gray-800">
                  {episodes.map((ep) => {
                    const isSelected = selectedEpisode?.id === ep.id;
                    return (
                      <button
                        key={ep.id}
                        onClick={() => {
                          setSelectedEpisode(ep);
                          setPlayTrailerMode(false);
                        }}
                        className={`w-full p-2 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 ${
                          isSelected 
                            ? 'bg-red-600/20 border-red-500 text-white scale-[1.01]' 
                            : 'bg-black/50 border-gray-800/80 text-gray-300 hover:border-gray-600 hover:bg-gray-900/60'
                        }`}
                      >
                        <div className="w-12 h-10 bg-gray-950 rounded-lg overflow-hidden shrink-0 relative">
                          <img 
                            src={ep.still_path ? `${IMAGE_BASE}${ep.still_path}` : 'https://via.placeholder.com/150'} 
                            alt={ep.name}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="overflow-hidden min-w-0 flex-1">
                          <p className="text-[11px] font-bold truncate">E{ep.episode_number}: {ep.name}</p>
                          <p className="text-[9px] text-emerald-400 mt-0.5 font-semibold">Play Episode ▶</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Related Movies & Series (Expanded Grid to Fill Space) */}
            {relatedMovies.length > 0 && (
              <div className="space-y-2.5 flex-1 flex flex-col">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
                  <span>More Like This</span>
                  <span className="text-[9px] text-red-500 font-semibold">Click to open</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pr-1 py-1 max-h-[70vh]">
                  {relatedMovies.map((rel) => (
                    <div 
                      key={rel.id} 
                      onClick={() => onSelectMovie(rel)}
                      className="group cursor-pointer bg-gray-900/60 rounded-xl overflow-hidden border border-gray-800/80 hover:border-red-500 transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-lg hover:shadow-red-950/50 relative flex flex-col"
                    >
                      <div className="aspect-[2/3] bg-gray-950 overflow-hidden relative">
                        <img 
                          src={rel.poster_path ? `${IMAGE_BASE}${rel.poster_path}` : 'https://via.placeholder.com/300x450'} 
                          alt={rel.title || rel.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" 
                        />
                        
                        <span className="absolute top-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-gray-800 z-10">
                          ★ {rel.vote_average ? rel.vote_average.toFixed(1) : 'N/A'}
                        </span>

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
                            ▶
                          </span>
                        </div>
                      </div>

                      <div className="p-2 bg-gradient-to-b from-gray-900/80 to-gray-950 flex-1 flex flex-col justify-between">
                        <p className="text-[10px] font-bold text-white truncate group-hover:text-red-400 transition-colors">
                          {rel.title || rel.name}
                        </p>
                        <p className="text-[8px] text-gray-400 mt-0.5">
                          {(rel.release_date || rel.first_air_date || '').split('-')[0] || 'Recommended'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
