import React from 'react';
import { GalaxyButton } from './GalaxyButton';

interface LilyStudioCardProps {
  onOpenLilyStudio?: () => void;
  className?: string;
}

export const LilyStudioCard: React.FC<LilyStudioCardProps> = ({
  onOpenLilyStudio,
  className = '',
}) => {
  return (
    <div
      className={`group relative bg-[#09090b] rounded-[16px] border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 sm:p-8 ${className}`}
    >
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <span className="font-mono-code text-[12px] sm:text-[13px] text-zinc-500 uppercase tracking-widest">
            04 / STUDIO
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono-code font-medium bg-red-950/60 text-red-400 border border-red-800/40 uppercase tracking-wider">
            FEATURED
          </span>
        </div>

        <h3 className="font-biz-mincho text-[28px] sm:text-[34px] font-normal text-white mb-3 tracking-tight">
          LIL<span className="text-[#b91c1c]">Y</span> Studio
        </h3>

        <p className="font-inter text-zinc-400 text-[14px] sm:text-[15px] leading-relaxed mb-6">
          Building LILY Studio, a Design x Development studio that creates beautiful, high-performance digital experiences and interactive applications.
        </p>
      </div>

      <div className="pt-2">
        <GalaxyButton onClick={onOpenLilyStudio} />
      </div>
    </div>
  );
};
