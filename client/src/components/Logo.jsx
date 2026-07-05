import React from 'react';

export default function Logo({ size = 24 }) {
  return (
    <div className="flex items-center gap-2 font-display select-none">
      <div 
        style={{ width: size, height: size }} 
        className="rounded-lg bg-gradient-to-tr from-brand-rose via-brand-blue to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-blue/20"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="3" 
          className="w-4 h-4 animate-pulse"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 17l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="font-extrabold tracking-tight text-white font-mono uppercase text-sm">
        Pathvora<span className="text-brand-cyan"> CareerGuide</span>
      </span>
    </div>
  );
}
