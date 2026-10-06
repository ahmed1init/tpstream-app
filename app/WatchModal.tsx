'use client';

import React, { useState } from 'react';

interface WatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: {
    title: string;
    description: string;
    trailerUrl: string;
    year: number;
    rating: string;
    genre: string[];
    cast: string[];
    director: string;
  } | null;
  relatedMovies: {
    title: string;
    posterUrl: string;
    year: number;
    genre: string;
  }[];
}

const downloadPackages = [
  { quality: '1080p Full HD', price: '200 KES', resolution: '1920x1080' },
  { quality: '720p HD', price: '100 KES', resolution: '1280x720' },
  { quality: '480p SD', price: '50 KES', resolution: '854x480' },
  { quality: '360p Mobile', price: 'FREE', resolution: '640x360' },
];

const subtitleLanguages = [
  'English',
  'Swahili (Kiswahili)',
  'Arabic (العربية)',
  'Portuguese (Português)',
  'Russian (Русский)',
  'Chinese (中文)',
  'French (Français)',
  'Spanish (Español)',
];

export default function WatchModal({ isOpen, onClose, movie, relatedMovies }: WatchModalProps) {
  const [selectedSub, setSelectedSub] = useState('English');
  const [activeTab, setActiveTab] = useState<'stream' | 'download'>('stream');

  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md overflow-y-auto p-0 md:p-6">
      <div className="relative w-full max-w-7xl bg-[#141414] min-h-screen md:min-h-[85vh] rounded-none md:rounded-xl overflow-hidden border border-gray-800 text-white shadow-2xl flex flex-col">
        
        {/* Top Bar / Close Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            className="bg-black/70 hover:bg-red-600 text-white p-3 rounded-full transition duration-300 shadow-lg"
          >
            ✕
          </button>
        </div>

        {/* Split Screen Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
          
          {/* Left Column: Trailer, Details, Pricing & Subtitles (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col border-r border-gray-800 overflow-y-auto max-h-screen">
            
            {/* Cinematic Trailer Player */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={movie.trailerUrl}
                title={movie.title}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media; loop"
                allowFullScreen
              />
            </div>

            {/* Content Details & Options */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded">
                  {movie.rating}
                </span>
                <span className="text-gray-300 text-sm font-semibold">{movie.year}</span>
                <span className="text-gray-400 text-sm">•</span>
                <div className="flex gap-2">
                  {movie.genre.map((g, i) => (
                    <span key={i} className="text-gray-300 text-sm">{g}{i < movie.genre.length - 1 ? ',' : ''}</span>
                  ))}
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">{movie.title}</h1>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">{movie.description}</p>

              {/* Cast & Crew Info */}
              <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800 space-y-2 text-sm">
                <p><span className="text-gray-400">Director:</span> <span className="text-white font-medium">{movie.director}</span></p>
                <p><span className="text-gray-400">Cast:</span> <span className="text-white font-medium">{movie.cast.join(', ')}</span></p>
              </div>

              {/* Action Tabs: Stream vs Download */}
              <div className="flex border-b border-gray-800">
                <button
                  onClick={() => setActiveTab('stream')}
                  className={`pb-3 px-6 font-semibold text-sm transition border-b-2 ${activeTab === 'stream' ? 'border-red-600 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                  Stream (Ad-Free)
                </button>
                <button
                  onClick={() => setActiveTab('download')}
                  className={`pb-3 px-6 font-semibold text-sm transition border-b-2 ${activeTab === 'download' ? 'border-red-600 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                  Download Packages
                </button>
              </div>

              {/* Subtitle Selector (Global for both Stream & Download) */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold">
                  Subtitle Language Selection
                </label>
                <select
                  value={selectedSub}
                  onChange={(e) => setSelectedSub(e.target.value)}
                  className="w-full bg-[#222] text-white border border-gray-700 rounded-md p-3 text-sm focus:outline-none focus:border-red-600"
                >
                  {subtitleLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang} Subtitles Enabled
                    </option>
                  ))}
                </select>
              </div>

              {/* Tab Content */}
              {activeTab === 'stream' ? (
                <div className="bg-gradient-to-r from-red-950/40 to-black p-6 rounded-lg border border-red-900/50 space-y-4">
                  <h3 className="font-bold text-lg text-white">Dynamic Smooth Streaming Server</h3>
                  <p className="text-xs text-gray-300">High-speed server optimized for buffer-free playback with zero ad interruptions.</p>
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition shadow-lg">
                    Start Full Movie Streaming ({selectedSub} Subtitles)
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Select Download Quality</h3>
                  {downloadPackages.map((pkg) => (
                    <div key={pkg.quality} className="flex items-center justify-between bg-[#1f1f1f] hover:bg-[#282828] p-4 rounded-lg border border-gray-800 transition">
                      <div>
                        <div className="font-bold text-white text-sm">{pkg.quality}</div>
                        <div className="text-xs text-gray-400">{pkg.resolution} • Instant Server Download</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-red-500 font-bold text-sm">{pkg.price}</span>
                        <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded font-bold text-xs transition">
                          {pkg.price === 'FREE' ? 'Download Free' : 'Unlock & Download'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Uninterrupted Related Movie Cards (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0f0f0f] p-6 overflow-y-auto max-h-screen space-y-4 border-t lg:border-t-0 border-gray-800">
            <h3 className="text-lg font-bold tracking-wide text-white mb-4">More Like This</h3>
            <div className="space-y-3">
              {relatedMovies.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center bg-[#181818] hover:bg-[#222] p-3 rounded-lg border border-gray-800 transition cursor-pointer group">
                  <img src={item.posterUrl} alt={item.title} className="w-20 h-28 object-cover rounded shadow group-hover:scale-105 transition" />
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-sm text-white group-hover:text-red-500 transition">{item.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{item.year}</span>
                      <span>•</span>
                      <span>{item.genre}</span>
                    </div>
                    <p className="text-xs text-red-400 font-medium pt-1">Instant Play & Download</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}