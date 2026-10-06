'use client';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}

interface DownloadModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export default function DownloadModal({ movie, onClose }: DownloadModalProps) {
  if (!movie) return null;

  const year = movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 2026;
  const isProRequired = year >= 2026;

  const resolutions = [
    { label: '4K Ultra HD (2160p)', size: '3.8 GB', format: 'MP4 / MKV', requiresPro: true },
    { label: 'Full HD (1080p)', size: '1.9 GB', format: 'MP4', requiresPro: isProRequired },
    { label: 'HD (720p)', size: '850 MB', format: 'MP4', requiresPro: false },
    { label: 'SD (480p - Mobile)', size: '350 MB', format: 'MP4', requiresPro: false },
  ];

  const handleDownload = (resLabel: string, requiresPro: boolean) => {
    if (requiresPro) {
      alert(`The ${resLabel} download requires an active Ksh 200 Pro Pass.`);
    } else {
      alert(`Starting download for ${movie.title} in ${resLabel}...`);
      // Here you attach the actual URL: window.location.href = videoUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#111318] border border-gray-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-900/80 p-2 rounded-full border border-gray-800 transition-colors"
        >
          ✕
        </button>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">
            Download & Stream Options
          </span>
          <h3 className="text-xl font-black text-white">{movie.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">Select your preferred video resolution and file size</p>
        </div>

        <div className="space-y-3">
          {resolutions.map((res, i) => (
            <div 
              key={i}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-900/90 border border-gray-800 hover:border-red-600/60 transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-gray-100">{res.label}</span>
                  {res.requiresPro && (
                    <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                      PRO PASS
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400">{res.size} • {res.format}</span>
              </div>

              <button
                onClick={() => handleDownload(res.label, res.requiresPro)}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
                  res.requiresPro 
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40' 
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
                }`}
              >
                Download
              </button>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-center text-gray-500">
          Downloads are optimized for high-speed offline streaming on TPSTREAM mobile & desktop.
        </p>
      </div>
    </div>
  );
}
