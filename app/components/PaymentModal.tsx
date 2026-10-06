'use client';

import { useState } from 'react';

interface PaymentModalProps {
  amount: number;
  tierLabel: string;
  onClose: () => void;
}

export default function PaymentModal({ amount, tierLabel, onClose }: PaymentModalProps) {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      alert('Please enter a valid phone number');
      return;
    }
    setStatus('processing');
    setTimeout(() => {
      localStorage.setItem('tpstream_pro_subscribed', 'true');
      setStatus('success');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b0c10] border border-gray-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl space-y-6">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold"
        >
          ✕
        </button>

        <div className="space-y-2 text-center">
          <span className="bg-amber-500/10 text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/20">
            {tierLabel}
          </span>
          <h3 className="text-xl font-black text-white">Unlock Pro Streaming</h3>
          <p className="text-xs text-gray-400">Secure instant access to downloads & full HD streaming for Ksh {amount}</p>
        </div>

        {status === 'idle' && (
          <form onSubmit={handlePay} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-medium">M-Pesa Phone Number</label>
              <input
                type="text"
                placeholder="0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-600/20"
            >
              Pay Ksh {amount} via M-Pesa
            </button>
          </form>
        )}

        {status === 'processing' && (
          <div className="py-8 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-300">STK Push sent to {phone}. Please enter your M-Pesa PIN...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</div>
            <h4 className="text-base font-bold text-white">Pro Pass Active!</h4>
            <p className="text-xs text-gray-400">Your subscription is active. You can now stream and download without limits.</p>
            <button
              onClick={onClose}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
            >
              Start Watching
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
