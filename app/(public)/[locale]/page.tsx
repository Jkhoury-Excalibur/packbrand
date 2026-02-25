import {
  Package,
  Store,
  Mic2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Phone,
} from 'lucide-react';
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

  const productLines = [
    {
      nameKey: 'packagesName' as const,
      badgeKey: 'packagesBadge' as const,
      taglineKey: 'packagesTagline' as const,
      descKey: 'packagesDesc' as const,
      href: '/packaging' as const,
      icon: Package,
      gradient: 'from-pbs-red via-pbs-red-dark to-pbs-black',
      accentClass: 'text-pbs-gold',
      badgeClass: 'bg-pbs-gold/20 text-pbs-gold border-pbs-gold/30',
      status: 'live' as const,
    },
    {
      nameKey: 'directName' as const,
      badgeKey: 'directBadge' as const,
      taglineKey: 'directTagline' as const,
      descKey: 'directDesc' as const,
      href: '/contact' as const,
      icon: Store,
      gradient: 'from-blue-700 via-blue-900 to-slate-950',
      accentClass: 'text-blue-300',
      badgeClass: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
      status: 'soon' as const,
    },
    {
      nameKey: 'voiceName' as const,
      badgeKey: 'voiceBadge' as const,
      taglineKey: 'voiceTagline' as const,
      descKey: 'voiceDesc' as const,
      href: '/contact' as const,
      icon: Mic2,
      gradient: 'from-violet-700 via-violet-900 to-slate-950',
      accentClass: 'text-violet-300',
      badgeClass: 'bg-violet-400/20 text-violet-300 border-violet-400/30',
      status: 'soon' as const,
    },
    {
      nameKey: 'growthName' as const,
      badgeKey: 'growthBadge' as const,
      taglineKey: 'growthTagline' as const,
      descKey: 'growthDesc' as const,
      href: '/contact' as const,
      icon: TrendingUp,
      gradient: 'from-emerald-700 via-emerald-900 to-slate-950',
      accentClass: 'text-emerald-300',
      badgeClass: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
      status: 'soon' as const,
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 mb-12">

        {/* ================================================================ */}
        {/*  HERO CARD                                                       */}
        {/* ================================================================ */}
        <div className="col-span-1 md:col-span-2 lg:col-span-6 bg-gradient-to-br from-pbs-red via-pbs-red-dark to-pbs-black rounded-3xl p-8 sm:p-10 lg:p-14 text-white flex flex-col justify-between shadow-lg relative overflow-hidden group min-h-[300px] lg:min-h-[340px]">
          <div className="absolute top-0 right-0 opacity-[0.04] transform translate-x-20 -translate-y-20 group-hover:scale-105 transition-transform duration-700" aria-hidden="true">
            <Sparkles className="h-[520px] w-[520px]" strokeWidth={0.5} />
          </div>

          <div className="relative z-10">
            <span className="inline-block bg-white/15 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest backdrop-blur-sm border border-white/10">
              {t('solutionsHeroBadge')}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-6 mb-4 tracking-tight leading-tight">
              {t('solutionsHeroTitle1')}
              <br />
              <span className="text-pbs-gold">{t('solutionsHeroTitle2')}</span>
            </h1>
            <p className="text-white/80 text-lg sm:text-xl max-w-2xl leading-relaxed">
              {t('solutionsHeroDesc')}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-3 mt-8">
            <Link href="/contact">
              <Button variant="gold" size="lg" className="group/btn">
                {t('solutionsGetStarted')}
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/packaging">
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10 border border-white/20 hover:border-white/40"
              >
                {t('solutionsShopPackaging')}
              </Button>
            </Link>
          </div>
        </div>

        {/* ================================================================ */}
        {/*  PRODUCT LINE CARDS  (2 × 2 grid on lg)                         */}
        {/* ================================================================ */}
        {productLines.map((product) => {
          const Icon = product.icon;
          return (
            <Link
              key={product.nameKey}
              href={product.href}
              className="col-span-1 md:col-span-1 lg:col-span-3 group"
            >
              <div
                className={`bg-gradient-to-br ${product.gradient} rounded-3xl p-7 sm:p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col justify-between min-h-[280px] lg:min-h-[300px] relative overflow-hidden hover:-translate-y-1`}
              >
                {/* Background watermark icon */}
                <div
                  className="absolute bottom-0 right-0 opacity-[0.07] transform translate-x-8 translate-y-8 group-hover:scale-110 transition-transform duration-700"
                  aria-hidden="true"
                >
                  <Icon className="h-52 w-52" strokeWidth={0.75} />
                </div>

                <div className="relative z-10">
                  {/* Badge + status row */}
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`inline-flex items-center text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${product.badgeClass}`}
                    >
                      {t(product.badgeKey)}
                    </span>

                    {product.status === 'soon' ? (
                      <span className="text-xs font-semibold text-white/50 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                        {t('solutionsComingSoon')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {t('solutionsLive')}
                      </span>
                    )}
                  </div>

                  {/* Icon */}
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                    <Icon className={`h-6 w-6 ${product.accentClass}`} />
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight">
                    {t(product.nameKey)}
                  </h2>
                  <p className={`text-base font-medium mt-1 ${product.accentClass}`}>
                    {t(product.taglineKey)}
                  </p>
                  <p className="text-white/70 text-sm mt-3 leading-relaxed">
                    {t(product.descKey)}
                  </p>
                </div>

                <div
                  className={`relative z-10 flex items-center gap-1.5 mt-6 text-sm font-medium ${product.accentClass} group-hover:gap-3 transition-all duration-200`}
                >
                  <span>
                    {product.status === 'live'
                      ? t('solutionsExplore')
                      : t('solutionsLearnMore')}
                  </span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}

        {/* ================================================================ */}
        {/*  CTA CARD                                                        */}
        {/* ================================================================ */}
        <div className="col-span-1 md:col-span-2 lg:col-span-6 bg-gradient-to-r from-pbs-red to-pbs-red-dark rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg relative overflow-hidden group">
          <div
            className="absolute top-0 right-0 opacity-[0.08] transform translate-x-20 -translate-y-10 group-hover:scale-105 transition-transform duration-700"
            aria-hidden="true"
          >
            <MessageCircle className="h-64 w-64" strokeWidth={1} />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {t('solutionsCtaTitle')}
              </h3>
              <p className="text-white/80 mt-2 text-base sm:text-lg max-w-xl">
                {t('solutionsCtaDesc')}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/contact">
                <Button variant="gold" size="lg" className="group/btn">
                  {t('solutionsGetQuote')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <a
                href="https://wa.me/15513893188"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10 border border-white/25 hover:border-white/50"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {t('whatsapp')}
                </Button>
              </a>

              <a href="tel:+15513893188">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10 border border-white/25 hover:border-white/50"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  {t('callUs')}
                </Button>
              </a>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
