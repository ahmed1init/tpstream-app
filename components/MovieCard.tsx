'use client';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export default function MovieCard({ movie, onSelect }: MovieCardProps) {
  const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
  const year = movie.release_date ? movie.release_date.split('-')[0] : '2026';

  return (
    <div
      onClick={() => onSelect(movie)}
      className="group relative bg-[#101216] rounded-2xl overflow-hidden border border-gray-800/80 hover:border-red-600/60 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-600/10 flex flex-col"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">
        {movie.poster_path ? (
          <img
            src={`${IMAGE_BASE}${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs text-gray-500 font-bold">
            {movie.title}
          </div>
        )}

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Rating Star Badge */}
        <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md text-amber-400 border border-gray-800 text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md">
          ★ {movie.vote_average ? movie.vote_average.toFixed(1) : '6.5'}
        </div>

        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/50 scale-90 group-hover:scale-100 transition-transform">
            <span className="text-xl ml-0.5">▶</span>
          </div>
        </div>
      </div>

      {/* Card Information */}
      <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
        <h3 className="text-xs font-extrabold text-white group-hover:text-red-500 transition-colors line-clamp-1">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-[10px] text-gray-400">
          <span>{year}</span>
          <span className="text-gray-500 font-medium">HD</span>
        </div>
      </div>
    </div>
  );
}
