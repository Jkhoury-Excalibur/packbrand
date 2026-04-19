'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const HASH = '87c5196e6e3eac73a66937a46659de1a';

declare global {
  interface Window {
    beTracker?: { t: (opts: { hash: string }) => void };
  }
}

export function MetricoolTracker() {
  const pathname = usePathname();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current && window.beTracker) {
      window.beTracker.t({ hash: HASH });
    }
  }, [pathname]);

  return (
    <Script
      id="metricool-tracker"
      src="https://tracker.metricool.com/resources/be.js"
      strategy="afterInteractive"
      onLoad={() => {
        loaded.current = true;
        window.beTracker?.t({ hash: HASH });
      }}
    />
  );
}
