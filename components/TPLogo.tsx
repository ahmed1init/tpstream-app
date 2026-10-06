'use client';

export default function TPLogo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <div className="relative inline-flex items-center justify-center group cursor-pointer">
      <img 
        src="/logo.png" 
        alt="" 
        className={`object-contain transition-all duration-500 group-hover:scale-110 animate-logo-pulse ${className}`}
      />
    </div>
  );
}
