'use client';

import React, { useState } from 'react';

interface WatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: {
    title: string;
    description: string;
    trailerUrl: string;
    subtitles: string[];
    downloadLinks: { quality: string; url: string }[];
  } | null;
}

export default function WatchModal({ isOpen, onClose, movie }: WatchModalProps) {
  const [selectedSubtitle, setSelectedSubtitle] = useState('English');

  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-[#141414] rounded-lg overflow-hidden border border-gray-800 text-white shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black text-white p-2 rounded-full transition"
        >
          ✕
        </button>

        {/* Video Player / Trailer Stream */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={movie.trailerUrl}
            title={movie.title}
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>

        {/* Movie Info & Interactive Options */}
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold">{movie.title}</h2>
          <p className="text-gray-300 text-sm">{movie.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-800 pt-4">
            {/* Subtitle Selector */}
            <div>
              <label className="block text-xs uppercase text-gray-400 font-semibold mb-2">
                Subtitles Package
              </label>
              <select
                value={selectedSubtitle}
                onChange={(e) => setSelectedSubtitle(e.target.value)}
                className="w-full bg-[#222] text-white border border-gray-700 rounded p-2 text-sm focus:outline-none focus:border-red-600"
              >
                {movie.subtitles.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub} Subtitles
                  </option>
                ))}
              </select>
            </div>

            {/* Download Packages */}
            <div>
              <label className="block text-xs uppercase text-gray-400 font-semibold mb-2">
                Download Packages
              </label>
              <div className="flex gap-2">
                {movie.downloadLinks.map((item) => (
                  <a
                    key={item.quality}
                    href={item.url}
                    download
                    className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded text-xs font-semibold transition"
                  >
                    Download ({item.quality})
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}