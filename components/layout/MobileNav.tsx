'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Package, X, UserCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { LanguageToggle } from '@/components/shared/LanguageToggle';

type SubLink = {
  href: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  badge?: string;
};

interface NavLink {
  readonly href: string;
  readonly label: string;
  readonly sublinks?: readonly SubLink[];
}

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  links: readonly NavLink[];
}

export function MobileNav({ open, onClose, links }: MobileNavProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [expandedHref, setExpandedHref] = useState<string | null>(null);
  const t = useTranslations('MobileNav');

  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
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
        aria-label={t('dialogLabel')}
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 max-w-[80vw] bg-white dark:bg-pbs-gray-950 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-pbs-gray-200 dark:border-pbs-gray-800">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={onClose}
            aria-label="Packbrand Solutions - Home"
          >
            <Package className="h-6 w-6 text-pbs-red" />
            <span className="text-lg tracking-tight font-light text-pbs-gray-900 dark:text-white">
              PACK <span className="font-bold">BRAND</span>{' '}
              <span className="text-xs font-medium text-pbs-gray-400 dark:text-pbs-gray-500">SOLUTIONS</span>
            </span>
          </Link>

          <button
            ref={closeButtonRef}
            type="button"
            className="p-2 rounded-lg text-pbs-gray-500 hover:text-pbs-red hover:bg-pbs-gray-100 dark:text-pbs-gray-400 dark:hover:bg-pbs-gray-800 transition-colors"
            onClick={onClose}
            aria-label={t('closeMenu')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="p-4" aria-label={t('navLabel')}>
          <ul className="space-y-1">
            {links.map((link) => {
              if (link.sublinks) {
                const isExpanded = expandedHref === link.href;
                return (
                  <li key={link.href}>
                    {/* Accordion trigger */}
                    <button
                      type="button"
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium text-pbs-gray-700 hover:text-pbs-red hover:bg-pbs-gray-50 dark:text-pbs-gray-300 dark:hover:text-pbs-red-light dark:hover:bg-pbs-gray-800 transition-colors"
                      onClick={() =>
                        setExpandedHref(isExpanded ? null : link.href)
                      }
                      aria-expanded={isExpanded}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform duration-200',
                          isExpanded && 'rotate-180',
                        )}
                      />
                    </button>

                    {/* Sub-links */}
                    {isExpanded && (
                      <ul className="mt-1 ml-4 space-y-1">
                        {link.sublinks.map((sub) => {
                          const Icon = sub.icon;
                          return (
                            <li key={sub.href}>
                              <Link
                                href={sub.href as any}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-pbs-gray-50 dark:hover:bg-pbs-gray-800 transition-colors"
                                onClick={onClose}
                              >
                                <div
                                  className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: sub.color + '18' }}
                                >
                                  <Icon className="h-4 w-4" style={{ color: sub.color }} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-pbs-gray-900 dark:text-white">
                                      {sub.label}
                                    </span>
                                    {sub.badge && (
                                      <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-pbs-gold/15 text-pbs-gold-dark">
                                        {sub.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mt-0.5">
                                    {sub.desc}
                                  </p>
                                </div>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href as any}
                    className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-pbs-gray-700 hover:text-pbs-red hover:bg-pbs-gray-50 dark:text-pbs-gray-300 dark:hover:text-pbs-red-light dark:hover:bg-pbs-gray-800 transition-colors"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* My Account */}
        <div className="px-4 mt-2">
          <Link
            href="/account"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-pbs-gray-700 hover:text-pbs-red hover:bg-pbs-gray-50 dark:text-pbs-gray-300 dark:hover:text-pbs-red-light dark:hover:bg-pbs-gray-800 transition-colors"
            onClick={onClose}
          >
            <UserCircle className="h-5 w-5" />
            My Account
          </Link>
        </div>

        {/* Language toggle */}
        <div className="px-4 mt-4">
          <div className="border-t border-pbs-gray-200 dark:border-pbs-gray-800 pt-4">
            <LanguageToggle
              variant="full"
              className="px-4 py-3 rounded-xl text-pbs-gray-600 hover:text-pbs-red hover:bg-pbs-gray-50 dark:text-pbs-gray-400 dark:hover:text-pbs-red-light dark:hover:bg-pbs-gray-800 w-full"
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-pbs-red" aria-hidden="true" />
      </div>
    </>
  );
}
