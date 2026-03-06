import { Package, Mic2, TrendingUp, RefreshCw, Check, Sparkles } from 'lucide-react';
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
      icon: Mic2,
      gradient: 'linear-gradient(to bottom right, #5C4278, #4A3463, #33234A)',
      iconColor: '#4A3463',
      href: '/voice' as const,
      status: 'soon' as const,
    },
  ];

  const brands = [
    { name: 'Máxima', sub: 'Empanadas' },
    { name: 'BLOSSOM', sub: 'COSMETICS' },
    { name: 'LA·UNA', sub: '' },
    { name: 'PRESTIGE', sub: '' },
    { name: 'Merina', sub: '' },
  ];

  const whyImages = [
    { label: t('cupsCategoryName'), gradient: 'from-pbs-red to-pbs-red-dark' },
    { label: t('bagsCategoryName'), gradient: 'from-pbs-gray-900 to-pbs-gray-700' },
    { label: t('containersCategoryName'), gradient: 'from-pbs-gold-dark to-pbs-gold' },
    { label: t('boxesCategoryName'), gradient: 'from-pbs-red-light to-pbs-red' },
  ];

  return (
    <div className="text-pbs-gray-900 dark:text-pbs-gray-100">

      {/* ================================================================ */}
      {/*  HERO — full-bleed section, text left, photo right (no box)      */}
      {/* ================================================================ */}
      <section className="py-14 lg:py-20 relative overflow-hidden bg-gradient-to-br from-pbs-gray-50 via-white to-pbs-gray-100 dark:from-pbs-gray-950 dark:via-pbs-gray-900 dark:to-pbs-gray-950">
        {/* Ghosted background elements */}
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
              {(['newHeroCheck1', 'newHeroCheck2', 'newHeroCheck3', 'newHeroCheck4'] as const).map((key) => (
                <li key={key} className="flex items-center gap-2 text-sm text-pbs-gray-700 dark:text-pbs-gray-300">
                  <Check className="h-4 w-4 text-pbs-red shrink-0" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  BRAND LOGOS STRIP                                               */}
      {/* ================================================================ */}
      <section className="bg-pbs-gray-900 dark:bg-pbs-black border-y border-pbs-gray-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          {brands.map((brand) => (
            <div key={brand.name} className="text-center leading-none opacity-50 hover:opacity-80 transition-opacity duration-200">
              <div className="text-lg font-bold text-white tracking-wide">
                {brand.name}
              </div>
              {brand.sub && (
                <div className="text-[9px] font-semibold tracking-[0.18em] text-pbs-gray-400 uppercase mt-0.5">
                  {brand.sub}
                </div>
              )}
            </div>
          ))}
          <span className="text-pbs-gray-500 font-semibold text-base opacity-50">
            {t('brandsMore')}
          </span>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  PLATFORM SECTION                                                */}
      {/* ================================================================ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">

        {/* Section title with ruled lines */}
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

        {/* 4 platform cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {platformCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.label} href={card.href} className="group">
                {/* No overflow-hidden so the icon can visually straddle the diagonal */}
                <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col">

                  {/* Colored section — diagonal cut via clip-path */}
                  <div
                    className="rounded-t-3xl px-4 pt-5 pb-16 text-white relative overflow-hidden"
                    style={{
                      background: card.gradient,
                      clipPath: 'polygon(0 0, 100% 0, 100% 55%, 0 90%)',
                    }}
                  >
                    {/* Ghosted background icon */}
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
                      {card.status === 'soon' && (
                        <span className="text-[9px] font-semibold opacity-70 pb-0.5">
                          (SOON)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Icon — negative margin pulls it up to straddle the diagonal */}
                  <div className="flex justify-center -mt-10 relative z-10 mb-5">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-pbs-gray-900 shadow-lg"
                      style={{ backgroundColor: card.iconColor }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* White body */}
                  <div className="px-4 pb-8 flex-1">
                    <h3 className="text-[0.9rem] font-bold text-pbs-gray-900 dark:text-white leading-snug">
                      {t(card.headingKey)}
                    </h3>
                    <p className="mt-2 text-sm text-pbs-gray-500 dark:text-pbs-gray-400 leading-relaxed">
                      {t(card.detailKey)}
                    </p>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

      </section>

      {/* ================================================================ */}
      {/*  WHY BRANDS INVEST                                               */}
      {/* ================================================================ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">

        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-pbs-gray-900 dark:text-white">
            {t('whyTitle')}
          </h2>
          <p className="mt-3 text-pbs-gray-600 dark:text-pbs-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t('whySubtitle')}
          </p>
        </div>

        {/* 4 product image placeholders — replace divs with <Image> when photos arrive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {whyImages.map((item) => (
            <Link key={item.label} href="/packaging">
              <div className={`rounded-3xl overflow-hidden aspect-square relative bg-gradient-to-br ${item.gradient} shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.15] pointer-events-none select-none">
                  <Package className="h-20 w-20 text-white" strokeWidth={0.75} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-sm font-bold text-white tracking-wide uppercase">
                    {item.label}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </section>

    </div>
  );
}
