import React from 'react';
// @ts-ignore
import realLogoImg from '../assets/images/volts_audi_rs6_ultra_logo_1781707134331.jpg';


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
  // Dimensions based on size rating - significantly upscaled as requested for ultra-clarity
  const dimensions = {
    sm: { imgSize: 'h-14 w-14', textTitle: 'text-lg sm:text-xl', textSub: 'text-[9px] sm:text-[10px]' },
    md: { imgSize: 'h-22 w-22', textTitle: 'text-2xl sm:text-3xl', textSub: 'text-[11px] sm:text-[12px]' },
    lg: { imgSize: 'h-32 w-32', textTitle: 'text-3xl sm:text-4xl', textSub: 'text-xs sm:text-sm' },
    xl: { imgSize: 'h-48 w-48', textTitle: 'text-5xl sm:text-6xl', textSub: 'text-sm sm:text-xl' }
  };

  const currentSize = dimensions[size];

  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className}`}>
      {/* High-Definition Realistic Supercar Emblem - Large and crisp */}
      <div className={`relative flex items-center justify-center shrink-0 ${currentSize.imgSize}`}>
        {glow && (
          <>
            {/* Powerful layered real-time ambient neon backlights for high-definition glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 blur-xl rounded-full animate-pulse opacity-90" />
            <div className="absolute -inset-2 bg-red-600/30 blur-lg rounded-full animate-pulse" />
            <div className="absolute inset-1 bg-yellow-400/50 blur-md rounded-full" />
          </>
        )}
        
        {/* Elite Circular Emblem Frame with high contrast thicker borders */}
        <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-3 border-amber-400 hover:border-amber-300 shadow-[0_0_30px_rgba(245,158,11,1)] bg-neutral-950 flex items-center justify-center transition-all duration-300">
          <img
            src={realLogoImg}
            alt="Volts Elétrica - Mecânica"
            className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-115 scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Styled Brand Name Text */}
      {withText && (
        <div className="flex flex-col select-none leading-none text-left">
          <span className={`font-sans font-black tracking-wider text-zinc-100 uppercase italic ${currentSize.textTitle}`}>
            VOLTS
          </span>
          <span className={`font-mono font-bold tracking-[0.12em] text-amber-400 uppercase ${currentSize.textSub} mt-2`}>
            ELÉTRICA - MECÂNICA
          </span>
        </div>
      )}
    </div>
  );
}

