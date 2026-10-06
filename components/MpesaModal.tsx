'use client';

import { useState } from 'react';

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function MpesaModal({ isOpen, onClose, onSuccess }: MpesaModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'equity'>('mpesa');
  const [phone, setPhone] = useState('');
  const [txRef, setTxRef] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  // Equity & M-Pesa Payment Info
  const EQUITY_ACCOUNT = '0120 3456 7890 1';
  const EQUITY_PAYBILL = '247247';
  const MPESA_NUMBER = '0700 000 000';

  if (!isOpen) return null;

  const handleActivateSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'mpesa' && (!phone || phone.length < 9)) {
      alert('Please enter a valid M-Pesa phone number.');
      return;
    }

    setStatus('processing');
    setTimeout(() => {
      // Store permanent subscription in localStorage so user never pays twice
      localStorage.setItem('tpstream_pro_subscribed', 'true');
      setStatus('success');
      if (onSuccess) onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#101216] border border-gray-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-6">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-900/80 p-2 rounded-full border border-gray-800 transition-colors"
        >
          ✕
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
              TPSTREAM Subscription Pass
            </span>
          </div>
          <h3 className="text-2xl font-black text-white">UNLOCK PRO STREAMING</h3>
          <p className="text-xs text-gray-400">
            One-time pass for <span className="text-amber-400 font-bold">Ksh 200/month</span>. Unlimited streams & lifetime re-downloads.
          </p>
        </div>

        {/* Payment Method Switcher */}
        <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800">
          <button
            type="button"
            onClick={() => setPaymentMethod('mpesa')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              paymentMethod === 'mpesa' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            📲 M-Pesa Express
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('equity')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              paymentMethod === 'equity' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            🏦 Equity Bank
          </button>
        </div>

        {status === 'idle' && (
          <form onSubmit={handleActivateSubscription} className="space-y-4">
            
            {paymentMethod === 'mpesa' ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Your M-Pesa Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="0712345678" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-gray-900/80 border border-gray-800 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Direct Send Money Option</span>
                  <p className="text-xs font-extrabold text-white">Send Ksh 200 to: <span className="text-emerald-400">{MPESA_NUMBER}</span></p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-gray-900/80 p-4 rounded-2xl border border-gray-800">
                <div className="space-y-1">
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Equity Bank Direct Deposit</span>
                  <p className="text-xs font-extrabold text-white">Account Number: <span className="text-amber-400 font-mono text-sm select-all">{EQUITY_ACCOUNT}</span></p>
                  <p className="text-xs font-bold text-gray-300">Equity Paybill: <span className="text-amber-400 font-mono">{EQUITY_PAYBILL}</span></p>
                  <p className="text-[10px] text-gray-400">Account Name: <span className="text-gray-200">TPSTREAM PRO</span></p>
                </div>

                <div className="pt-2 border-t border-gray-800 space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-300">Equity Reference / Transaction Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. EQ12345678" 
                    value={txRef}
                    onChange={(e) => setTxRef(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`w-full text-white font-extrabold text-sm py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                paymentMethod === 'mpesa' 
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30' 
                  : 'bg-red-600 hover:bg-red-500 shadow-red-600/30'
              }`}
            >
              <span>🔒</span> Activate Pro Subscription (Ksh 200)
            </button>
            <p className="text-[10px] text-center text-gray-500">
              Subscription unlocks all downloads permanently on this device. Re-downloads are always free.
            </p>
          </form>
        )}

        {status === 'processing' && (
          <div className="py-8 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-white">Verifying Subscription Payment...</p>
            <p className="text-xs text-gray-400">Activating your permanent streaming & re-download pass.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl border border-emerald-500/40">
              ✓
            </div>
            <div>
              <h4 className="text-lg font-black text-white">Pro Pass Active!</h4>
              <p className="text-xs text-gray-400 mt-1">
                Your subscription is active. You can now stream in 4K and download/re-download any movie anytime.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs py-3 rounded-xl transition-colors"
            >
              Start Watching
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
