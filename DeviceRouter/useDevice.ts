import { useState, useEffect } from 'react';

export type DeviceType = 'phone' | 'tablet' | 'desktop';

export interface DeviceInfo {
  deviceType: DeviceType;
  isDesktop: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isMobileOrTablet: boolean;
  width: number;
  height: number;
}

/**
 * Accurately determines the device category based on responsive viewport width
 * and device capabilities (touch / user agent).
 *
 * Categories:
 * - phone: width < 768px
 * - tablet: 768px <= width < 1024px (or touch device with width <= 1024px)
 * - desktop: width >= 1024px (laptops, desktops, large screens)
 */
export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'desktop',
      isDesktop: true,
      isMobile: false,
      isTablet: false,
      isMobileOrTablet: false,
      width: 1440,
      height: 900,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  // Check touch capabilities & tablet indicators
  const isTouch = typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 1 || 'ontouchstart' in window);
  const isTabletUA = typeof navigator !== 'undefined' && /iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent);

  let deviceType: DeviceType;

  if (width < 768) {
    deviceType = 'phone';
  } else if (width < 1024 || (isTabletUA && width <= 1366) || (isTouch && width <= 1024)) {
    deviceType = 'tablet';
  } else {
    deviceType = 'desktop';
  }

  const isDesktop = deviceType === 'desktop';
  const isMobile = deviceType === 'phone';
  const isTablet = deviceType === 'tablet';
  const isMobileOrTablet = isMobile || isTablet;

  return {
    deviceType,
    isDesktop,
    isMobile,
    isTablet,
    isMobileOrTablet,
    width,
    height,
  };
}

export function useDevice(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => getDeviceInfo());

  useEffect(() => {
    let timeoutId: number | null = null;

    const handleResize = () => {
      // Small debounce / rAF to ensure smooth resize performance without lag
      if (timeoutId) {
        cancelAnimationFrame(timeoutId);
      }
      timeoutId = requestAnimationFrame(() => {
        setDeviceInfo(getDeviceInfo());
      });
    };

    // Listen to resize, orientationchange, and media query breakpoint
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    const mqlDesktop = window.matchMedia('(min-width: 1024px)');
    const mqlTablet = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');

    const handleMediaChange = () => {
      setDeviceInfo(getDeviceInfo());
    };

    try {
      mqlDesktop.addEventListener('change', handleMediaChange);
      mqlTablet.addEventListener('change', handleMediaChange);
    } catch {
      // Fallback for older browsers
      mqlDesktop.addListener(handleMediaChange);
      mqlTablet.addListener(handleMediaChange);
    }

    // Initial check
    setDeviceInfo(getDeviceInfo());

    return () => {
      if (timeoutId) {
        cancelAnimationFrame(timeoutId);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      try {
        mqlDesktop.removeEventListener('change', handleMediaChange);
        mqlTablet.removeEventListener('change', handleMediaChange);
      } catch {
        mqlDesktop.removeListener(handleMediaChange);
        mqlTablet.removeListener(handleMediaChange);
      }
    };
  }, []);

  return deviceInfo;
}

