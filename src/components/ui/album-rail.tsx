import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AlbumRailItem {
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  href?: string;
  accentColor?: string;
}

export interface AlbumRailProps {
  items?: AlbumRailItem[];
  vinyl?: boolean;
  vinylColor?: string;
  accentColor?: string;
  loop?: boolean;
  draggable?: boolean;
  captions?: boolean;
  backgroundColor?: string;
  startIndex?: number;
  className?: string;
  onIndexChange?: (index: number) => void;
  onSelect?: (item: AlbumRailItem, index: number) => void;
}

// 12 boxes matching ruler ticks
export const SAMP_ALBUMS: AlbumRailItem[] = [
  {
    src: '/who/17.png',
    alt: 'GitHub',
    title: 'GitHub',
    subtitle: 'tandonrishav18',
    accentColor: '#ffffff',
  },
  {
    src: '/who/11.png',
    alt: 'Vercel',
    title: 'Vercel',
    accentColor: '#ffffff',
  },
  {
    src: '/who/12.png',
    alt: 'Claude',
    title: 'Claude',
    accentColor: '#d97757',
  },
  {
    src: '/who/13.png',
    alt: 'VS Code',
    title: 'VS Code',
    accentColor: '#38bdf8',
  },
  {
    src: '/who/14.png',
    alt: 'OpenAI',
    title: 'OpenAI',
    accentColor: '#ffffff',
  },
  {
    src: '/who/15.png',
    alt: 'Pinterest',
    title: 'Pinterest',
    accentColor: '#e60023',
  },
  {
    src: '/who/16.png',
    alt: 'Google Antigravity',
    title: 'Google Antigravity',
    accentColor: '#4285f4',
  },
  {
    src: '/who/18.png',
    alt: 'Canva',
    title: 'Canva',
    accentColor: '#00c4cc',
  },
  {
    src: '/who/19.png',
    alt: 'Figma',
    title: 'Figma',
    accentColor: '#a259ff',
  },
  {
    src: '/who/20.png',
    alt: 'GitHub Copilot',
    title: 'GitHub Copilot',
    accentColor: '#ffffff',
  },
  {
    src: '/who/21.png',
    alt: 'Google Gemini',
    title: 'Google Gemini',
    accentColor: '#4285f4',
  },
  {
    src: '/who/ds.png',
    alt: 'Antigravity',
    title: 'Antigravity',
    accentColor: '#4285f4',
  },
];

export const DEFAULT_ALBUM_RAIL_ITEMS = SAMP_ALBUMS;

