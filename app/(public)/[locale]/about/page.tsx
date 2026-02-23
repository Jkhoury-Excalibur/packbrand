import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  Package,
  Truck,
  Users,
  Star,
} from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations('About');
  const tHome = useTranslations('Home');

  const stats = [
    { value: t('statsBrands'), label: t('statsBrandsLabel') },
    { value: t('statsYears'), label: t('statsYearsLabel') },
    { value: t('statsStates'), label: t('statsStatesLabel') },
    { value: t('statsDesigns'), label: t('statsDesignsLabel') },
  ];

  const values = [
    { icon: Package,    titleKey: 'whyLowMinimumsTitle' as const, descKey: 'whyLowMinimumsDesc' as const },
    { icon: Truck,      titleKey: 'whyFastDeliveryTitle' as const, descKey: 'whyFastDeliveryDesc' as const },
    { icon: Users,      titleKey: 'whyBilingualTitle' as const,    descKey: 'whyBilingualDesc' as const },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5">

      {/* ── HERO ── */}
      <div className="bg-gradient-to-br from-pbs-red via-pbs-red-dark to-pbs-black rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-[0.06] translate-x-16 -translate-y-16" aria-hidden="true">
          <Package className="h-80 w-80" strokeWidth={1} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block bg-white/15 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-white/10 mb-6">
            {t('badge')}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-8">
            {t('heroDescription')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact">
              <Button variant="gold" size="lg">
                {t('getStarted')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="ghost" size="lg" className="text-white hover:bg-white/10 border border-white/20 hover:border-white/40">
                {t('learnMore')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl p-6 sm:p-8 border border-pbs-gray-100 dark:border-pbs-gray-800 text-center"
          >
            <div className="text-4xl sm:text-5xl font-black text-pbs-gray-900 dark:text-white tracking-tight">
              {stat.value}
            </div>
            <div className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400 mt-2">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── STORY + MISSION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Story */}
        <div className="bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl p-8 sm:p-10 border border-pbs-gray-100 dark:border-pbs-gray-800">
          <span className="text-xs font-bold text-pbs-red uppercase tracking-widest">
            {t('storyBadge')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-pbs-gray-900 dark:text-white mt-3 mb-5 tracking-tight">
            {t('storyTitle')}
          </h2>
          <p className="text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed mb-4">
            {t('storyText1')}
          </p>
          <p className="text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            {t('storyText2')}
          </p>
          {/* Stars */}
          <div className="flex items-center gap-1.5 mt-6 pt-6 border-t border-pbs-gray-200 dark:border-pbs-gray-700">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-pbs-gold fill-pbs-gold" />
            ))}
            <span className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 ml-1">
              1000+ satisfied clients
            </span>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-pbs-black rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden">
          <div className="absolute bottom-0 right-0 opacity-[0.07] translate-x-8 translate-y-8" aria-hidden="true">
            <Package className="h-48 w-48" strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <span className="text-xs font-bold text-pbs-gold uppercase tracking-widest">
              {t('missionBadge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-3 mb-5 tracking-tight">
              {t('missionTitle')}
            </h2>
            <p className="text-pbs-gray-400 leading-relaxed text-lg">
              {t('missionText')}
            </p>
          </div>
        </div>
      </div>

      {/* ── VALUES ── */}
      <div className="bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl p-8 sm:p-10 border border-pbs-gray-100 dark:border-pbs-gray-800">
        <div className="mb-8">
          <span className="text-xs font-bold text-pbs-red uppercase tracking-widest">
            {t('valuesBadge')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-pbs-gray-900 dark:text-white mt-3 tracking-tight">
            {t('valuesTitle')}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.titleKey} className="flex items-start gap-4">
                <div className="shrink-0 h-11 w-11 rounded-xl bg-pbs-red/10 dark:bg-pbs-red/20 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-pbs-red" />
                </div>
                <div>
                  <h3 className="font-semibold text-pbs-gray-900 dark:text-white">
                    {tHome(v.titleKey)}
                  </h3>
                  <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400 mt-1 leading-relaxed">
                    {tHome(v.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-gradient-to-r from-pbs-red to-pbs-red-dark rounded-3xl p-8 sm:p-12 text-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          {t('ctaTitle')}
        </h2>
        <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
          {t('ctaDescription')}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/contact">
            <Button variant="gold" size="lg">
              {t('ctaButton')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="ghost" size="lg" className="text-white hover:bg-white/10 border border-white/20 hover:border-white/40">
              {t('ctaSecondary')}
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}
