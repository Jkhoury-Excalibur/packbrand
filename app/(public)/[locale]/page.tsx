import { Package, Mic2, TrendingUp, RefreshCw, Check, Sparkles, Quote, Layers, MapPin, ShieldCheck, Globe, ArrowRight } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations('Home');

  const platformCards = [
    {
      label: 'PACKAGING',
      headingKey: 'packagesTagline' as const,
      detailKey: 'packagesDesc' as const,
      ctaKey: 'packagingCta' as const,
      icon: Package,
      gradient: 'linear-gradient(to bottom right, #A3303F, #8B2635, #5E1A24)',
      iconColor: '#8B2635',
      href: '/packaging' as const,
      status: 'live' as const,
    },
    {
      label: 'DIRECT',
      headingKey: 'directTagline' as const,
      detailKey: 'directDesc' as const,
      ctaKey: 'directCta' as const,
      icon: RefreshCw,
      gradient: 'linear-gradient(to bottom right, #4D6B35, #3D5229, #2A391C)',
      iconColor: '#3D5229',
      href: '/direct' as const,
      status: 'live' as const,
    },
    {
      label: 'GROWTH',
      headingKey: 'growthTagline' as const,
      detailKey: 'growthDesc' as const,
      ctaKey: 'growthCta' as const,
      icon: TrendingUp,
      gradient: 'linear-gradient(to bottom right, #D9A43A, #C8912A, #9A6F1E)',
      iconColor: '#C8912A',
      href: '/growth' as const,
      status: 'live' as const,
    },
    {
      label: 'VOICE',
      headingKey: 'voiceTagline' as const,
      detailKey: 'voiceDesc' as const,
      ctaKey: 'voiceCta' as const,
      icon: Mic2,
      gradient: 'linear-gradient(to bottom right, #5C4278, #4A3463, #33234A)',
      iconColor: '#4A3463',
      href: '/voice' as const,
      status: 'soon' as const,
    },
  ];

  const valueProps = [
    { icon: Layers, titleKey: 'valueTitle1' as const, descKey: 'valueDesc1' as const },
    { icon: MapPin, titleKey: 'valueTitle2' as const, descKey: 'valueDesc2' as const },
    { icon: ShieldCheck, titleKey: 'valueTitle3' as const, descKey: 'valueDesc3' as const },
    { icon: Globe, titleKey: 'valueTitle4' as const, descKey: 'valueDesc4' as const },
  ];

  const testimonials = [
    { quoteKey: 'testimonial1Quote' as const, authorKey: 'testimonial1Author' as const },
    { quoteKey: 'testimonial2Quote' as const, authorKey: 'testimonial2Author' as const },
    { quoteKey: 'testimonial3Quote' as const, authorKey: 'testimonial3Author' as const },
    { quoteKey: 'testimonial4Quote' as const, authorKey: 'testimonial4Author' as const },
    { quoteKey: 'testimonial5Quote' as const, authorKey: 'testimonial5Author' as const },
    { quoteKey: 'testimonial6Quote' as const, authorKey: 'testimonial6Author' as const },
  ];

  return (
    <div className="text-pbs-gray-900 dark:text-pbs-gray-100">

      {/* ================================================================ */}
      {/*  HERO                                                            */}
      {/* ================================================================ */}
      <section className="py-14 lg:py-20 relative overflow-hidden bg-gradient-to-br from-pbs-gray-50 via-white to-pbs-gray-100 dark:from-pbs-gray-950 dark:via-pbs-gray-900 dark:to-pbs-gray-950">
        <div className="absolute top-0 right-0 opacity-[0.04] dark:opacity-[0.06] transform translate-x-24 -translate-y-12 pointer-events-none select-none" aria-hidden="true">
          <Package className="h-[28rem] w-[28rem]" strokeWidth={0.75} />
        </div>
        <div className="absolute bottom-0 left-0 opacity-[0.03] dark:opacity-[0.05] transform -translate-x-16 translate-y-16 pointer-events-none select-none" aria-hidden="true">
          <Sparkles className="h-64 w-64" strokeWidth={0.75} />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-pbs-gray-900 dark:text-white leading-[1.08] tracking-tight">
              {t('newHeroTitle1')}
              <br />
              {t('newHeroTitle2')}
            </h1>

            <p className="mt-5 text-[1.05rem] text-pbs-gray-700 dark:text-pbs-gray-300 leading-relaxed">
              {t('newHeroSubtitle')}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact">
                <Button variant="gold" size="lg">
                  {t('newHeroCta1')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/packaging">
                <Button
                  variant="ghost"
                  size="lg"
                  className="bg-white dark:bg-pbs-gray-800 border border-pbs-gray-300 dark:border-pbs-gray-700 text-pbs-gray-800 dark:text-pbs-gray-100 hover:bg-pbs-gray-100 dark:hover:bg-pbs-gray-700"
                >
                  {t('newHeroCta2')}
                </Button>
              </Link>
            </div>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {(['newHeroCheck3', 'newHeroCheck4'] as const).map((key) => (
                <li key={key} className="flex items-center gap-2 text-sm text-pbs-gray-700 dark:text-pbs-gray-300">
                  <Check className="h-4 w-4 text-pbs-red shrink-0" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF BAR — hidden until client provides real logos/brands */}

      {/* ================================================================ */}
      {/*  PLATFORM SECTION                                                */}
      {/* ================================================================ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">

        <div className="text-center mb-12">
          <div className="flex items-center gap-5 mb-4">
            <div className="flex-1 h-px bg-pbs-gray-300 dark:bg-pbs-gray-700" />
            <h2 className="text-3xl sm:text-4xl font-bold text-pbs-gray-900 dark:text-white whitespace-nowrap">
              {t('platformTitle')}
            </h2>
            <div className="flex-1 h-px bg-pbs-gray-300 dark:bg-pbs-gray-700" />
          </div>
          <p className="text-lg text-pbs-gray-700 dark:text-pbs-gray-300">
            {t('platformSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {platformCards.map((card) => {
            const Icon = card.icon;
            const isSoon = card.status === 'soon';
            return (
              <Link key={card.label} href={card.href} className="group">
                <div className={`bg-white dark:bg-pbs-gray-900 rounded-3xl shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col ${isSoon ? 'opacity-75' : ''}`}>

                  <div
                    className="rounded-t-3xl px-4 pt-5 pb-16 text-white relative overflow-hidden"
                    style={{
                      background: card.gradient,
                      clipPath: 'polygon(0 0, 100% 0, 100% 55%, 0 90%)',
                    }}
                  >
                    <div className="absolute top-0 right-0 opacity-[0.12] transform translate-x-4 -translate-y-2 pointer-events-none" aria-hidden="true">
                      <Icon className="h-24 w-24" strokeWidth={1} />
                    </div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] opacity-70 leading-none relative z-10">
                      PACK BRAND
                    </p>
                    <div className="flex items-end gap-1.5 mt-2 relative z-10">
                      <span className="text-[1.25rem] font-extrabold uppercase tracking-wider leading-tight">
                        {card.label}
                      </span>
                    </div>

                    {isSoon && (
                      <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full z-10">
                        Soon
                      </span>
                    )}
                  </div>

                  <div className="flex justify-center -mt-10 relative z-10 mb-5">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-pbs-gray-900 shadow-lg"
                      style={{ backgroundColor: card.iconColor }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div className="px-4 pb-6 flex-1 flex flex-col">
                    <h3 className="text-[0.9rem] font-bold text-pbs-gray-900 dark:text-white leading-snug">
                      {t(card.headingKey)}
                    </h3>
                    <p className="mt-2 text-sm text-pbs-gray-500 dark:text-pbs-gray-400 leading-relaxed flex-1">
                      {t(card.detailKey)}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-pbs-red group-hover:underline">
                      {t(card.ctaKey)} &rarr;
                    </p>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

      </section>

      {/* ================================================================ */}
      {/*  WHY CHOOSE PACK BRAND — value props                             */}
      {/* ================================================================ */}
      <section className="bg-pbs-gray-50 dark:bg-pbs-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-pbs-gray-900 dark:text-white">
              {t('whyTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((vp) => {
              const VpIcon = vp.icon;
              return (
                <div key={vp.titleKey} className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-pbs-red/10 dark:bg-pbs-red/20 flex items-center justify-center">
                      <VpIcon className="h-6 w-6 text-pbs-red" />
                    </div>
                  </div>
                  <h3 className="font-bold text-pbs-gray-900 dark:text-white text-base">{t(vp.titleKey)}</h3>
                  <p className="mt-2 text-sm text-pbs-gray-500 dark:text-pbs-gray-400 leading-relaxed">{t(vp.descKey)}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================================================================ */}
      {/*  TESTIMONIALS                                                    */}
      {/* ================================================================ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">

        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-pbs-gray-900 dark:text-white">
            {t('testimonialsTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div key={item.quoteKey} className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 flex flex-col">
              <Quote className="h-8 w-8 text-pbs-red/20 mb-4 shrink-0" />
              <p className="text-sm text-pbs-gray-700 dark:text-pbs-gray-300 leading-relaxed italic flex-1">
                &ldquo;{t(item.quoteKey)}&rdquo;
              </p>
              <p className="mt-5 text-sm font-bold text-pbs-gray-900 dark:text-white">
                {t(item.authorKey)}
              </p>
            </div>
          ))}
        </div>

      </section>

      {/* ================================================================ */}
      {/*  CLOSING CTA BANNER                                             */}
      {/* ================================================================ */}
      <section className="bg-gradient-to-br from-pbs-red via-pbs-red-dark to-pbs-black relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-[0.06] transform translate-x-20 -translate-y-10 pointer-events-none select-none" aria-hidden="true">
          <Package className="h-80 w-80" strokeWidth={0.75} />
        </div>

        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 sm:py-20 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {t('closingTitle')}
          </h2>
          <p className="mt-4 text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {t('closingSub')}
          </p>
          <div className="mt-8">
            <Link href="/contact">
              <Button variant="gold" size="lg">
                {t('closingCta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
