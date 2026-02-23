'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

const PRODUCT_OPTIONS = [
  'Custom Cups',
  'Branded Bags',
  'Packaging Boxes',
  'Food Containers',
  'Labels & Stickers',
  'Other',
];

type FormState = {
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone: string;
  productType: string;
  quantity: string;
  message: string;
};

const EMPTY: FormState = {
  firstName: '',
  lastName: '',
  businessName: '',
  email: '',
  phone: '',
  productType: '',
  quantity: '',
  message: '',
};

const inputCls =
  'w-full rounded-xl border border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 px-4 py-2.5 text-sm text-pbs-gray-900 dark:text-white placeholder:text-pbs-gray-400 dark:placeholder:text-pbs-gray-500 focus:outline-none focus:ring-2 focus:ring-pbs-red/50 focus:border-pbs-red transition-colors';

const labelCls = 'block text-xs font-semibold text-pbs-gray-600 dark:text-pbs-gray-400 uppercase tracking-wide mb-1.5';

export function ContactForm() {
  const t = useTranslations('Contact');
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Placeholder: simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 gap-5">
        <div className="h-16 w-16 rounded-full bg-pbs-red/10 dark:bg-pbs-red/20 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-pbs-red" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-pbs-gray-900 dark:text-white mb-2">
            {t('successTitle')}
          </h2>
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400 max-w-sm">
            {t('successMessage')}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => { setForm(EMPTY); setSubmitted(false); }}
        >
          {t('sendAnother')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className={labelCls}>{t('firstName')}</label>
          <input
            id="firstName"
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
          <label htmlFor="lastName" className={labelCls}>{t('lastName')}</label>
          <input
            id="lastName"
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
        <label htmlFor="businessName" className={labelCls}>{t('businessName')}</label>
        <input
          id="businessName"
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
          <label htmlFor="email" className={labelCls}>{t('email')}</label>
          <input
            id="email"
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
          <label htmlFor="phone" className={labelCls}>{t('phone')}</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            className={inputCls}
          />
        </div>
      </div>

      {/* Product + Quantity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="productType" className={labelCls}>{t('productType')}</label>
          <select
            id="productType"
            name="productType"
            value={form.productType}
            onChange={handleChange}
            className={inputCls}
          >
            <option value="" disabled>{t('productTypePlaceholder')}</option>
            {PRODUCT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantity" className={labelCls}>{t('quantity')}</label>
          <input
            id="quantity"
            name="quantity"
            type="text"
            placeholder={t('quantityPlaceholder')}
            value={form.quantity}
            onChange={handleChange}
            className={inputCls}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelCls}>{t('message')}</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={t('messagePlaceholder')}
          value={form.message}
          onChange={handleChange}
          className={inputCls + ' resize-none'}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={submitting}
      >
        {submitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
