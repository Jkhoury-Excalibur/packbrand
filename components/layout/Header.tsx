'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import {
  Package,
  ShoppingBag,
  Menu,
  UserCircle,
  ChevronDown,
  RefreshCw,
  TrendingUp,
  Mic2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { MobileNav } from './MobileNav';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useCartStore } from '@/lib/store/cart';

type SubLink = {
  href: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  badge?: string;
};

type NavLink = {
  href: string;
  label: string;
  sublinks?: SubLink[];
};

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const t = useTranslations('Header');
  const cartItems = useCartStore((s) => s.items);

  useEffect(() => { setMounted(true); }, []);

  const cartCount = mounted ? cartItems.length : 0;

  const solutions: SubLink[] = [
    {
      href: '/packaging',
      label: t('solPackagingLabel'),
      desc: t('solPackagingDesc'),
      icon: Package,
      color: '#E63946',
    },
    {
      href: '/direct',
      label: t('solDirectLabel'),
      desc: t('solDirectDesc'),
      icon: RefreshCw,
      color: '#3D5229',
    },
    {
      href: '/growth',
      label: t('solGrowthLabel'),
      desc: t('solGrowthDesc'),
      icon: TrendingUp,
      color: '#C8912A',
    },
    {
      href: '/voice',
      label: t('solVoiceLabel'),
      desc: t('solVoiceDesc'),
      icon: Mic2,
      color: '#4A3463',
      badge: t('soonBadge'),
    },
  ];

  const navLinks: NavLink[] = [
    { href: '/', label: t('home') },
    {
      href: '/packaging',
      label: t('solutions'),
      sublinks: solutions,
    },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-white border-b border-pbs-gray-200 dark:bg-pbs-gray-950/95 dark:border-pbs-gray-800"
        role="banner"
      >
        <div className="h-1 bg-pbs-red" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="lg:hidden p-2 rounded-lg text-pbs-gray-700 hover:bg-pbs-gray-100 dark:text-pbs-gray-300 dark:hover:bg-pbs-gray-800 transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label={t('openMenu')}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
              >
                <Menu className="h-6 w-6" />
              </button>

              <Link
                href="/"
                className="flex items-center gap-2 group"
                aria-label="Packbrand Solutions - Home"
              >
                <Package className="h-7 w-7 text-pbs-red group-hover:scale-110 transition-transform" />
                <span className="text-xl tracking-tight text-pbs-gray-900 dark:text-white">
                  <span className="font-bold text-pbs-red">PACK</span>{' '}
                  <span className="font-bold">BRAND</span>{' '}
                  <span className="font-bold text-pbs-red">SOLUTIONS</span>
                </span>
              </Link>
            </div>

            {/* Center: Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => {
                if (link.sublinks) {
                  return (
                    <div
                      key={link.href}
                      className="relative"
                      onMouseEnter={() => setProductsOpen(true)}
                      onMouseLeave={() => setProductsOpen(false)}
                    >
                      {/* Trigger */}
                      <button
                        type="button"
                        className={cn(
                          'inline-flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors',
                          'text-pbs-gray-600 hover:text-pbs-gray-900',
                          'dark:text-pbs-gray-400 dark:hover:text-white',
                        )}
                        aria-expanded={productsOpen}
                        aria-haspopup="menu"
                      >
                        {link.label}
                        <ChevronDown
                          className={cn(
                            'h-3.5 w-3.5 shrink-0 transition-transform duration-200',
                            productsOpen && 'rotate-180',
                          )}
                        />
                      </button>

                      {/* Dropdown panel */}
                      <div
                        className={cn(
                          'absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 transition-all duration-200',
                          productsOpen
                            ? 'opacity-100 translate-y-0 pointer-events-auto'
                            : 'opacity-0 translate-y-1 pointer-events-none',
                        )}
                        role="menu"
                      >
                        <div className="bg-white dark:bg-pbs-gray-900 rounded-2xl shadow-xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-2 w-72">
                          {link.sublinks.map((sub) => {
                            const Icon = sub.icon;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href as any}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-pbs-gray-50 dark:hover:bg-pbs-gray-800 transition-colors group/item"
                                onClick={() => setProductsOpen(false)}
                                role="menuitem"
                              >
                                <div
                                  className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: sub.color + '18' }}
                                >
                                  <Icon className="h-4 w-4" style={{ color: sub.color }} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-pbs-gray-900 dark:text-white leading-tight">
                                      {sub.label}
                                    </span>
                                    {sub.badge && (
                                      <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-pbs-gold/15 text-pbs-gold-dark">
                                        {sub.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mt-0.5 leading-tight">
                                    {sub.desc}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href as any}
                    className={cn(
                      'px-4 py-2 text-sm font-medium transition-colors',
                      'text-pbs-gray-600 hover:text-pbs-gray-900',
                      'dark:text-pbs-gray-400 dark:hover:text-white',
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              <LanguageToggle
                variant="compact"
                className="hidden sm:flex px-3 py-1.5 text-pbs-gray-600 hover:text-pbs-red hover:bg-pbs-gray-50 dark:text-pbs-gray-400 dark:hover:text-pbs-red-light dark:hover:bg-pbs-gray-800"
              />

              <Link
                href="/account"
                className="p-2 rounded-lg text-pbs-gray-700 hover:text-pbs-red hover:bg-pbs-gray-50 dark:text-pbs-gray-300 dark:hover:text-pbs-red-light dark:hover:bg-pbs-gray-800 transition-colors"
                aria-label={t('myAccount')}
              >
                <UserCircle className="h-5 w-5" />
              </Link>

              <Link
                href="/cart"
                className="relative p-2 rounded-lg text-pbs-gray-700 hover:text-pbs-red hover:bg-pbs-gray-50 dark:text-pbs-gray-300 dark:hover:text-pbs-red-light dark:hover:bg-pbs-gray-800 transition-colors"
                aria-label={cartCount > 0 ? t('cartWithItems', { count: cartCount }) : t('cart')}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-pbs-red text-white text-xs font-bold rounded-full flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
      />
    </>
  );
}
