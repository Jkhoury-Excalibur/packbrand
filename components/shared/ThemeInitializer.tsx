'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Re-applies the stored theme after every client-side navigation.
 * The inline <head> script handles the initial page load; this component
 * handles locale switches and other soft navigations where React reconciles
 * the <html> element and strips the `dark` class.
 */
export function ThemeInitializer() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [pathname]);

  return null;
}
