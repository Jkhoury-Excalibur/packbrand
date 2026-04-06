'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';
import { submitInquiry } from '@/lib/actions/inquiries';

type FormState = {
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone: string;
  message: string;
};

const EMPTY: FormState = {
  firstName: '',
  lastName: '',
  businessName: '',
  email: '',
  phone: '',
  message: '',
};

const inputCls =
  'w-full rounded-xl border border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 px-4 py-2.5 text-sm text-pbs-gray-900 dark:text-white placeholder:text-pbs-gray-400 dark:placeholder:text-pbs-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3D5229]/40 focus:border-[#3D5229] transition-colors';

const labelCls =
  'block text-xs font-semibold text-pbs-gray-600 dark:text-pbs-gray-400 uppercase tracking-wide mb-1.5';

export function DirectInquiryForm() {
  const t = useTranslations('Direct');
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const result = await submitInquiry({ type: 'direct' as const, ...form });
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
        <div className="h-16 w-16 rounded-full bg-[#3D5229]/10 dark:bg-[#3D5229]/20 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-[#3D5229]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-pbs-gray-900 dark:text-white mb-2">
            {t('successTitle')}
          </h2>
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400 max-w-sm">
            {t('successDesc')}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setForm(EMPTY);
            setSubmitted(false);
          }}
        >
          {t('successAnother')}
        </Button>
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
          <label htmlFor="direct-firstName" className={labelCls}>
            {t('formFirstName')}
          </label>
          <input
            id="direct-firstName"
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
          <label htmlFor="direct-lastName" className={labelCls}>
            {t('formLastName')}
          </label>
          <input
            id="direct-lastName"
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
        <label htmlFor="direct-businessName" className={labelCls}>
          {t('formBusinessName')}
        </label>
        <input
          id="direct-businessName"
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
          <label htmlFor="direct-email" className={labelCls}>
            {t('formEmail')}
          </label>
          <input
            id="direct-email"
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
          <label htmlFor="direct-phone" className={labelCls}>
            {t('formPhone')}
          </label>
          <input
            id="direct-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            className={inputCls}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="direct-message" className={labelCls}>
          {t('formMessage')}
        </label>
        <textarea
          id="direct-message"
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
            ? '#3D5229'
            : 'linear-gradient(to right, #4D6B35, #3D5229)',
        }}
      >
        {submitting ? t('formSubmitting') : t('formSubmit')}
      </button>
    </form>
  );
}
