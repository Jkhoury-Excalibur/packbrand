import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Phone, Mail, MapPin, Clock, MessageCircle, Globe } from 'lucide-react';
import { ContactForm } from '@/components/shared/ContactForm';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactContent />;
}

function ContactContent() {
  const t = useTranslations('Contact');

  const contactItems = [
    {
      icon: MessageCircle,
      label: t('whatsappLabel'),
      value: t('whatsappValue'),
      href: 'https://wa.me/15513893188',
      external: true,
    },
    {
      icon: Phone,
      label: t('phoneLabel'),
      value: t('phoneValue'),
      href: 'tel:+15513893188',
      external: false,
    },
    {
      icon: Mail,
      label: t('emailLabel'),
      value: t('emailValue'),
      href: 'mailto:info@packbrandsolutions.com',
      external: false,
    },
    {
      icon: MapPin,
      label: t('addressLabel'),
      value: t('addressValue'),
      href: null,
      external: false,
    },
    {
      icon: Clock,
      label: t('hoursLabel'),
      value: t('hoursValue'),
      href: null,
      external: false,
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5">

      {/* ── PAGE HEADER ── */}
      <div className="bg-gradient-to-br from-pbs-red via-pbs-red-dark to-pbs-black rounded-3xl p-8 sm:p-12 text-white">
        <span className="inline-block bg-white/15 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-white/10 mb-5">
          {t('badge')}
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          {t('title')}
        </h1>
        <p className="text-white/80 text-lg max-w-xl leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      {/* ── FORM + INFO ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Form — takes 2 of 3 cols */}
        <div className="lg:col-span-2 bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl p-8 sm:p-10 border border-pbs-gray-100 dark:border-pbs-gray-800">
          <ContactForm />
        </div>

        {/* Contact info — 1 col */}
        <div className="space-y-4">
          {/* Info card */}
          <div className="bg-pbs-black rounded-3xl p-8 text-white h-full">
            <h2 className="text-xl font-bold mb-2">{t('infoTitle')}</h2>
            <p className="text-pbs-gray-400 text-sm leading-relaxed mb-8">
              {t('infoSubtitle')}
            </p>

            <ul className="space-y-5">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const content = (
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 h-9 w-9 rounded-lg bg-pbs-gray-800 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-pbs-gold" />
                    </div>
                    <div>
                      <div className="text-xs text-pbs-gray-500 font-medium uppercase tracking-wider">
                        {item.label}
                      </div>
                      <div className="text-sm text-pbs-gray-300 mt-0.5">
                        {item.value}
                      </div>
                    </div>
                  </div>
                );

                return (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="hover:opacity-80 transition-opacity block"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Bilingual note */}
            <div className="mt-8 pt-6 border-t border-pbs-gray-800 flex items-center gap-2">
              <Globe className="h-4 w-4 text-pbs-gold" />
              <span className="text-sm text-pbs-gold font-medium">
                {t('bilingualNote')}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
