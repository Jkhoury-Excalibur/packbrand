'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  // Avoid hydration mismatch — render nothing until mounted
  if (!mounted) return <div className="h-8 w-8" />;

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'p-2 rounded-lg transition-colors',
        'text-pbs-gray-600 hover:text-pbs-red hover:bg-pbs-gray-50',
        'dark:text-pbs-gray-400 dark:hover:text-pbs-red-light dark:hover:bg-pbs-gray-800',
        className,
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
