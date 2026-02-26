import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Package, Instagram, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/' as const, label: t('home') },
    { href: '/packaging' as const, label: t('packaging') },
    { href: '/about' as const, label: t('aboutUs') },
    { href: '/contact' as const, label: t('contact') },
  ];

  const productLinks = [
    { href: '/products?category=cups' as const, label: t('customCups') },
    { href: '/products?category=bags' as const, label: t('brandedBags') },
    { href: '/products?category=boxes' as const, label: t('packagingBoxes') },
    { href: '/products?category=food-containers' as const, label: t('foodContainers') },
    { href: '/products?category=labels' as const, label: t('labelsStickers') },
  ];

  return (
    <footer
      className="bg-[#2C2018] text-[#C8B89A]"
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
              <span className="text-xl tracking-tight text-[#F0E8D8]">
                <span className="font-bold text-pbs-red">PACK</span>{' '}
                <span className="font-bold">BRAND</span>{' '}
                <span className="text-sm font-medium text-[#8A7A62]">SOLUTIONS</span>
              </span>
            </Link>
            <p className="text-sm text-[#A89880] leading-relaxed mb-4">
              {t('tagline')}
            </p>
            <p className="text-xs text-pbs-gold font-medium">
              {t('bilingualNote')}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-[#F0E8D8] uppercase tracking-wider mb-4">
              {t('quickLinksTitle')}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A89880] hover:text-pbs-red transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Products */}
          <div>
            <h3 className="text-xs font-bold text-[#F0E8D8] uppercase tracking-wider mb-4">
              {t('productsTitle')}
            </h3>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A89880] hover:text-pbs-red transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-xs font-bold text-[#F0E8D8] uppercase tracking-wider mb-4">
              {t('contactTitle')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+15513893188"
                  className="flex items-start gap-2.5 text-sm text-[#A89880] hover:text-pbs-red transition-colors"
                >
                  <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>(551) 389-3188</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@packbrandsolutions.com"
                  className="flex items-start gap-2.5 text-sm text-[#A89880] hover:text-pbs-red transition-colors"
                >
                  <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>info@packbrandsolutions.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-sm text-[#A89880]">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>22 Ward Street, Hackensack, NJ 07601</span>
                </div>
              </li>
            </ul>

            {/* Social */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.instagram.com/packbrand_solutions"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#3D2E1E] text-[#A89880] hover:bg-pbs-red hover:text-white transition-colors"
                aria-label={t('followInstagram')}
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-[#3D2E1E] pt-6 text-center">
          <p className="text-xs text-[#6B5A42]">
            {t('copyright', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
}
