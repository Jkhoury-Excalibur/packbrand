'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Package, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NavLink {
  readonly href: string;
  readonly label: string;
}

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  links: readonly NavLink[];
}

export function MobileNav({ open, onClose, links }: MobileNavProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Trap focus inside the drawer when open
  useEffect(() => {
    if (open) {
      // Focus the close button when the drawer opens
      closeButtonRef.current?.focus();

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 max-w-[80vw] bg-white dark:bg-pbs-gray-950 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between p-4 border-b border-pbs-gray-200 dark:border-pbs-gray-800">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={onClose}
            aria-label="Pack Brand Solutions - Home"
          >
            <Package className="h-6 w-6 text-pbs-red" />
            <span className="text-lg tracking-tight font-light text-pbs-gray-900 dark:text-white">
              PACK<span className="font-bold">BRAND</span>
            </span>
          </Link>

          <button
            ref={closeButtonRef}
            type="button"
            className="p-2 rounded-lg text-pbs-gray-500 hover:text-pbs-red hover:bg-pbs-gray-100 dark:text-pbs-gray-400 dark:hover:bg-pbs-gray-800 transition-colors"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="p-4" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-pbs-gray-700 hover:text-pbs-red hover:bg-pbs-gray-50 dark:text-pbs-gray-300 dark:hover:text-pbs-red-light dark:hover:bg-pbs-gray-800 transition-colors"
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Language toggle */}
        <div className="px-4 mt-4">
          <div className="border-t border-pbs-gray-200 dark:border-pbs-gray-800 pt-4">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-pbs-gray-600 hover:text-pbs-red hover:bg-pbs-gray-50 dark:text-pbs-gray-400 dark:hover:text-pbs-red-light dark:hover:bg-pbs-gray-800 transition-colors w-full"
              aria-label="Switch language"
            >
              <Globe className="h-4 w-4" />
              <span>English</span>
              <span className="text-pbs-gray-300 dark:text-pbs-gray-600 mx-1">|</span>
              <span className="text-pbs-gray-400 dark:text-pbs-gray-500">Espanol</span>
            </button>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-pbs-red" aria-hidden="true" />
      </div>
    </>
  );
}
