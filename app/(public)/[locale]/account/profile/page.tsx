'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';
import { updateProfile } from '@/lib/actions/account';
import { authClient } from '@/lib/auth-client';

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const { data: session } = authClient.useSession();
  const user = session?.user as { name?: string; email?: string; company?: string; phone?: string } | undefined;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const fd = new FormData(formRef.current!);
    const result = await updateProfile({
      name: fd.get('name') as string,
      company: fd.get('company') as string,
      phone: fd.get('phone') as string,
    });

    setSaving(false);
    if ('error' in result) {
      setError('Failed to save profile.');
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePwSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwSaving(true);
    setPwError('');

    const form = e.target as HTMLFormElement;
    const currentPassword = (form.elements.namedItem('currentPw') as HTMLInputElement).value;
    const newPassword = (form.elements.namedItem('newPw') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPw') as HTMLInputElement).value;

    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      setPwSaving(false);
      return;
    }

    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      setPwSaving(false);
      return;
    }

    const { error: err } = await authClient.changePassword({
      currentPassword,
      newPassword,
    });

    setPwSaving(false);
    if (err) {
      setPwError(err.message || 'Failed to change password.');
      return;
    }
    setPwSaved(true);
    form.reset();
    setTimeout(() => setPwSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-pbs-gray-900 dark:text-white tracking-tight">Profile</h1>
        <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400 mt-1">Manage your personal information</p>
      </div>

      {/* Profile form */}
      <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
        <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-6">Account Information</h2>
        <form ref={formRef} onSubmit={handleSave} className="space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={user?.name ?? ''}
                className="w-full px-4 py-3 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                defaultValue={user?.email ?? ''}
                disabled
                className="w-full px-4 py-3 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-pbs-gray-50 dark:bg-pbs-gray-800/50 text-pbs-gray-500 dark:text-pbs-gray-400 text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2">
                Company Name
              </label>
              <input
                id="company"
                name="company"
                type="text"
                defaultValue={user?.company ?? ''}
                className="w-full px-4 py-3 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={user?.phone ?? ''}
                className="w-full px-4 py-3 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary" size="md" disabled={saving}>
              {saved ? <><Check className="h-4 w-4 mr-1.5" />Saved!</> : saving ? 'Saving...' : 'Save Changes'}
            </Button>
            {saved && <p className="text-sm text-green-600 dark:text-green-400 font-medium">Your profile has been updated.</p>}
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
        <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-6">Change Password</h2>
        <form onSubmit={handlePwSave} className="space-y-5 max-w-md">
          {pwError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3">
              {pwError}
            </div>
          )}
          {[
            { id: 'currentPw',  label: 'Current Password' },
            { id: 'newPw',      label: 'New Password'     },
            { id: 'confirmPw',  label: 'Confirm Password' },
          ].map(({ id, label }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2">
                {label}
              </label>
              <input
                id={id}
                name={id}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors"
              />
            </div>
          ))}

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="outline" size="md" disabled={pwSaving}>
              {pwSaved ? <><Check className="h-4 w-4 mr-1.5" />Updated!</> : pwSaving ? 'Updating...' : 'Update Password'}
            </Button>
            {pwSaved && <p className="text-sm text-green-600 dark:text-green-400 font-medium">Password changed successfully.</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
