import React from "react";

export function TraceCarbonLogo({ className = "", showText = true }: { className?: string, showText?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Visual Logo SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-[48px] max-h-[48px] shrink-0"
      >
        {/* Buildings (Blue) */}
        <path d="M40 25 L40 60 L50 60 L50 25 Z" fill="#2563eb" />
        <path d="M52 18 L52 60 L65 60 L65 18 Z" fill="#1e40af" />
        <path d="M30 35 L30 60 L38 60 L38 35 Z" fill="#3b82f6" />
        {/* Windows */}
        <rect x="33" y="40" width="2" height="2" fill="white" />
        <rect x="33" y="45" width="2" height="2" fill="white" />
        <rect x="33" y="50" width="2" height="2" fill="white" />
        {/* Rubble (Grey) */}
        <path d="M35 60 Q 40 50 45 60 Q 55 55 60 65 Q 50 75 40 70 Z" fill="#9ca3af" />
        {/* Green Recycling Arrow Swoosh */}
        <path d="M 65 35 A 35 35 0 1 0 70 65 L 75 62 L 72 75 L 60 70 L 65 67 A 28 28 0 1 1 58 40" fill="#22c55e" />
        <polygon points="60,38 72,32 68,42" fill="#22c55e" />
      </svg>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="text-2xl font-black tracking-tight leading-none flex items-center">
            <span className="text-[#1e40af]">Trace</span>
            <span className="text-[#65a30d]">Carbon</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-0.5 whitespace-nowrap">
            Measure | Recycle | Reduce
          </span>
        </div>
      )}
    </div>
  );
}
