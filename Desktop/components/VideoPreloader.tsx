import React, { useState, useEffect, useRef } from 'react';

interface VideoPreloaderProps {
  onFadeStart: () => void;
  onComplete: () => void;
}

export const VideoPreloader: React.FC<VideoPreloaderProps> = ({ onFadeStart, onComplete }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasEndedRef = useRef(false);

  useEffect(() => {
    // Ensure Caveat font is ready so button appears smoothly in the correct font with zero lag/FOUT
    if (document.fonts && document.fonts.load) {
      document.fonts.load('16px Caveat').then(() => {
        setFontLoaded(true);
      }).catch(() => {
        setFontLoaded(true);
      });
    } else {
      setFontLoaded(true);
    }

    // Lock scrolling on page load while preloader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const videoEl = videoRef.current;
    if (videoEl) {
      // Start muted by default to guarantee instant autoplay in all browsers
      videoEl.muted = true;
      videoEl.volume = 0;
      videoEl.play().catch(() => {});
    }

    return () => {
      document.body.style.overflow = originalOverflow || 'unset';
    };
  }, []);

  // Clicking anywhere toggles between muted and unmuted
  const handleToggleSound = (e?: React.MouseEvent) => {
    if (isFadingOut || isDone || !videoRef.current) return;
    if (e) e.stopPropagation();

    const videoEl = videoRef.current;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    videoEl.muted = nextMuted;
    if (!nextMuted) {
      videoEl.volume = 1.0;
      if (videoEl.paused) {
        videoEl.play().catch(() => {});
      }
    } else {
      videoEl.volume = 0;
    }
  };

  const finishPreloader = () => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;

    // Trigger home screen entrance animations at the exact moment fade-out begins
    setIsFadingOut(true);
    onFadeStart();

    // After smooth fade-out completes, unmount preloader overlay
    setTimeout(() => {
      setIsDone(true);
      onComplete();
    }, 700);
  };

  if (isDone) return null;

  return (
    <div
      id="video-preloader-overlay"
      onClick={handleToggleSound}
      className={`fixed inset-0 w-screen h-screen z-[999999] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-out select-none cursor-pointer ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Fullscreen Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted}
        onEnded={finishPreloader}
        onError={finishPreloader}
        className="w-full h-full object-contain bg-black pointer-events-none"
      >
        <source src="/preload.mp4" type="video/mp4" />
      </video>

      {/* Sound Toggle Text in Bottom-Right Corner: 'click to mute' when sound on, 'click to unmute' when muted */}
      <div
        id="preloader-sound-toggle"
        onClick={handleToggleSound}
        className={`absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 font-caveat font-normal text-[#c01e1e] text-[15px] sm:text-[17px] tracking-wide cursor-pointer select-none hover:brightness-125 transition-opacity duration-300 ${
          fontLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ fontFamily: '"Caveat", cursive', fontWeight: 400 }}
      >
        {isMuted ? 'click to unmute' : 'click to mute'}
      </div>
    </div>
  );
};
