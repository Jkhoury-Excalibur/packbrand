'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

type FormState = {
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone: string;
  callVolume: string;
};

const EMPTY: FormState = {
  firstName: '',
  lastName: '',
  businessName: '',
  email: '',
  phone: '',
  callVolume: '',
};

const CALL_VOLUME_OPTIONS = [
  'Under 20 calls / day',
  '20 – 50 calls / day',
  '50 – 100 calls / day',
  '100+ calls / day',
];

const PURPLE_MID = '#4A3463';
const PURPLE = '#5C4278';

const inputCls =
  'w-full rounded-xl border border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 px-4 py-2.5 text-sm text-pbs-gray-900 dark:text-white placeholder:text-pbs-gray-400 dark:placeholder:text-pbs-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4A3463]/40 focus:border-[#4A3463] transition-colors';

const labelCls =
  'block text-xs font-semibold text-pbs-gray-600 dark:text-pbs-gray-400 uppercase tracking-wide mb-1.5';

export function VoiceWaitlistForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
          style={{ backgroundColor: PURPLE_MID + '1A' }}
        >
          <CheckCircle2 className="h-8 w-8" style={{ color: PURPLE_MID }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-pbs-gray-900 dark:text-white mb-2">
            You're on the list!
          </h2>
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400 max-w-sm">
            We'll reach out as soon as Pack Brand Voice is ready for early
            access. You'll be among the first to know.
          </p>
        </div>
        <button
          onClick={() => { setForm(EMPTY); setSubmitted(false); }}
          className="inline-flex items-center justify-center font-semibold transition-all duration-200 px-6 py-2.5 text-sm rounded-xl text-white"
          style={{ background: `linear-gradient(to right, ${PURPLE}, ${PURPLE_MID})` }}
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="voice-firstName" className={labelCls}>First Name</label>
          <input
            id="voice-firstName"
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
          <label htmlFor="voice-lastName" className={labelCls}>Last Name</label>
          <input
            id="voice-lastName"
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
        <label htmlFor="voice-businessName" className={labelCls}>Restaurant / Business Name</label>
        <input
          id="voice-businessName"
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
          <label htmlFor="voice-email" className={labelCls}>Email Address</label>
          <input
            id="voice-email"
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
          <label htmlFor="voice-phone" className={labelCls}>Phone Number</label>
          <input
            id="voice-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            className={inputCls}
          />
        </div>
      </div>

      {/* Call volume */}
      <div>
        <label htmlFor="voice-callVolume" className={labelCls}>
          Approximate Call Volume
        </label>
        <select
          id="voice-callVolume"
          name="callVolume"
          value={form.callVolume}
          onChange={handleChange}
          className={inputCls}
        >
          <option value="" disabled>How many calls does your restaurant get per day?</option>
          {CALL_VOLUME_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer px-7 py-3.5 text-base rounded-xl text-white"
        style={{
          background: submitting
            ? PURPLE_MID
            : `linear-gradient(to right, ${PURPLE}, ${PURPLE_MID})`,
        }}
      >
        {submitting ? 'Joining...' : 'Join the Waitlist'}
      </button>
    </form>
  );
}
