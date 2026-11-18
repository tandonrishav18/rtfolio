import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface GalaxyButtonProps {
  backgroundImage?: string;
  onClick?: () => void;
  className?: string;
}

export const GalaxyButton: React.FC<GalaxyButtonProps> = ({
  backgroundImage = '/fg.png',
  onClick,
  className = '',
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Motion values & physics-based spring for smooth parallax movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { mass: 1, stiffness: 250, damping: 18 });
  const springY = useSpring(mouseY, { mass: 1, stiffness: 250, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Movement multiplier (0.4 for deep responsive parallax tracking)
    mouseX.set((e.clientX - centerX) * 0.4);
    mouseY.set((e.clientY - centerY) * 0.4);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Reset image to center when mouse leaves
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 bg-[#111111] hover:bg-[#151515] text-white font-biz-mincho text-[18px] sm:text-[20px] rounded-[6px] border border-white/20 hover:border-white/40 shadow-sm transition-all duration-300 active:scale-95 cursor-pointer select-none overflow-hidden ${className}`}
    >
      {/* Animated fg.png Background Layer with 90% opacity on hover */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          scale: 1.45,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering ? 0.9 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Button Text Layer: BIZ UDPMincho font, before hover only LILY Studio, on hover arrow slides in */}
      <span className="relative z-10 flex items-center whitespace-nowrap font-biz-mincho text-[18px] sm:text-[20px] tracking-[0.03em]">
        <span className="text-white">LIL</span>
        <span className="text-[#b91c1c]">Y</span>
        <span className="text-white">&nbsp;Studio</span>
        <span
          className={`inline-flex items-center transition-all duration-300 ease-out overflow-hidden ${
            isHovering
              ? 'max-w-[30px] opacity-100 ml-2.5 translate-x-0'
              : 'max-w-0 opacity-0 ml-0 -translate-x-2 pointer-events-none'
          }`}
        >
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
        </span>
      </span>
    </button>
  );
};
