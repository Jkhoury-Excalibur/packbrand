import {
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Target,
  BarChart3,
  Instagram,
  MessageCircle,
  Zap,
  Users,
} from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { GrowthInquiryForm } from '@/components/shared/GrowthInquiryForm';

// Amber/gold brand colors — matches the GROWTH card on the homepage
const AMBER = '#D9A43A';
const AMBER_MID = '#C8912A';
const AMBER_DARK = '#9A6F1E';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GrowthPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GrowthContent />;
}

function GrowthContent() {
  const features = [
    {
      icon: Target,
      title: 'Meta Ads Management',
      desc: 'Facebook and Instagram ad campaigns built around your brand, your audience, and your goals — with zero guesswork.',
    },
    {
      icon: Instagram,
      title: 'Content & Strategy',
      desc: 'On-brand content, consistent posting, and a growth strategy tailored to your business and local market.',
    },
    {
      icon: BarChart3,
      title: 'Performance Tracking',
      desc: "Clear reporting on what's working. Every dollar tracked so you can see exactly what your investment is returning.",
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Brand Audit',
      desc: 'We review your current presence, competitors, and audience to build a strategy that fits your market.',
    },
    {
      number: '02',
      title: 'Campaign Launch',
      desc: 'We create the ads, write the copy, and launch targeted campaigns — all designed to drive real customers.',
    },
    {
      number: '03',
      title: 'Scale & Optimize',
      desc: "We monitor results, cut what isn't working, and double down on what is — turning spend into growth.",
    },
  ];

  const platforms = [
    { name: 'Facebook Ads', icon: Users },
    { name: 'Instagram Ads', icon: Instagram },
    { name: 'Meta Retargeting', icon: Target },
    { name: 'Analytics & Reports', icon: BarChart3 },
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
          style={{ background: `linear-gradient(to bottom right, ${AMBER}, ${AMBER_MID}, ${AMBER_DARK})` }}
        >
          {/* Background decorative */}
          <div className="absolute top-0 right-0 opacity-[0.07] transform translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-700" aria-hidden="true">
            <TrendingUp className="h-72 w-72 lg:h-96 lg:w-96" strokeWidth={1} />
          </div>
          <div className="absolute bottom-0 left-0 opacity-[0.05] transform -translate-x-8 translate-y-8" aria-hidden="true">
            <Zap className="h-48 w-48" strokeWidth={1} />
          </div>

          <div className="relative z-10">
            <span className="inline-block bg-white/15 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest backdrop-blur-sm border border-white/10 mb-6">
              Pack Brand Growth
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4">
              Get Found.
              <br />
              <span className="text-pbs-black/80">Get Customers.</span>
            </h1>

            <p className="text-white/80 text-lg sm:text-xl max-w-lg leading-relaxed">
              Full-service digital marketing for restaurants and food brands —
              Meta Ads, Instagram, and beyond. We turn your budget into real,
              paying customers.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-3 mt-8">
            <a
              href="#growth-inquiry"
              className="inline-flex items-center gap-2 bg-pbs-black text-white font-bold px-7 py-3.5 rounded-xl hover:bg-pbs-gray-900 transition-colors text-base"
            >
              Get a Free Strategy Call
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#growth-inquiry"
              className="inline-flex items-center gap-2 bg-white/15 text-white font-semibold px-7 py-3.5 rounded-xl border border-white/20 hover:bg-white/25 hover:border-white/40 transition-colors text-base"
            >
              See What We Do
            </a>
          </div>
        </div>

        {/* ============================================================== */}
        {/*  REACH STAT CARD                                                */}
        {/* ============================================================== */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white dark:bg-pbs-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-pbs-gray-100 dark:border-pbs-gray-800 flex flex-col justify-between relative overflow-hidden min-h-[200px]">
          <div className="absolute bottom-0 right-0 opacity-[0.04]" aria-hidden="true">
            <Users className="h-36 w-36" strokeWidth={1} />
          </div>

          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: AMBER_MID }}>
              Your Audience
            </span>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl sm:text-6xl font-black text-pbs-gray-900 dark:text-white tracking-tight">
                3.5B+
              </span>
            </div>
            <p className="text-pbs-gray-500 dark:text-pbs-gray-400 text-sm mt-2 leading-relaxed">
              People active on Facebook and Instagram every month
            </p>
          </div>

          <div className="relative z-10 mt-4 space-y-2">
            {[
              'Hyper-local targeting by ZIP code',
              'Interest & behavior audiences',
              'Retarget past visitors & customers',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-pbs-gray-600 dark:text-pbs-gray-400">
                <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: AMBER_MID }} />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/*  RESULTS DARK CARD                                              */}
        {/* ============================================================== */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-pbs-black rounded-3xl p-6 sm:p-8 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between relative overflow-hidden group min-h-[200px]">
          <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-15 transition-opacity" aria-hidden="true">
            <TrendingUp className="h-28 w-28" strokeWidth={1} />
          </div>

          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: AMBER }}>
              Stop Guessing
            </span>
            <h3 className="text-2xl font-bold tracking-tight mt-3 leading-snug">
              Every Dollar Tracked. Every Result Reported.
            </h3>
            <p className="text-pbs-gray-400 text-sm mt-2 leading-relaxed">
              No mystery invoices. You'll always know what's running, what it
              costs, and what it's bringing in.
            </p>
          </div>

          <a
            href="#growth-inquiry"
            className="relative z-10 text-sm font-medium flex items-center gap-1 mt-4 hover:gap-2 transition-all"
            style={{ color: AMBER }}
          >
            Start Growing
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* ============================================================== */}
        {/*  3 FEATURE CARDS                                                */}
        {/* ============================================================== */}
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="col-span-1 md:col-span-1 lg:col-span-2 group">
              <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-pbs-gray-100 dark:border-pbs-gray-800 h-full flex flex-col min-h-[180px] relative overflow-hidden hover:-translate-y-1">
                {/* Gradient reveal on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{ background: `linear-gradient(to bottom right, ${AMBER}, ${AMBER_MID}, ${AMBER_DARK})` }}
                  aria-hidden="true"
                />

                <div className="relative z-10 flex flex-col gap-4 flex-1">
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-pbs-gray-100 dark:bg-pbs-gray-800 group-hover:bg-white/20 transition-colors duration-300">
                    <Icon
                      className="h-6 w-6 transition-colors duration-300 group-hover:text-white"
                      style={{ color: AMBER_MID }}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-pbs-gray-900 dark:text-white group-hover:text-white transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400 group-hover:text-white/80 mt-1.5 transition-colors duration-300 leading-relaxed">
                      {feature.desc}
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
            How It Works
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={step.number} className="flex flex-col gap-3 relative">
                {i < steps.length - 1 && (
                  <div
                    className="hidden sm:block absolute top-4 left-full w-full h-px -translate-y-px"
                    style={{ background: `linear-gradient(to right, ${AMBER}40, transparent)` }}
                    aria-hidden="true"
                  />
                )}
                <div className="text-3xl font-black tracking-tight" style={{ color: AMBER }}>
                  {step.number}
                </div>
                <div>
                  <h4 className="font-bold text-pbs-gray-900 dark:text-white text-sm">
                    {step.title}
                  </h4>
                  <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/*  PLATFORMS CARD                                                 */}
        {/* ============================================================== */}
        <div
          className="col-span-1 md:col-span-2 lg:col-span-2 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-lg relative overflow-hidden min-h-[200px]"
          style={{ background: `linear-gradient(to bottom right, ${AMBER}, ${AMBER_DARK})` }}
        >
          <div>
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
              Platforms We Run
            </span>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {platforms.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.name} className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                      <Icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-white/90 leading-tight">
                      {p.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <a
            href="#growth-inquiry"
            className="text-pbs-black/70 hover:text-pbs-black text-sm font-medium flex items-center gap-1 mt-6 hover:gap-2 transition-all"
          >
            Get a Free Audit
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

      </section>

      {/* ================================================================ */}
      {/*  INQUIRY SECTION                                                 */}
      {/* ================================================================ */}
      <section id="growth-inquiry" className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Form card */}
        <div className="lg:col-span-2 bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl p-8 sm:p-10 border border-pbs-gray-100 dark:border-pbs-gray-800">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: AMBER_MID }}>
            Get Started
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-pbs-gray-900 dark:text-white mt-2 mb-6">
            Request a Free Strategy Call
          </h2>
          <GrowthInquiryForm />
        </div>

        {/* Side info card */}
        <div className="bg-pbs-black rounded-3xl p-8 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">What's Included</h3>
            <p className="text-pbs-gray-400 text-sm leading-relaxed mb-8">
              On our free strategy call, you'll get a full breakdown of your
              current online presence and a clear plan to grow it.
            </p>

            <ul className="space-y-4">
              {[
                'Free social media & ad audit',
                'Competitor analysis',
                'Custom growth strategy',
                'Clear pricing, no long-term contracts',
                'Bilingual support in English & Spanish',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-pbs-gray-300"
                >
                  <CheckCircle2
                    className="h-4 w-4 shrink-0"
                    style={{ color: AMBER }}
                  />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-pbs-gray-800">
            <p className="text-xs text-pbs-gray-500 uppercase tracking-widest font-semibold mb-3">
              Or reach us directly
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
              WhatsApp: +1 (551) 389-3188
            </a>
          </div>
        </div>

      </section>

    </div>
  );
}
