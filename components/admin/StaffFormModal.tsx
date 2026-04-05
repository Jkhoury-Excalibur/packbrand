'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createStaffAction, updateStaffAction, setStaffPasswordAction } from '@/lib/actions/staff';
import { cn } from '@/lib/utils/cn';

const INPUT_CLS = 'w-full px-4 py-2.5 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors';
const LABEL_CLS = 'block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2';

const ROLES = ['Owner', 'Sales', 'Fulfillment', 'Design'];

type StaffData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
} | null;

type Props = {
  staff: StaffData;
  onClose: () => void;
  onSaved: () => void;
};

export function StaffFormModal({ staff, onClose, onSaved }: Props) {
  const isNew = !staff;
  const [name, setName] = useState(staff?.name ?? '');
  const [email, setEmail] = useState(staff?.email ?? '');
  const [phone, setPhone] = useState(staff?.phone ?? '');
  const [role, setRole] = useState(staff?.role ?? ROLES[0]);
  const [status, setStatus] = useState(staff?.status ?? 'Active');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setPasswordSuccess('');

    const data = { name, email, phone, role, status };

    const result = isNew
      ? await createStaffAction(data)
      : await updateStaffAction(staff!.id, data);

    if ('error' in result) {
      setSaving(false);
      setError('Please fill in all required fields.');
      return;
    }

    // Set password if provided
    if (password) {
      const staffId = isNew ? (result as unknown as { id: string }).id : staff!.id;
      const pwResult = await setStaffPasswordAction(staffId, password);
      if ('error' in pwResult) {
        setSaving(false);
        setError(pwResult.error as string);
        return;
      }
    }

    setSaving(false);
    onSaved();
  };

  const isActive = status === 'Active';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-pbs-gray-100 dark:border-pbs-gray-800">
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white">
            {isNew ? 'New Staff Member' : 'Edit Staff Member'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-pbs-gray-400 hover:text-pbs-gray-900 dark:hover:text-white hover:bg-pbs-gray-100 dark:hover:bg-pbs-gray-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className={LABEL_CLS}>Full Name *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={INPUT_CLS} placeholder="e.g. John Smith" />
          </div>

          <div>
            <label className={LABEL_CLS}>Email *</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT_CLS} placeholder="e.g. john@company.com" />
          </div>

          <div>
            <label className={LABEL_CLS}>Phone *</label>
            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={INPUT_CLS} placeholder="e.g. (555) 123-4567" />
          </div>

          <div>
            <label className={LABEL_CLS}>Role *</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className={INPUT_CLS}>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={cn('h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors', isActive ? 'bg-pbs-red border-pbs-red' : 'border-pbs-gray-300 dark:border-pbs-gray-600 group-hover:border-pbs-red')}>
              {isActive && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            </div>
            <div>
              <p className="text-sm font-medium text-pbs-gray-900 dark:text-white">Active</p>
              <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">Staff member is currently active</p>
            </div>
            <input type="checkbox" checked={isActive} onChange={(e) => setStatus(e.target.checked ? 'Active' : 'Inactive')} className="sr-only" />
          </label>

          {/* Set Login Password */}
          <div className="border-t border-pbs-gray-100 dark:border-pbs-gray-800 pt-5">
            <label className={LABEL_CLS}>Login Password {isNew && '*'}</label>
            <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mb-2">
              {isNew ? 'Set a password so this staff member can log in.' : 'Leave blank to keep the current password, or enter a new one to change it.'}
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordSuccess(''); }}
              className={INPUT_CLS}
              placeholder="Min. 8 characters"
              minLength={8}
              {...(isNew ? { required: true } : {})}
            />
            {passwordSuccess && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">{passwordSuccess}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="lg" className="flex-1" disabled={saving}>
              {saving ? 'Saving...' : isNew ? 'Add Staff' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
