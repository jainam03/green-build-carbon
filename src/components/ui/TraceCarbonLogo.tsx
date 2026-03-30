import React from "react";

export function TraceCarbonLogo({ className = "", showText = true }: { className?: string, showText?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 
        This img tag points to the new logo. 
        Please place the logo file you shared in the 'public/' directory and name it 'logo.png' 
      */}
      {/* We wrap the logo in a clean white rounded pill to make the white background of the image look intentional and polished even on dark pages. */}
      <div className="bg-white rounded-2xl flex items-center justify-center px-4 py-2 shadow-sm border border-slate-100/50">
        <img 
          src="/logo.png" 
          alt="TraceCarbon" 
          // We increased the base height and used a clever mix-blend trick 
          // to make the image's white background merge perfectly with the wrapper.
          className="h-[45px] sm:h-[60px] w-auto shrink-0 object-contain mix-blend-multiply scale-[1.2]" 
        />
      </div>

      {/* 
        NOTE: Since your new logo image already includes the "TraceCarbon" text and the 
        "Measure | Recycle | Reduce" tagline, I've commented out the HTML text below. 
        If you only export the 'T' icon as the image, you can uncomment this text.
      */}
      {/* {showText && (
        <div className="flex flex-col justify-center">
          <div className="text-2xl font-black tracking-tight leading-none flex items-center">
            <span className="text-[#1e40af]">Trace</span>
            <span className="text-[#65a30d]">Carbon</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-0.5 whitespace-nowrap">
            Measure | Recycle | Reduce
          </span>
        </div>
      )} */}
    </div>
  );
}
