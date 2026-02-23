'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';

const FIELDS = [
  { id: 'firstName',   label: 'First Name',    defaultValue: 'Maria',                  type: 'text'     },
  { id: 'lastName',    label: 'Last Name',     defaultValue: 'Lopez',                  type: 'text'     },
  { id: 'email',       label: 'Email Address', defaultValue: 'maria@gopicadera.com',   type: 'email'    },
  { id: 'company',     label: 'Company Name',  defaultValue: 'Go Picadera',            type: 'text'     },
  { id: 'phone',       label: 'Phone Number',  defaultValue: '(551) 555-0142',         type: 'tel'      },
];

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePwSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPwSaved(true);
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
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FIELDS.map(({ id, label, defaultValue, type }) => (
              <div key={id} className={id === 'email' ? 'sm:col-span-2' : ''}>
                <label htmlFor={id} className="block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2">
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  defaultValue={defaultValue}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary" size="md">
              {saved ? <><Check className="h-4 w-4 mr-1.5" />Saved!</> : 'Save Changes'}
            </Button>
            {saved && <p className="text-sm text-green-600 dark:text-green-400 font-medium">Your profile has been updated.</p>}
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
        <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-6">Change Password</h2>
        <form onSubmit={handlePwSave} className="space-y-5 max-w-md">
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
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors"
              />
            </div>
          ))}

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="outline" size="md">
              {pwSaved ? <><Check className="h-4 w-4 mr-1.5" />Updated!</> : 'Update Password'}
            </Button>
            {pwSaved && <p className="text-sm text-green-600 dark:text-green-400 font-medium">Password changed successfully.</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