export const AlbumRail: React.FC<AlbumRailProps> = ({
  items = SAMP_ALBUMS,
  accentColor = '#cc1a1a',
  loop = false,
  draggable = true,
  captions = false,
  backgroundColor = 'transparent',
  startIndex = 5,
  className = '',
  onIndexChange,
  onSelect,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(startIndex);
  const activeIndexRef = useRef<number>(startIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Dragging state for smooth scrub
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const currentDragX = useRef<number>(0);

  const total = items.length;

  const clampTarget = useCallback((target: number) => {
    if (loop) {
      return ((target % total) + total) % total;
    }
    return Math.max(0, Math.min(total - 1, target));
  }, [loop, total]);

  const goToIndex = useCallback((newIdx: number) => {
    const target = clampTarget(newIdx);
    if (target === activeIndexRef.current) return;
    activeIndexRef.current = target;
    setActiveIndex(target);
    if (onIndexChange) onIndexChange(target);
  }, [clampTarget, onIndexChange]);

  const handlePrev = useCallback(() => {
    goToIndex(activeIndexRef.current - 1);
  }, [goToIndex]);

  const handleNext = useCallback(() => {
    goToIndex(activeIndexRef.current + 1);
  }, [goToIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Smooth, responsive wheel scrolling strictly over the cards stack; normal page scroll everywhere else
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    let accumulatedDelta = 0;
    let lastStepTime = 0;
    let lastEventTime = 0;

    const onWheel = (e: WheelEvent) => {
      const targetEl = e.target as HTMLElement | null;
      if (!targetEl || !targetEl.closest('[data-album-card="true"]')) {
        return;
      }

      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 1.5) return;

      const cur = activeIndexRef.current;
      const canStepNext = delta > 0 && (loop || cur < total - 1);
      const canStepPrev = delta < 0 && (loop || cur > 0);

      // Let normal portfolio scroll pass through at the ends of the card stack
      if (!isHorizontal && !canStepNext && !canStepPrev) {
        return;
      }

      // Prevent window page scrolling only while stepping among the cards
      e.preventDefault();

      const now = performance.now();
      if (now - lastEventTime > 140) {
        accumulatedDelta = 0;
      }
      lastEventTime = now;
      accumulatedDelta += delta;

      // Responsive threshold & balanced cooldown for silky continuous stepping
      if (Math.abs(accumulatedDelta) >= 36 && now - lastStepTime >= 165) {
        if (accumulatedDelta > 0) {
          handleNext();
        } else {
          handlePrev();
        }
        lastStepTime = now;
        accumulatedDelta = 0;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [handleNext, handlePrev, loop, total]);

  // Drag handlers on cards stage
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    isDragging.current = true;
    startX.current = e.clientX;
    currentDragX.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    currentDragX.current = e.clientX - startX.current;
    if (currentDragX.current <= -55) {
      handleNext();
      startX.current = e.clientX;
      currentDragX.current = 0;
    } else if (currentDragX.current >= 55) {
      handlePrev();
      startX.current = e.clientX;
      currentDragX.current = 0;
    }
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (currentDragX.current < -32) {
      handleNext();
    } else if (currentDragX.current > 32) {
      handlePrev();
    }
    currentDragX.current = 0;
  };

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: backgroundColor || 'transparent',
      }}
      className={cn(
        "relative w-full py-4 select-none flex flex-col items-center justify-center bg-transparent overflow-visible",
        className
      )}
    >
      {/* 3D Perspective Stage Container */}
      <div 
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={cn(
          "relative w-full max-w-[1200px] h-[210px] sm:h-[250px] md:h-[285px] flex items-center justify-center overflow-visible",
          draggable ? "cursor-grab active:cursor-grabbing" : ""
        )}
        style={{
          perspective: '1300px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Fanned 3D Album Sleeves Stack */}
        <div 
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {items.map((item, index) => {
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;
            const isVisible = absOffset <= 5;

            const sign = Math.sign(offset);

            // Responsive card dimensions & spatial fan spread scaled for smaller boxes
            let xOffset = 0;
            if (absOffset === 1) xOffset = sign * 120;
            else if (absOffset === 2) xOffset = sign * 206;
            else if (absOffset === 3) xOffset = sign * 278;
            else if (absOffset === 4) xOffset = sign * 342;
            else if (absOffset === 5) xOffset = sign * 395;
            else if (absOffset >= 6) xOffset = sign * 440;

            let rotY = 0;
            let rotZ = 0;
            let zDepth = 0;
            let scale = 1;
            let opacity = 1;

            if (!isCenter) {
              rotY = -sign * Math.min(38, 22 + (absOffset - 1) * 5);
              rotZ = sign * Math.min(18, 4 + (absOffset - 1) * 3.2);
              zDepth = -Math.min(420, absOffset * 80);
              scale = Math.max(0.66, 1 - absOffset * 0.08);
              opacity = isVisible ? Math.max(0.28, 1 - absOffset * 0.15) : 0;
            }

            const zIndex = 50 - absOffset * 2;

            return (
              <motion.div
                key={item.src + index}
                initial={false}
                animate={{
                  x: xOffset,
                  z: zDepth,
                  rotateY: rotY,
                  rotateZ: rotZ,
                  scale,
                  opacity,
                }}
                // Smooth interruptible spring physics for lag-free scrolling
                transition={{
                  type: 'spring',
                  stiffness: 230,
                  damping: 27,
                  mass: 0.85,
                }}
                style={{
                  zIndex,
                  transformStyle: 'preserve-3d',
                  transformOrigin: '50% 100%',
                  backfaceVisibility: 'hidden',
                  willChange: 'transform, opacity',
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
                onClick={(e) => {
                  if (!isVisible) return;
                  e.stopPropagation();
                  goToIndex(index);
                  if (onSelect) onSelect(item, index);
                }}
                className={cn(
                  "absolute",
                  isVisible ? "cursor-pointer" : "pointer-events-none"
                )}
              >
                {/* Album Card */}
                <div
                  data-album-card={isVisible ? 'true' : undefined}
                  className="relative w-[136px] h-[136px] sm:w-[170px] sm:h-[170px] md:w-[200px] md:h-[200px] rounded-[12px] sm:rounded-[15px] md:rounded-[18px] overflow-hidden"
                >
                  <img
                    src={item.src}
                    alt={item.alt || item.title || 'Album cover'}
                    className="w-full h-full object-cover select-none pointer-events-none block"
                    loading="eager"
                    decoding="async"
                    draggable={false}
                  />

                  <div 
                    className={cn(
                      "absolute inset-0 pointer-events-none transition-opacity duration-300",
                      isCenter ? "opacity-0" : "opacity-100",
                      sign < 0 
                        ? "bg-gradient-to-r from-transparent via-transparent to-black/35" 
                        : "bg-gradient-to-l from-transparent via-transparent to-black/35"
                    )} 
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Control Ruler */}
      <div className="w-full mt-7 sm:mt-9 flex items-center justify-center gap-5 sm:gap-7 z-30 select-none">
        {/* Left Arrow < */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          disabled={activeIndex === 0}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Previous album"
          className={cn(
            "p-1.5 text-[#6b6b6b] hover:text-[#cc1a1a] transition-colors cursor-pointer select-none active:scale-90 flex items-center justify-center shrink-0 focus:outline-none",
            activeIndex === 0 ? "opacity-20 cursor-not-allowed" : "opacity-100"
          )}
        >
          <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.6]" />
        </button>

        {/* Needle Ticks */}
        <div 
          className="flex items-center justify-center gap-3 sm:gap-3.5 md:gap-4 h-7"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {items.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.src + idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToIndex(idx);
                }}
                aria-label={`Jump to album ${idx + 1}`}
                className="group py-2 px-0.5 cursor-pointer flex items-center justify-center focus:outline-none"
              >
                <div
                  style={{
                    backgroundColor: isActive ? accentColor : undefined,
                  }}
                  className={cn(
                    "transition-all duration-200",
                    isActive 
                      ? "w-[2px] h-[18px] bg-[#cc1a1a]" 
                      : "w-[1.5px] h-[12px] bg-[#4a4a4a] group-hover:bg-[#888888]"
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Right Arrow > */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          disabled={activeIndex === total - 1}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Next album"
          className={cn(
            "p-1.5 text-[#6b6b6b] hover:text-[#cc1a1a] transition-colors cursor-pointer select-none active:scale-90 flex items-center justify-center shrink-0 focus:outline-none",
            activeIndex === total - 1 ? "opacity-20 cursor-not-allowed" : "opacity-100"
          )}
        >
          <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.6]" />
        </button>
      </div>

      {/* Optional Captions */}
      {captions && items[activeIndex] && (
        <div className="w-full max-w-[500px] text-center mt-4 z-30">
          <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {items[activeIndex].title}
          </h4>
          {items[activeIndex].subtitle && (
            <p className="text-xs sm:text-sm font-mono-code text-neutral-400 mt-0.5">
              {items[activeIndex].subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

