'use client';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
}

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie, e: React.MouseEvent) => void;
}

export default function MovieCard({ movie, onSelectMovie, isFavorite, onToggleFavorite }: MovieCardProps) {
  return (
    <div 
      onClick={() => onSelectMovie(movie)}
      className="group relative flex-none w-[160px] sm:w-[200px] bg-zinc-900 rounded-md overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:z-20 hover:shadow-2xl border border-zinc-800/80"
    >
      {/* Movie Poster Image */}
      <div className="aspect-[2/3] w-full relative bg-zinc-950 overflow-hidden">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
          alt={movie.title || movie.name}
          className="w-full h-full object-cover object-center group-hover:opacity-90 transition-opacity"
          loading="lazy"
        />
        
        {/* Favorite Icon Overlay */}
        <button
          onClick={(e) => onToggleFavorite(movie, e)}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
            isFavorite ? 'bg-red-600 text-white' : 'bg-black/60 text-white hover:bg-black'
          }`}
          title="Save to Favorites"
        >
          {isFavorite ? '♥' : '♡'}
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-400 flex items-center gap-1">
          <span>★</span> {movie.vote_average}
        </div>
      </div>

      {/* Title bar */}
      <div className="p-2.5 bg-[#181818]">
        <h4 className="text-xs font-bold text-white truncate">{movie.title || movie.name}</h4>
        <div className="flex items-center justify-between mt-1 text-[10px] text-zinc-400 font-medium">
          <span>TP Stream HD</span>
          <span className="text-red-500 font-semibold">Play</span>
        </div>
      </div>
    </div>
  );
}
