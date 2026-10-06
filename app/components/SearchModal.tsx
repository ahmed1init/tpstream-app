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

interface SearchModalProps {
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
}

export default function SearchModal({ onClose, onSelectMovie }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

  useEffect(() => {
    if (!query.trim() || !API_KEY) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const cleanQuery = query.trim();
        let combinedResults: Movie[] = [];

        // If typing single/short query, discover by starting letter + multi-search fallback
        if (cleanQuery.length === 1) {
          const letter = cleanQuery.toUpperCase();
          const [movieRes, tvRes] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${letter}&page=1&sort_by=popularity.desc`),
            fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${letter}&page=1&sort_by=popularity.desc`)
          ]);

          const movieData = await movieRes.json();
          const tvData = await tvRes.json();

          const movies = (movieData.results || []).map((m: any) => ({ ...m, media_type: 'movie' }));
          const tvs = (tvData.results || []).map((t: any) => ({ ...t, media_type: 'tv' }));

          // Combine and sort alphabetically by title
          combinedResults = [...movies, ...tvs].sort((a, b) => {
            const titleA = (a.title || a.name || '').toLowerCase();
            const titleB = (b.title || b.name || '').toLowerCase();
            return titleA.localeCompare(titleB);
          });
        } else {
          const res = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(cleanQuery)}&page=1&include_adult=false`
          );
          const data = await res.json();
          combinedResults = (data.results || []).filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');
        }

        setResults(combinedResults);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, API_KEY]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start justify-center pt-12 p-4">
      <div className="bg-[#0b0c10] border border-gray-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]">
        
        {/* Header Search Input */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between gap-3 bg-gray-950">
          <input
            type="text"
            autoFocus
            placeholder="Type any letter or title (e.g. A, B, Avatar, Breaking Bad)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-red-600 text-sm shadow-inner"
          />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white px-3 py-2 text-sm font-bold bg-gray-900 border border-gray-800 rounded-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading && <p className="text-xs text-gray-400 text-center py-6">Organizing titles from global database...</p>}

          {!loading && results.length === 0 && query.trim() !== '' && (
            <p className="text-xs text-gray-500 text-center py-6">No matching titles found for "{query}".</p>
          )}

          {!loading && query.trim() === '' && (
            <div className="text-center py-10 text-gray-500 space-y-1">
              <p className="text-sm font-semibold text-gray-400">Search Millions of Movies & TV Series</p>
              <p className="text-xs">Type a single letter like <span className="text-red-500 font-bold">A</span>, <span className="text-red-500 font-bold">B</span>, or <span className="text-red-500 font-bold">C</span> to browse titles alphabetically.</p>
            </div>
          )}

          {results.map((item) => (
            <div
              key={`${item.media_type}-${item.id}`}
              onClick={() => {
                onSelectMovie(item);
                onClose();
              }}
              className="flex items-center gap-3.5 bg-gray-900/60 hover:bg-gray-800/90 p-2.5 rounded-xl border border-gray-800/80 hover:border-red-600/60 cursor-pointer transition-all"
            >
              <img
                src={item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : 'https://via.placeholder.com/100x150'}
                alt={item.title || item.name}
                className="w-12 h-16 object-cover rounded-lg shrink-0 shadow"
              />
              <div className="overflow-hidden flex-1">
                <h4 className="text-sm font-bold text-white truncate">{item.title || item.name}</h4>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                  <span className={`uppercase font-bold px-1.5 py-0.5 rounded ${item.media_type === 'tv' ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-red-950 text-red-400 border border-red-800'}`}>
                    {item.media_type === 'tv' ? 'Series' : 'Movie'}
                  </span>
                  <span>•</span>
                  <span className="text-amber-400 font-bold">★ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
                  <span>•</span>
                  <span>{(item.release_date || item.first_air_date || '').split('-')[0] || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
