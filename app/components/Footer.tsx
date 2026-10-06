'use client';

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#07080a] border-t border-gray-800/80 text-gray-400 text-xs py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-black text-red-600">TP</span>
            <span className="text-lg font-extrabold text-white">STREAM</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Your premier destination for high-definition streaming, trailers, and instant content discovery.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Navigation</h4>
          <ul className="space-y-2 text-[11px]">
            <li><a href="#" className="hover:text-red-500 transition-colors">Popular Movies</a></li>
            <li><a href="#" className="hover:text-red-500 transition-colors">Top TV Series</a></li>
            <li><a href="#" className="hover:text-red-500 transition-colors">Trending Now</a></li>
            <li><a href="#" className="hover:text-red-500 transition-colors">Go PRO Access</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Legal & DMCA</h4>
          <ul className="space-y-2 text-[11px]">
            <li><a href="#" className="hover:text-red-500 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-red-500 transition-colors">DMCA Disclaimer</a></li>
            <li><a href="#" className="hover:text-red-500 transition-colors">Contact Support</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">System Status</h4>
          <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span>API Gateway:</span>
              <span className="text-emerald-400 font-bold">● Operational</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span>Streaming Servers:</span>
              <span className="text-emerald-400 font-bold">● 3 Mirrors Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 border-t border-gray-800/60 text-center text-[10px] text-gray-500">
        © {new Date().getFullYear()} TPSTREAM. All rights reserved. Content provided via public indexing API services.
      </div>
    </footer>
  );
}
