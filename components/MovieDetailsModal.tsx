'use client';

import { useEffect, useState } from 'react';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onGoPro: (amount?: number, tierLabel?: string) => void;
  onSelectMovie?: (movie: Movie) => void;
}

export default function MovieDetailsModal({ movie: initialMovie, onClose, onGoPro, onSelectMovie }: MovieDetailsModalProps) {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(initialMovie);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'downloads' | 'cast'>('overview');

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
  const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

  useEffect(() => {
    setCurrentMovie(initialMovie);
  }, [initialMovie]);

  useEffect(() => {
    const checkSub = () => {
      const sub = localStorage.getItem('tpstream_pro_subscribed') === 'true';
      setIsSubscribed(sub);
    };
    checkSub();
    window.addEventListener('storage', checkSub);
    return () => window.removeEventListener('storage', checkSub);
  }, []);

  useEffect(() => {
    if (!currentMovie || !API_KEY) return;

    async function fetchFullDetails() {
      setLoading(true);
      try {
        const [detailsRes, recsRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${currentMovie.id}?api_key=${API_KEY}&append_to_response=videos,credits`),
          fetch(`https://api.themoviedb.org/3/movie/${currentMovie.id}/recommendations?api_key=${API_KEY}`)
        ]);

        const data = await detailsRes.json();
        const recsData = await recsRes.json();

        if (data.genres && Array.isArray(data.genres)) {
          setGenres(data.genres.map((g: { id: number; name: string }) => g.name));
        }

        if (data.videos && data.videos.results) {
          const trailer = data.videos.results.find(
            (vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube'
          ) || data.videos.results[0];
          setTrailerKey(trailer ? trailer.key : null);
        }

        if (data.credits && data.credits.cast) {
          setCast(data.credits.cast.slice(0, 8));
        }

        if (data.credits && data.credits.crew) {
          const filteredCrew = data.credits.crew.filter((member: CrewMember) =>
            ['Director', 'Editor', 'Director of Photography', 'Producer', 'Executive Producer'].includes(member.job)
          );
          setCrew(filteredCrew.slice(0, 8));
        }

        if (recsData.results && Array.isArray(recsData.results)) {
          setRelatedMovies(recsData.results.slice(0, 10));
        }
      } catch (err) {
        console.error('Failed to fetch movie details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFullDetails();
  }, [currentMovie, API_KEY]);

  if (!currentMovie) return null;

  const year = currentMovie.release_date ? parseInt(currentMovie.release_date.split('-')[0]) : 2026;

  // Streamlined 3-Tier Resolution Structure
  const resolutions = [
    { 
      label: 'Full HD (1080p)', 
      size: '1.9 GB', 
      format: 'MP4', 
      price: 'Ksh 200',
      badge: 'PRO PASS',
      badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      locked: !isSubscribed,
      amount: 200
    },
    { 
      label: 'HD (720p)', 
      size: '850 MB', 
      format: 'MP4', 
      price: 'Ksh 100',
      badge: 'STANDARD PASS',
      badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      locked: !isSubscribed,
      amount: 100
    },
    { 
      label: 'SD (480p - Mobile)', 
      size: '350 MB', 
      format: 'MP4', 
      price: 'FREE',
      badge: 'FREE ACCESS',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      locked: false,
      amount: 0
    },
  ];

  const handleDownload = (res: typeof resolutions[0]) => {
    if (res.locked) {
      alert(`The ${res.label} package requires a ${res.price} pass to unlock.`);
      onGoPro(res.amount, res.label);
    } else {
      alert(`Starting download for "${currentMovie.title}" in ${res.label} (${res.size})...\n\nYour download link is permanently activated.`);
    }
  };

  const handleSelectRelated = (selected: Movie) => {
    setCurrentMovie(selected);
    if (onSelectMovie) onSelectMovie(selected);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 md:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#0b0c10] border border-gray-800 rounded-3xl max-w-6xl w-full overflow-hidden shadow-2xl relative my-auto max-h-[94vh] flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-30 text-gray-300 hover:text-white bg-black/80 hover:bg-black p-2.5 rounded-full border border-gray-700 backdrop-blur-md transition-all shadow-lg"
        >
          ✕
        </button>

        {/* Desktop Grid Layout */}
        <div className="overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-6">
          
          {/* Main Media Player & Overview Column */}
          <div className="lg:col-span-2 space-y-5">
            
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-xl border border-gray-800">
              {trailerKey ? (
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
                  title={`${currentMovie.title} Trailer`}
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div 
                  className="w-full h-full bg-cover bg-center relative flex items-end p-6"
                  style={{ backgroundImage: `url(${BACKDROP_BASE}${currentMovie.backdrop_path || currentMovie.poster_path})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-black/40 to-transparent" />
                </div>
              )}

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                <div className="flex items-center gap-2">
                  {isSubscribed ? (
                    <span className="bg-emerald-500 text-black font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                      ✓ UNLOCKED ACCESS
                    </span>
                  ) : (
                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                      HD & FULL HD AVAILABLE
                    </span>
                  )}
                  <span className="bg-black/80 text-amber-400 border border-gray-700 text-[10px] font-extrabold px-2 py-0.5 rounded backdrop-blur-md">
                    ★ {currentMovie.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Movie Title & Pricing Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
              <div>
                <h2 className="text-xl md:text-3xl font-black text-white tracking-tight">{currentMovie.title}</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Year: <span className="text-gray-200 font-semibold">{year}</span> • Genre: <span className="text-red-400 font-semibold">{genres.length > 0 ? genres.slice(0, 3).join(', ') : 'Feature'}</span>
                </p>
              </div>

              {!isSubscribed && (
                <button
                  onClick={() => onGoPro(200, 'Full HD (1080p)')}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 shrink-0"
                >
                  UNLOCK ALL (Ksh 200)
                </button>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-800">
              <button
                onClick={() => setActiveTab('overview')}
                className={`text-xs font-bold px-3 py-2 border-b-2 transition-all ${
                  activeTab === 'overview' ? 'border-red-600 text-red-500' : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Synopsis & Crew
              </button>
              <button
                onClick={() => setActiveTab('downloads')}
                className={`text-xs font-bold px-3 py-2 border-b-2 transition-all ${
                  activeTab === 'downloads' ? 'border-red-600 text-red-500' : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Download Packages
              </button>
              <button
                onClick={() => setActiveTab('cast')}
                className={`text-xs font-bold px-3 py-2 border-b-2 transition-all ${
                  activeTab === 'cast' ? 'border-red-600 text-red-500' : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Cast
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
                  {currentMovie.overview || "No synopsis available for this title."}
                </p>

                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Technical Crew</h4>
                  {loading ? (
                    <p className="text-xs text-gray-500 animate-pulse">Loading crew details...</p>
                  ) : crew.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {crew.map((member, i) => (
                        <div key={i} className="bg-gray-900/80 border border-gray-800 p-2.5 rounded-xl">
                          <span className="block text-[9px] text-red-400 font-bold uppercase">{member.job}</span>
                          <span className="text-xs font-bold text-white line-clamp-1">{member.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Credits available on stream.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'downloads' && (
              <div className="space-y-3">
                <div className="bg-gray-900/80 border border-gray-800 p-3 rounded-2xl flex items-center justify-between text-xs">
                  <span className="text-gray-300 font-medium">🛡️ Lifetime Re-download Protection Active</span>
                  <span className="text-[10px] text-gray-400">Never pay twice for a title</span>
                </div>

                {resolutions.map((res, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-gray-700 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">{res.label}</span>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border ${res.badgeClass}`}>
                          {res.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        Size: <span className="text-gray-200 font-semibold">{res.size}</span> • Format: <span className="text-gray-200 font-semibold">{res.format}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                        {res.price}
                      </span>
                      <button
                        onClick={() => handleDownload(res)}
                        className={`text-xs font-extrabold px-4 py-2 rounded-xl transition-all shadow-md ${
                          res.locked
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black'
                            : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                        }`}
                      >
                        {res.locked ? 'Unlock' : 'Download'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'cast' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {cast.map((actor) => (
                  <div key={actor.id} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-2 flex items-center gap-2.5">
                    {actor.profile_path ? (
                      <img 
                        src={`${IMAGE_BASE}${actor.profile_path}`} 
                        alt={actor.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-700" 
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400">
                        {actor.name.charAt(0)}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <span className="block text-xs font-bold text-white line-clamp-1">{actor.name}</span>
                      <span className="block text-[9px] text-gray-400 line-clamp-1">{actor.character}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Related Movies Sidebar */}
          <div className="space-y-3 border-t lg:border-t-0 lg:border-l border-gray-800 pt-4 lg:pt-0 lg:pl-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              Related Movies & Up Next
            </h3>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {relatedMovies.length > 0 ? (
                relatedMovies.map((rel) => (
                  <div 
                    key={rel.id}
                    onClick={() => handleSelectRelated(rel)}
                    className="flex gap-3 bg-gray-900/60 hover:bg-gray-800/80 border border-gray-800/80 hover:border-gray-700 p-2 rounded-2xl cursor-pointer transition-all group"
                  >
                    <div className="relative w-28 aspect-video rounded-xl overflow-hidden bg-black shrink-0">
                      <img 
                        src={`${IMAGE_BASE}${rel.backdrop_path || rel.poster_path}`} 
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                      <span className="absolute bottom-1 right-1 bg-black/80 text-amber-400 text-[8px] font-extrabold px-1 rounded">
                        ★ {rel.vote_average.toFixed(1)}
                      </span>
                    </div>

                    <div className="flex flex-col justify-center overflow-hidden">
                      <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                        {rel.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 mt-0.5">
                        {rel.release_date ? rel.release_date.split('-')[0] : '2026'}
                      </span>
                      <span className="text-[9px] text-emerald-400 font-bold mt-1">
                        Ready to Stream
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 py-4 text-center">Loading related titles...</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
