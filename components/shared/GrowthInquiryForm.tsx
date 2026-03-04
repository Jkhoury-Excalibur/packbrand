'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

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

const BUDGET_OPTIONS = [
  'Under $500 / month',
  '$500 – $1,000 / month',
  '$1,000 – $2,500 / month',
  '$2,500+ / month',
];

const GOLD_MID = '#C8912A';
const GOLD = '#D9A43A';

const inputCls =
  'w-full rounded-xl border border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 px-4 py-2.5 text-sm text-pbs-gray-900 dark:text-white placeholder:text-pbs-gray-400 dark:placeholder:text-pbs-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C8912A]/40 focus:border-[#C8912A] transition-colors';

const labelCls =
  'block text-xs font-semibold text-pbs-gray-600 dark:text-pbs-gray-400 uppercase tracking-wide mb-1.5';

export function GrowthInquiryForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
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
            Inquiry Sent!
          </h2>
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400 max-w-sm">
            Thanks! Our team will review your inquiry and reach out within 24
            hours to discuss your growth strategy.
          </p>
        </div>
        <button
          onClick={() => { setForm(EMPTY); setSubmitted(false); }}
          className="inline-flex items-center justify-center font-semibold transition-all duration-200 px-6 py-2.5 text-sm rounded-xl text-white"
          style={{ background: `linear-gradient(to right, ${GOLD}, ${GOLD_MID})` }}
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="growth-firstName" className={labelCls}>First Name</label>
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
          <label htmlFor="growth-lastName" className={labelCls}>Last Name</label>
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
        <label htmlFor="growth-businessName" className={labelCls}>Business Name</label>
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
          <label htmlFor="growth-email" className={labelCls}>Email Address</label>
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
          <label htmlFor="growth-phone" className={labelCls}>Phone Number</label>
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
        <label htmlFor="growth-budget" className={labelCls}>Monthly Ad Budget</label>
        <select
          id="growth-budget"
          name="budget"
          value={form.budget}
          onChange={handleChange}
          className={inputCls}
        >
          <option value="" disabled>Select a range</option>
          {BUDGET_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Goals */}
      <div>
        <label htmlFor="growth-message" className={labelCls}>Tell us about your goals</label>
        <textarea
          id="growth-message"
          name="message"
          rows={4}
          placeholder="What are you trying to achieve? More foot traffic, online orders, brand awareness? Any context helps..."
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
        {submitting ? 'Sending...' : 'Request a Consultation'}
      </button>
    </form>
  );
}
