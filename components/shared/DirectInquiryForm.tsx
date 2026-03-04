'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

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
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
        <div className="h-16 w-16 rounded-full bg-[#3D5229]/10 dark:bg-[#3D5229]/20 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-[#3D5229]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-pbs-gray-900 dark:text-white mb-2">
            Inquiry Sent!
          </h2>
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400 max-w-sm">
            Thanks! Our team will review your inquiry and reach out within 24
            hours to walk you through Pack Brand Direct.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setForm(EMPTY);
            setSubmitted(false);
          }}
        >
          Send Another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="direct-firstName" className={labelCls}>
            First Name
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
            Last Name
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
          Restaurant / Business Name
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
            Email Address
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
            Phone Number
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
          Tell us about your restaurant
        </label>
        <textarea
          id="direct-message"
          name="message"
          rows={4}
          placeholder="Number of locations, current ordering setup, questions about Pack Brand Direct..."
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
        {submitting ? 'Sending...' : 'Request a Demo'}
      </button>
    </form>
  );
}
