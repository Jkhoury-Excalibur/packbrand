'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import { submitInquiry } from '@/lib/actions/inquiries';

type FormState = {
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone: string;
  budget: string;
  message: string;
};

const EMPTY: FormState = {
  firstName: '',
  lastName: '',
  businessName: '',
  email: '',
  phone: '',
  budget: '',
  message: '',
};

const GOLD_MID = '#C8912A';
const GOLD = '#D9A43A';

const inputCls =
  'w-full rounded-xl border border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 px-4 py-2.5 text-sm text-pbs-gray-900 dark:text-white placeholder:text-pbs-gray-400 dark:placeholder:text-pbs-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C8912A]/40 focus:border-[#C8912A] transition-colors';

const labelCls =
  'block text-xs font-semibold text-pbs-gray-600 dark:text-pbs-gray-400 uppercase tracking-wide mb-1.5';

export function GrowthInquiryForm() {
  const t = useTranslations('Growth');
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const budgetOptions = [
    t('formBudget1'),
    t('formBudget2'),
    t('formBudget3'),
    t('formBudget4'),
  ];

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const result = await submitInquiry({ type: 'growth' as const, ...form });
    setSubmitting(false);

    if ('error' in result) {
      setError(t('formError'));
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 gap-5">
        <div
          className="h-16 w-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: GOLD_MID + '1A' }}
        >
          <CheckCircle2 className="h-8 w-8" style={{ color: GOLD_MID }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-pbs-gray-900 dark:text-white mb-2">
            {t('successTitle')}
          </h2>
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400 max-w-sm">
            {t('successDesc')}
          </p>
        </div>
        <button
          onClick={() => { setForm(EMPTY); setSubmitted(false); }}
          className="inline-flex items-center justify-center font-semibold transition-all duration-200 px-6 py-2.5 text-sm rounded-xl text-white"
          style={{ background: `linear-gradient(to right, ${GOLD}, ${GOLD_MID})` }}
        >
          {t('successAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="growth-firstName" className={labelCls}>{t('formFirstName')}</label>
          <input
            id="growth-firstName"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            value={form.firstName}
            onChange={handleChange}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="growth-lastName" className={labelCls}>{t('formLastName')}</label>
          <input
            id="growth-lastName"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            value={form.lastName}
            onChange={handleChange}
            className={inputCls}
          />
        </div>
      </div>

      {/* Business */}
      <div>
        <label htmlFor="growth-businessName" className={labelCls}>{t('formBusinessName')}</label>
        <input
          id="growth-businessName"
          name="businessName"
          type="text"
          autoComplete="organization"
          value={form.businessName}
          onChange={handleChange}
          className={inputCls}
        />
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="growth-email" className={labelCls}>{t('formEmail')}</label>
          <input
            id="growth-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="growth-phone" className={labelCls}>{t('formPhone')}</label>
          <input
            id="growth-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            className={inputCls}
          />
        </div>
      </div>

      {/* Monthly ad budget */}
      <div>
        <label htmlFor="growth-budget" className={labelCls}>{t('formBudget')}</label>
        <select
          id="growth-budget"
          name="budget"
          value={form.budget}
          onChange={handleChange}
          className={inputCls}
        >
          <option value="" disabled>{t('formBudgetPlaceholder')}</option>
          {budgetOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Goals */}
      <div>
        <label htmlFor="growth-message" className={labelCls}>{t('formMessage')}</label>
        <textarea
          id="growth-message"
          name="message"
          rows={4}
          placeholder={t('formMessagePlaceholder')}
          value={form.message}
          onChange={handleChange}
          className={inputCls + ' resize-none'}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer px-7 py-3.5 text-base rounded-xl text-white"
        style={{
          background: submitting
            ? GOLD_MID
            : `linear-gradient(to right, ${GOLD}, ${GOLD_MID})`,
        }}
      >
        {submitting ? t('formSubmitting') : t('formSubmit')}
      </button>
    </form>
  );
}
