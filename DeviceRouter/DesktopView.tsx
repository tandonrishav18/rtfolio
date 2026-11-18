import React, { useEffect } from 'react';
import DesktopApp from '../Desktop/App';

export function DesktopView() {
  useEffect(() => {
    // Ensure desktop environment settings
    document.title = "Rishav's portfolio";
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('mobile-tablet-active');
    document.body.style.backgroundColor = '#131313';
    document.documentElement.style.backgroundColor = '#131313';

    // Restore desktop favicon
    const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    if (favicon && !favicon.href.includes('favicon.ico') && !favicon.href.includes('favicon-32x32.png')) {
      favicon.href = '/favicon.ico?v=2';
    }
  }, []);

  return <DesktopApp />;
}

