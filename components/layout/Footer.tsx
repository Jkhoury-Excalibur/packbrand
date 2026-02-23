import Link from 'next/link';
import { Package, Instagram, Phone, Mail, MapPin } from 'lucide-react';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
] as const;

const productLinks = [
  { href: '/products?category=cups', label: 'Custom Cups' },
  { href: '/products?category=bags', label: 'Branded Bags' },
  { href: '/products?category=boxes', label: 'Packaging Boxes' },
  { href: '/products?category=food-containers', label: 'Food Containers' },
  { href: '/products?category=labels', label: 'Labels & Stickers' },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-pbs-gray-900 text-pbs-gray-300 dark:bg-pbs-black"
      role="contentinfo"
    >
      {/* Red accent line */}
      <div className="h-1 bg-pbs-red" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-10">
          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="Pack Brand Solutions - Home">
              <Package className="h-7 w-7 text-pbs-red" />
              <span className="text-xl tracking-tight font-light text-white">
                PACK<span className="font-bold">BRAND</span>
              </span>
            </Link>
            <p className="text-sm text-pbs-gray-400 leading-relaxed mb-4">
              We Dress Brands for Success. Premium custom-branded packaging for
              restaurants, food trucks, and food & beverage brands across the United
              States.
            </p>
            <p className="text-xs text-pbs-gold font-medium">
              Bilingual service in English & Spanish
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-pbs-gray-400 hover:text-pbs-red-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Products */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Products
            </h3>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-pbs-gray-400 hover:text-pbs-red-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+15513893188"
                  className="flex items-start gap-2.5 text-sm text-pbs-gray-400 hover:text-pbs-red-light transition-colors"
                >
                  <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>(551) 389-3188</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@packbrandsolutions.com"
                  className="flex items-start gap-2.5 text-sm text-pbs-gray-400 hover:text-pbs-red-light transition-colors"
                >
                  <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>info@packbrandsolutions.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-sm text-pbs-gray-400">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>22 Ward Street, Hackensack, NJ 07601</span>
                </div>
              </li>
            </ul>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.instagram.com/packbrand_solutions"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-pbs-gray-800 text-pbs-gray-400 hover:bg-pbs-red hover:text-white transition-colors"
                aria-label="Follow Pack Brand Solutions on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-pbs-gray-800 pt-6 text-center">
          <p className="text-xs text-pbs-gray-500">
            &copy; {currentYear} Pack Brand Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
