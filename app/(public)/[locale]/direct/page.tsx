import {
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Globe,
  Database,
  Truck,
  MessageCircle,
} from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { DirectInquiryForm } from '@/components/shared/DirectInquiryForm';

// Direct brand greens — matches the DIRECT card on the homepage
const GREEN = '#4D6B35';
const GREEN_MID = '#3D5229';
const GREEN_DARK = '#2A391C';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DirectPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DirectContent />;
}

function DirectContent() {
  const t = useTranslations('Direct');

  const features = [
    { icon: Globe, titleKey: 'feat1Title' as const, descKey: 'feat1Desc' as const },
    { icon: Database, titleKey: 'feat2Title' as const, descKey: 'feat2Desc' as const },
    { icon: Truck, titleKey: 'feat3Title' as const, descKey: 'feat3Desc' as const },
  ];

  const steps = [
    { number: '01', titleKey: 'step1Title' as const, descKey: 'step1Desc' as const },
    { number: '02', titleKey: 'step2Title' as const, descKey: 'step2Desc' as const },
    { number: '03', titleKey: 'step3Title' as const, descKey: 'step3Desc' as const },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

      {/* ================================================================ */}
      {/*  BENTO GRID                                                      */}
      {/* ================================================================ */}
      <section className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 mb-6">

        {/* ============================================================== */}
        {/*  HERO CARD                                                      */}
        {/* ============================================================== */}
        <div
          className="col-span-1 md:col-span-2 md:row-span-2 lg:col-span-4 lg:row-span-2 rounded-3xl p-8 sm:p-10 lg:p-12 text-white flex flex-col justify-between shadow-lg hover:shadow-2xl transition-shadow duration-500 relative overflow-hidden group min-h-[360px] lg:min-h-[440px]"
          style={{ background: `linear-gradient(to bottom right, ${GREEN}, ${GREEN_MID}, ${GREEN_DARK})` }}
        >
          {/* Background decorative */}
          <div className="absolute top-0 right-0 opacity-[0.07] transform translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-700" aria-hidden="true">
            <RefreshCw className="h-72 w-72 lg:h-96 lg:w-96" strokeWidth={1} />
          </div>

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-block bg-white/15 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest backdrop-blur-sm border border-white/10">
                {t('badge')}
              </span>
              <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-white/70 border border-white/10">
                {t('partner')}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4">
              {t('heroTitle1')}
              <br />
              <span className="text-pbs-gold">{t('heroTitle2')}</span>
            </h1>

            <p className="text-white/80 text-lg sm:text-xl max-w-lg leading-relaxed">
              {t('heroDesc')}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-3 mt-8">
            <a
              href="#direct-inquiry"
              className="inline-flex items-center gap-2 bg-pbs-gold hover:bg-pbs-gold-dark text-pbs-black font-bold px-7 py-3.5 rounded-xl transition-colors text-base"
            >
              {t('heroCta')}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* ============================================================== */}
        {/*  SAVINGS STAT CARD                                              */}
        {/* ============================================================== */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white dark:bg-pbs-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-pbs-gray-100 dark:border-pbs-gray-800 flex flex-col justify-between relative overflow-hidden min-h-[200px]">
          <div className="absolute bottom-0 right-0 opacity-[0.04]" aria-hidden="true">
            <DollarSign className="h-36 w-36" strokeWidth={1} />
          </div>

          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GREEN_MID }}>
              {t('savingsLabel')}
            </span>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl sm:text-6xl font-black text-pbs-gray-900 dark:text-white tracking-tight">
                {t('savingsPercent')}
              </span>
            </div>
            <p className="text-pbs-gray-500 dark:text-pbs-gray-400 text-sm mt-2 leading-relaxed">
              {t('savingsDesc')}
            </p>
          </div>

          <div className="relative z-10 mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs bg-pbs-gray-50 dark:bg-pbs-gray-800 rounded-lg px-3 py-2">
              <span className="text-pbs-gray-500 font-medium">{t('thirdPartyLabel')}</span>
              <span className="font-bold text-pbs-red">{t('thirdPartyValue')}</span>
            </div>
            <div className="flex items-center justify-between text-xs rounded-lg px-3 py-2" style={{ backgroundColor: GREEN + '15' }}>
              <span className="font-medium" style={{ color: GREEN_MID }}>{t('directLabel')}</span>
              <span className="font-bold" style={{ color: GREEN_MID }}>{t('directValue')}</span>
            </div>
            <p className="text-[10px] text-pbs-gray-400 px-1">{t('savingsNote')}</p>
          </div>
        </div>

        {/* ============================================================== */}
        {/*  ZERO COMMISSIONS DARK CARD                                     */}
        {/* ============================================================== */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-pbs-black rounded-3xl p-6 sm:p-8 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between relative overflow-hidden group min-h-[200px]">
          <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-15 transition-opacity" aria-hidden="true">
            <DollarSign className="h-28 w-28" strokeWidth={1} />
          </div>

          <div className="relative z-10">
            <span className="text-xs font-bold text-pbs-gold uppercase tracking-widest">
              {t('zeroLabel')}
            </span>
            <h3 className="text-2xl font-bold tracking-tight mt-3 leading-snug">
              {t('zeroTitle')}
            </h3>
            <p className="text-pbs-gray-400 text-sm mt-2 leading-relaxed">
              {t('zeroDesc')}
            </p>
          </div>

          <a
            href="#direct-inquiry"
            className="relative z-10 text-pbs-gold text-sm font-medium flex items-center gap-1 mt-4 hover:gap-2 transition-all"
          >
            {t('zeroCta')}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* ============================================================== */}
        {/*  3 FEATURE CARDS                                                */}
        {/* ============================================================== */}
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.titleKey} className="col-span-1 md:col-span-1 lg:col-span-2 group">
              <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-pbs-gray-100 dark:border-pbs-gray-800 h-full flex flex-col min-h-[180px] relative overflow-hidden hover:-translate-y-1">
                {/* Gradient reveal on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{ background: `linear-gradient(to bottom right, ${GREEN}, ${GREEN_MID}, ${GREEN_DARK})` }}
                  aria-hidden="true"
                />

                <div className="relative z-10 flex flex-col gap-4 flex-1">
                  <div
                    className="h-12 w-12 rounded-2xl flex items-center justify-center bg-pbs-gray-100 dark:bg-pbs-gray-800 group-hover:bg-white/20 transition-colors duration-300"
                  >
                    <Icon
                      className="h-6 w-6 transition-colors duration-300 group-hover:text-white"
                      style={{ color: GREEN_MID }}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-pbs-gray-900 dark:text-white group-hover:text-white transition-colors duration-300">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400 group-hover:text-white/80 mt-1.5 transition-colors duration-300 leading-relaxed">
                      {t(feature.descKey)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* ============================================================== */}
        {/*  HOW IT WORKS CARD                                              */}
        {/* ============================================================== */}
        <div className="col-span-1 md:col-span-4 lg:col-span-4 bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-pbs-gray-100 dark:border-pbs-gray-800">
          <h3 className="text-xl font-bold text-pbs-gray-900 dark:text-white mb-6">
            {t('howItWorks')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={step.number} className="flex flex-col gap-3 relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden sm:block absolute top-4 left-full w-full h-px -translate-y-px"
                    style={{ background: `linear-gradient(to right, ${GREEN}40, transparent)` }}
                    aria-hidden="true"
                  />
                )}
                <div className="text-3xl font-black tracking-tight" style={{ color: GREEN }}>
                  {step.number}
                </div>
                <div>
                  <h4 className="font-bold text-pbs-gray-900 dark:text-white text-sm">
                    {t(step.titleKey)}
                  </h4>
                  <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mt-1 leading-relaxed">
                    {t(step.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/*  POWERED BY TALOS CARD                                          */}
        {/* ============================================================== */}
        <div
          className="col-span-1 md:col-span-2 lg:col-span-2 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-lg relative overflow-hidden min-h-[200px]"
          style={{ background: `linear-gradient(to bottom right, ${GREEN}, ${GREEN_DARK})` }}
        >
          <div>
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
              {t('talosPartner')}
            </span>
            <h3 className="text-3xl font-black tracking-tight text-white mt-2">
              {t('talosName')}
            </h3>
            <p className="text-white/70 text-sm mt-3 leading-relaxed">
              {t('talosDesc')}
            </p>
          </div>

        </div>

      </section>

      {/* ================================================================ */}
      {/*  INQUIRY SECTION                                                 */}
      {/* ================================================================ */}
      <section id="direct-inquiry" className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Form card */}
        <div className="lg:col-span-2 bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl p-8 sm:p-10 border border-pbs-gray-100 dark:border-pbs-gray-800">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GREEN_MID }}>
            {t('formBadge')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-pbs-gray-900 dark:text-white mt-2 mb-6">
            {t('formTitle')}
          </h2>
          <DirectInquiryForm />
        </div>

        {/* Side info card */}
        <div className="bg-pbs-black rounded-3xl p-8 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">{t('sideTitle')}</h3>
            <p className="text-pbs-gray-400 text-sm leading-relaxed mb-8">
              {t('sideDesc')}
            </p>

            <ul className="space-y-4">
              {(['sideItem1', 'sideItem2', 'sideItem3', 'sideItem4', 'sideItem5'] as const).map((key) => (
                <li
                  key={key}
                  className="flex items-center gap-2.5 text-sm text-pbs-gray-300"
                >
                  <CheckCircle2
                    className="h-4 w-4 shrink-0"
                    style={{ color: GREEN }}
                  />
                  <span className="font-medium">{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-pbs-gray-800">
            <p className="text-xs text-pbs-gray-500 uppercase tracking-widest font-semibold mb-3">
              {t('sideContact')}
            </p>
            <a
              href="https://wa.me/15513893188"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-pbs-gray-300 hover:text-white transition-colors"
            >
              <div className="h-8 w-8 rounded-lg bg-pbs-gray-800 flex items-center justify-center shrink-0">
                <MessageCircle className="h-4 w-4 text-pbs-gold" />
              </div>
              {t('whatsappLine')}
            </a>
          </div>
        </div>

      </section>

    </div>
  );
}
