'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface LanguageToggleProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export function LanguageToggle({
  className,
  variant = 'compact',
}: LanguageToggleProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('Header');
  const otherLocale = locale === 'en' ? 'es' : 'en';

  return (
    <Link
      href={pathname || '/'}
      locale={otherLocale}
      className={cn(
        'flex items-center gap-1 rounded-lg text-sm font-medium transition-colors',
        className,
      )}
      aria-label={t('switchLanguage')}
    >
      <Globe className="h-4 w-4" />
      {variant === 'compact' ? (
        <>
          <span
            className={
              locale === 'en'
                ? 'text-current'
                : 'text-pbs-gray-400 dark:text-pbs-gray-500'
            }
          >
            EN
          </span>
          <span className="text-pbs-gray-300 dark:text-pbs-gray-600">|</span>
          <span
            className={
              locale === 'es'
                ? 'text-current'
                : 'text-pbs-gray-400 dark:text-pbs-gray-500'
            }
          >
            ES
          </span>
        </>
      ) : (
        <>
          <span
            className={
              locale === 'en'
                ? 'text-current'
                : 'text-pbs-gray-400 dark:text-pbs-gray-500'
            }
          >
            English
          </span>
          <span className="text-pbs-gray-300 dark:text-pbs-gray-600 mx-1">
            |
          </span>
          <span
            className={
              locale === 'es'
                ? 'text-current'
                : 'text-pbs-gray-400 dark:text-pbs-gray-500'
            }
          >
            Espa&#241;ol
          </span>
        </>
      )}
    </Link>
  );
}
