import React from 'react';

export default function MovieDetailsModal({ movie, onClose }: { movie: any; onClose: () => void }) {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-3xl bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black text-white p-2 rounded-full transition"
        >
          ✕
        </button>
        <div className="relative h-80 w-full">
          <img src={movie.banner || movie.poster} alt={movie.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
        </div>
        <div className="p-6">
          <h2 className="text-3xl font-bold text-white mb-2">{movie.title}</h2>
          <div className="flex items-center space-x-4 text-sm text-zinc-400 mb-4">
            <span className="bg-red-600 text-white px-2 py-0.5 rounded font-semibold">{movie.match || '98% Match'}</span>
            <span>{movie.year || '2026'}</span>
            <span className="border border-zinc-700 px-1.5 py-0.5 rounded">{movie.rating || 'HD'}</span>
          </div>
          <p className="text-zinc-300 mb-6 leading-relaxed">{movie.description || movie.synopsis || 'Experience thrilling entertainment in high definition.'}</p>
          <div className="flex space-x-4">
            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition">
              <span>▶ Play Movie</span>
            </button>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-semibold transition">
              + My List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
