import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { Navbar } from './Navbar';

interface LilyStudioWebpageProps {
  isOpen: boolean;
  onClose: () => void;
  onNavClick?: (href: string) => void;
  onOpenResume?: () => void;
}

interface LilyInteractiveButtonProps {
  normalImage: string;
  hoverOverlayImage: string;
  className?: string;
  style: React.CSSProperties;
  onClick?: () => void;
  ariaLabel: string;
}

const LilyInteractiveButton: React.FC<LilyInteractiveButtonProps> = ({
  normalImage,
  hoverOverlayImage,
  className = '',
  style,
  onClick,
  ariaLabel,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Motion values & physics-based spring for smooth parallax movement (identical to LILY Studio GalaxyButton)
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
      aria-label={ariaLabel}
      style={style}
      className={`group absolute z-20 overflow-hidden cursor-pointer select-none rounded-[6px] sm:rounded-[8px] active:scale-95 transition-transform duration-200 ${className}`}
    >
      {/* 1. Base Layer (Normal State): Pristine original button with exact spelling, formatting & arrow */}
      <img
        src={normalImage}
        alt={ariaLabel}
        className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0"
      />

      {/* 2. Hover Layer: Background becomes /fg.png galaxy with spring parallax, exact text & arrow preserved */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="absolute inset-0 bg-[#000000] overflow-hidden pointer-events-none z-10"
      >
        {/* Animated Parallax Starry Galaxy Layer (/fg.png) */}
        <motion.div
          style={{
            x: springX,
            y: springY,
            scale: 1.45,
            backgroundImage: 'url(/fg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className="absolute inset-0 pointer-events-none opacity-90 z-0"
        />

        {/* Exact Button Overlay (keeps original border, typography, and arrow with transparent bg) */}
        <img
          src={hoverOverlayImage}
          alt=""
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-10"
        />
      </motion.div>
    </button>
  );
};

export const LilyStudioWebpage: React.FC<LilyStudioWebpageProps> = ({ 
  isOpen, 
  onClose,
  onNavClick,
  onOpenResume,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reel2Ref = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
      if (reel2Ref.current) {
        reel2Ref.current.play().catch(() => {});
      }
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      if (reel2Ref.current) {
        reel2Ref.current.pause();
        reel2Ref.current.currentTime = 0;
      }
      setIsMenuOpen(false);
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  const handleNavClick = (href: string) => {
    onClose();
    if (onNavClick) {
      onNavClick(href);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: isOpen ? 'none' : 'opacity 0.2s ease-out, visibility 0.2s ease-out',
      }}
      aria-hidden={!isOpen}
      className="fixed inset-0 z-50 bg-[#000000] text-white overflow-y-auto overflow-x-hidden selection:bg-red-600 selection:text-white"
    >
      {/* Top Navbar in same place, style, and way as throughout the portfolio */}
      <Navbar 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onOpenResume={onOpenResume}
        onNavClick={handleNavClick}
        isStatic={true}
      />

      {/* Back Arrow Button (Clean chevron arrow with green hover - identical to project pages) */}
      <div className="fixed top-5 sm:top-6 left-5 sm:left-8 z-[60]">
        <button 
          type="button"
          onClick={onClose}
          className="group flex items-center justify-center p-1.5 bg-transparent transition-colors duration-200 cursor-pointer select-none border-0 shadow-none outline-none"
          aria-label="Back to Portfolio"
        >
          <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:text-[#c7ff8b] stroke-[3] transition-colors duration-200" />
        </button>
      </div>

      {/* Main Webpage Canvas - Significantly reduced top gap to navbar */}
      <div className="w-full flex flex-col items-center bg-[#000000] pt-[56px] sm:pt-[46px] md:pt-[40px] lg:pt-[44px] pb-24 sm:pb-32">
        <div className="w-full max-w-[1920px] relative">
          <picture>
            <source srcSet="/LILY.webp" type="image/webp" />
            <img
              src="/LILY.webp"
              alt="LILY Studio"
              className="w-full h-auto block select-none"
              loading="eager"
              decoding="async"
            />
          </picture>

          {/* LILY Studio Reel Video Overlay (Replacing VIDEOOOOO) */}
          <div
            style={{
              left: '7.8125%',
              top: '7.0661%',
              width: '84.375%',
              height: '11.4463%',
            }}
            className="absolute z-10 overflow-hidden bg-black flex items-center justify-center pointer-events-none select-none"
          >
            <video
              ref={videoRef}
              src="/reel1.mp4"
              muted
              loop
              playsInline
              preload="auto"
              onCanPlay={(e) => {
                if (isOpen) {
                  e.currentTarget.play().catch(() => {});
                }
              }}
              disablePictureInPicture
              controls={false}
              className="w-full h-full object-cover block"
            />
          </div>

          {/* Interactive Button 1: VIEW OUR SOCIAL PRESENCE */}
          <LilyInteractiveButton
            normalImage="/btn1_tight.png"
            hoverOverlayImage="/btn1_hover_overlay.png"
            ariaLabel="View Our Social Presence"
            style={{
              left: '32.5%',
              top: '32.252%',
              width: '35%',
              height: '2.025%',
            }}
            onClick={() => {
              window.open(
                'https://www.instagram.com/lily.studio_hq?obrf=M2M3aWl4ZjBzNzAw&utm_source=qr',
                '_blank',
                'noopener,noreferrer'
              );
            }}
          />

          {/* LILY Studio Cathedral Video Overlay (Replacing photo with reel2.mp4) */}
          <div
            style={{
              left: '7.6562%',
              top: '58.8223%',
              width: '84.7917%',
              height: '21.5289%',
            }}
            className="absolute z-10 overflow-hidden bg-black flex items-center justify-center pointer-events-none select-none"
          >
            <video
              ref={reel2Ref}
              src="/reel2.mp4"
              muted
              loop
              playsInline
              preload="auto"
              onCanPlay={(e) => {
                if (isOpen) {
                  e.currentTarget.play().catch(() => {});
                }
              }}
              disablePictureInPicture
              controls={false}
              className="w-full h-full object-cover block"
            />
          </div>

              {/* Text Above Cathedral Video */}
              <div
                style={{
                  left: '10%',
                  top: '61.5%',
                  width: '80%',
                }}
                className="absolute z-20 pointer-events-none select-none flex flex-col items-center justify-center text-center"
              >
                <p className="font-biz-mincho text-white text-[19px] sm:text-[28px] md:text-[38px] lg:text-[46px] leading-[1.35] tracking-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
                  Somewhere between the unreal<br />
                  and the inevitable, LILY awaits.
                </p>
              </div>

              {/* Interactive Button 2: ENTER LILY STUDIO */}
              <LilyInteractiveButton
                normalImage="/btn2_tight.png"
                hoverOverlayImage="/btn2_hover_overlay.png"
                ariaLabel="Enter LILY Studio"
                style={{
                  left: '36.354%',
                  top: '67.397%',
                  width: '27.292%',
                  height: '2.231%',
                }}
                onClick={() => {
                  window.open(
                    'https://lily-studio-delta.vercel.app',
                    '_blank',
                    'noopener,noreferrer'
                  );
                }}
              />

              {/* Credit Text: ART BY: JUAN MANUEL SANABIRA in Geist Bold, aligned from x=1294 to right edge of artwork collage */}
              <div 
                style={{ left: '67.3958%', width: '20.104%', top: '99.09%' }}
                className="absolute text-white font-geist font-bold text-[8px] sm:text-[11px] md:text-[13.5px] lg:text-[14px] tracking-[0.15em] select-none whitespace-nowrap uppercase"
              >
                ART BY: JUAN MANUEL SANABIRA
              </div>
            </div>
          </div>
        </div>
      );
    };
