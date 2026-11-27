import React, { useEffect, useRef, useState } from 'react';

export function MobileTabletView() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Preserve original document title and background styling
    const originalTitle = document.title;
    const originalBodyBg = document.body.style.backgroundColor;
    const originalHtmlBg = document.documentElement.style.backgroundColor;
    const wasDark = document.documentElement.classList.contains('dark');

    // 2. Set Mobile-Tablet (SAMPLE) branding & theme
    document.title = ".rt — Rishav Tandon | Portfolio";
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('mobile-tablet-active');
    document.body.style.backgroundColor = '#f3f3e9';
    document.documentElement.style.backgroundColor = '#f3f3e9';

    // 3. Update favicon for Mobile-Tablet
    const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    const originalFaviconHref = favicon ? favicon.href : '';
    if (favicon) {
      favicon.href = '/Mobile-Tablet/assets/favicon.svg';
    }

    // 4. Bi-directional URL Hash synchronization between top window and iframe
    const handleHashChange = () => {
      try {
        const iframeWin = iframeRef.current?.contentWindow;
        if (iframeWin && iframeWin.location.hash !== window.location.hash) {
          iframeWin.location.hash = window.location.hash;
        }
      } catch {
        // Ignore cross-context security edge-cases
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      // Restore Desktop state on unmount / resize to desktop
      document.title = originalTitle;
      if (wasDark) {
        document.documentElement.classList.add('dark');
      }
      document.documentElement.classList.remove('mobile-tablet-active');
      document.body.style.backgroundColor = originalBodyBg;
      document.documentElement.style.backgroundColor = originalHtmlBg;
      if (favicon && originalFaviconHref) {
        favicon.href = originalFaviconHref;
      }
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Compute initial target source with any existing location hash
  const initialHash = typeof window !== 'undefined' ? window.location.hash : '';
  const iframeSrc = `/Mobile-Tablet/index.html${initialHash}`;

  const handleIframeLoad = () => {
    setIsLoaded(true);

    // Sync hash changes made inside iframe out to top URL
    try {
      const iframeWin = iframeRef.current?.contentWindow;
      if (iframeWin) {
        iframeWin.addEventListener('hashchange', () => {
          if (iframeWin.location.hash !== window.location.hash) {
            window.history.replaceState(null, '', iframeWin.location.hash || window.location.pathname);
          }
        });
      }
    } catch {
      // Same-origin is guaranteed on same host
    }
  };

  return (
    <div
      id="mobile-tablet-viewport-container"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 999999,
        backgroundColor: '#000000',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      <iframe
        ref={iframeRef}
        id="mobile-tablet-frame"
        src={iframeSrc}
        title=".rt — Rishav Tandon | Portfolio (Mobile & Tablet)"
        allow="autoplay; fullscreen"
        onLoad={handleIframeLoad}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          outline: 'none',
          display: 'block',
          backgroundColor: '#000000',
          opacity: 1,
        }}
      />
    </div>
  );
}

