'use client';

import React, { useState } from 'react';
import WatchModal from './WatchModal';

interface Movie {
  title: string;
  description: string;
  trailerUrl: string;
  subtitles: string[];
  downloadLinks: { quality: string; url: string }[];
  posterUrl: string;
}

const sampleMovies: Movie[] = [
  {
    title: 'Fall 2: Deadpoint',
    description: 'High-altitude survival continuation. Climbers test their limits with immersive sound and high-tension sequences.',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
    subtitles: ['English', 'Swahili', 'French', 'Spanish'],
    downloadLinks: [
      { quality: '720p', url: '#' },
      { quality: '1080p', url: '#' },
      { quality: '4K', url: '#' },
    ],
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
  },
  // Add more movies here as needed
];

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  return (
    <main className="min-h-screen bg-[#141414] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Trending Now</h1>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sampleMovies.map((movie, index) => (
          <div
            key={index}
            onClick={() => setSelectedMovie(movie)}
            className="cursor-pointer group relative rounded-md overflow-hidden bg-gray-900 transition-transform duration-300 hover:scale-105 hover:z-10 shadow-lg"
          >
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity"
            />
            <div className="p-3 bg-gradient-to-t from-black via-black/60 to-transparent">
              <h3 className="font-semibold text-sm">{movie.title}</h3>
              <p className="text-xs text-red-500 font-medium">Click to Play & Download</p>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Trailer, Subtitles & Download Modal */}
      <WatchModal
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
        movie={selectedMovie}
      />
    </main>
  );
}