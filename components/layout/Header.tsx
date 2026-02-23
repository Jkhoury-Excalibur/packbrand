'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, Menu, Globe } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { MobileNav } from './MobileNav';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // Placeholder cart count - will be connected to Zustand store later
  const cartCount = 0;

  return (
    <>
      {/* Red accent line */}
      <div className="h-1 bg-pbs-red" aria-hidden="true" />

      <header
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pbs-gray-200 dark:bg-pbs-gray-950/95 dark:border-pbs-gray-800"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                type="button"
                className="lg:hidden p-2 rounded-lg text-pbs-gray-700 hover:bg-pbs-gray-100 dark:text-pbs-gray-300 dark:hover:bg-pbs-gray-800 transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 group"
                aria-label="Pack Brand Solutions - Home"
              >
                <Package className="h-7 w-7 text-pbs-red group-hover:scale-110 transition-transform" />
                <span className="text-xl tracking-tight font-light text-pbs-gray-900 dark:text-white">
                  PACK<span className="font-bold">BRAND</span>
                </span>
              </Link>
            </div>

            {/* Center: Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    'text-pbs-gray-600 hover:text-pbs-red hover:bg-pbs-gray-50',
                    'dark:text-pbs-gray-400 dark:hover:text-pbs-red-light dark:hover:bg-pbs-gray-800',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Language toggle placeholder */}
              <button
                type="button"
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-pbs-gray-600 hover:text-pbs-red hover:bg-pbs-gray-50 dark:text-pbs-gray-400 dark:hover:text-pbs-red-light dark:hover:bg-pbs-gray-800 transition-colors"
                aria-label="Switch language"
              >
                <Globe className="h-4 w-4" />
                <span>EN</span>
                <span className="text-pbs-gray-300 dark:text-pbs-gray-600">|</span>
                <span className="text-pbs-gray-400 dark:text-pbs-gray-500">ES</span>
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-lg text-pbs-gray-700 hover:text-pbs-red hover:bg-pbs-gray-50 dark:text-pbs-gray-300 dark:hover:text-pbs-red-light dark:hover:bg-pbs-gray-800 transition-colors"
                aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
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

      {/* Mobile navigation drawer */}
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
      />
    </>
  );
}
