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
  const features = [
    {
      icon: Globe,
      title: 'Branded Ordering Site',
      desc: 'Your own custom domain. Your logo, your colors. Customers order directly from you — not from a third-party app.',
    },
    {
      icon: Database,
      title: 'Own Your Customers',
      desc: 'Customer data stays with you. Build loyalty, run promotions, and stay connected — without sharing data with competitors.',
    },
    {
      icon: Truck,
      title: 'Flexible Delivery',
      desc: 'Integrated delivery through DoorDash or Uber drivers, or use your own. You choose what works for your operation.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Get Set Up',
      desc: 'We configure your branded ordering site with your menu, photos, and custom domain. Done in days, not weeks.',
    },
    {
      number: '02',
      title: 'Launch Your Site',
      desc: 'Share your link everywhere — Instagram, flyers, receipts. Customers order directly, no app download needed.',
    },
    {
      number: '03',
      title: 'Receive Orders',
      desc: 'Orders flow directly to your kitchen in real time. You get paid directly — no commission deducted.',
    },
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
                Pack Brand Direct
              </span>
              <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-white/70 border border-white/10">
                In Partnership with Talos
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4">
              Your Restaurant,
              <br />
              <span className="text-pbs-gold">Online.</span>
            </h1>

            <p className="text-white/80 text-lg sm:text-xl max-w-lg leading-relaxed">
              Commission-free online ordering for restaurants. Stop giving 30%
              to third-party apps — keep your revenue where it belongs.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-3 mt-8">
            <a
              href="#direct-inquiry"
              className="inline-flex items-center gap-2 bg-pbs-gold hover:bg-pbs-gold-dark text-pbs-black font-bold px-7 py-3.5 rounded-xl transition-colors text-base"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="https://www.ordertalos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-7 py-3.5 rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/40 transition-colors text-base"
            >
              About Talos
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
              Save More
            </span>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl sm:text-6xl font-black text-pbs-gray-900 dark:text-white tracking-tight">
                30%
              </span>
            </div>
            <p className="text-pbs-gray-500 dark:text-pbs-gray-400 text-sm mt-2 leading-relaxed">
              Commission saved per order vs. third-party apps
            </p>
          </div>

          <div className="relative z-10 mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs bg-pbs-gray-50 dark:bg-pbs-gray-800 rounded-lg px-3 py-2">
              <span className="text-pbs-gray-500 font-medium">DoorDash / UberEats</span>
              <span className="font-bold text-pbs-red">$9.00 / order</span>
            </div>
            <div className="flex items-center justify-between text-xs rounded-lg px-3 py-2" style={{ backgroundColor: GREEN + '15' }}>
              <span className="font-medium" style={{ color: GREEN_MID }}>Pack Brand Direct</span>
              <span className="font-bold" style={{ color: GREEN_MID }}>$3.51 / order</span>
            </div>
            <p className="text-[10px] text-pbs-gray-400 px-1">*Based on average $30 order</p>
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
              Zero Commissions
            </span>
            <h3 className="text-2xl font-bold tracking-tight mt-3 leading-snug">
              Keep Every Dollar You Earn
            </h3>
            <p className="text-pbs-gray-400 text-sm mt-2 leading-relaxed">
              No revenue sharing, no hidden fees. You set the prices, you keep
              the profit.
            </p>
          </div>

          <a
            href="#direct-inquiry"
            className="relative z-10 text-pbs-gold text-sm font-medium flex items-center gap-1 mt-4 hover:gap-2 transition-all"
          >
            Inquire Now
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
        {/*  POWERED BY TALOS CARD                                          */}
        {/* ============================================================== */}
        <div
          className="col-span-1 md:col-span-2 lg:col-span-2 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-lg relative overflow-hidden min-h-[200px]"
          style={{ background: `linear-gradient(to bottom right, ${GREEN}, ${GREEN_DARK})` }}
        >
          <div>
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
              In Partnership With
            </span>
            <h3 className="text-3xl font-black tracking-tight text-white mt-2">
              Talos
            </h3>
            <p className="text-white/70 text-sm mt-3 leading-relaxed">
              A modern, commission-free ordering platform built specifically for
              restaurants. Starting at $99/month.
            </p>
          </div>

          <a
            href="https://www.ordertalos.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pbs-gold text-sm font-medium flex items-center gap-1 mt-6 hover:gap-2 transition-all"
          >
            Visit ordertalos.com
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

      </section>

      {/* ================================================================ */}
      {/*  INQUIRY SECTION                                                 */}
      {/* ================================================================ */}
      <section id="direct-inquiry" className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Form card */}
        <div className="lg:col-span-2 bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl p-8 sm:p-10 border border-pbs-gray-100 dark:border-pbs-gray-800">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GREEN_MID }}>
            Get Started
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-pbs-gray-900 dark:text-white mt-2 mb-6">
            Inquire About Pack Brand Direct
          </h2>
          <DirectInquiryForm />
        </div>

        {/* Side info card */}
        <div className="bg-pbs-black rounded-3xl p-8 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">What to Expect</h3>
            <p className="text-pbs-gray-400 text-sm leading-relaxed mb-8">
              After submitting, our team will reach out within 24 hours to walk
              you through the setup and answer any questions.
            </p>

            <ul className="space-y-4">
              {[
                'Free consultation call',
                'Custom demo of your ordering site',
                'Transparent pricing, no surprises',
                'Setup in days, not weeks',
                'Bilingual support in English & Spanish',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-pbs-gray-300"
                >
                  <CheckCircle2
                    className="h-4 w-4 shrink-0"
                    style={{ color: GREEN }}
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
