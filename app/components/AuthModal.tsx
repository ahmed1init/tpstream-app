'use client';

import { useState } from 'react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    localStorage.setItem('tpstream_user_email', email);
    onSuccess(email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c0d12] border border-gray-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl space-y-5">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-sm"
        >
          ✕
        </button>

        <div className="space-y-1 text-center">
          <h3 className="text-xl font-black text-white uppercase tracking-wider">Join TP<span className="text-red-600">STREAM</span></h3>
          <p className="text-xs text-gray-400">Enter your email to become an official member</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase font-bold text-gray-400 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-lg"
          >
            Become a Member
          </button>
        </form>
      </div>
    </div>
  );
}
