import React from 'react';
// @ts-ignore
import realLogoImg from '../assets/images/faisca_real_logo_1781039780150.png';


interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  glow?: boolean;
}

export default function Logo({
  className = '',
  size = 'md',
  withText = true,
  glow = true
}: LogoProps) {
  // Dimensions based on size rating - configured as perfect circular aspects
  const dimensions = {
    sm: { imgSize: 'h-9 w-9', textTitle: 'text-base sm:text-lg', textSub: 'text-[8px] sm:text-[9px]' },
    md: { imgSize: 'h-12 w-12', textTitle: 'text-lg sm:text-xl', textSub: 'text-[10px] sm:text-[11px]' },
    lg: { imgSize: 'h-20 w-20', textTitle: 'text-xl sm:text-3xl', textSub: 'text-xs sm:text-sm' },
    xl: { imgSize: 'h-36 w-36', textTitle: 'text-4xl sm:text-5xl', textSub: 'text-sm sm:text-lg' }
  };

  const currentSize = dimensions[size];

  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className}`}>
      {/* High-Definition Realistic Supercar Emblem */}
      <div className={`relative flex items-center justify-center shrink-0 ${currentSize.imgSize}`}>
        {glow && (
          <>
            {/* Powerful layered real-time ambient neon backlights */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 blur-lg rounded-full animate-pulse opacity-85" />
            <div className="absolute -inset-1 bg-red-500/25 blur-md rounded-full" />
            <div className="absolute inset-1.5 bg-yellow-400/40 blur-sm rounded-full" />
          </>
        )}
        
        {/* Elite Circular Emblem Frame */}
        <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.8)] bg-neutral-950 flex items-center justify-center">
          <img
            src={realLogoImg}
            alt="Faísca Elétrica - Mecânica"
            className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Styled Brand Name Text */}
      {withText && (
        <div className="flex flex-col select-none leading-none text-left">
          <span className={`font-sans font-black tracking-wider text-zinc-105 uppercase italic ${currentSize.textTitle}`}>
            FAÍSCA
          </span>
          <span className={`font-mono font-bold tracking-[0.1em] text-amber-500 uppercase ${currentSize.textSub} mt-1.5`}>
            ELÉTRICA - MECÂNICA
          </span>
        </div>
      )}
    </div>
  );
}

