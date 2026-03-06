'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Plus, Pencil, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  createAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
} from '@/lib/actions/addresses';

type Address = {
  id: string;
  type: string;
  isDefault: boolean;
  name: string;
  company: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
};

export function AddressesClient({ initialAddresses }: { initialAddresses: Address[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const addresses = initialAddresses;

  const handleSetDefault = (id: string) => {
    startTransition(async () => {
      await setDefaultAddressAction(id);
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteAddressAction(id);
      router.refresh();
    });
  };

  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const form = e.target as HTMLFormElement;
    const get = (name: string) => (form.elements.namedItem(`new-${name}`) as HTMLInputElement).value;

    const result = await createAddressAction({
      type: 'shipping' as const,
      isDefault: addresses.length === 0,
      name: get('name'),
      company: get('company'),
      line1: get('line1'),
      line2: get('line2'),
      city: get('city'),
      state: get('state'),
      zip: get('zip'),
      country: 'United States',
      phone: get('phone'),
    });

    setSaving(false);

    if ('error' in result) {
      setError('Please fill in all required fields.');
      return;
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowForm(false);
      router.refresh();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-pbs-gray-900 dark:text-white tracking-tight">Addresses</h1>
          <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400 mt-1">Manage your shipping and billing addresses</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      {/* Address cards */}
      {addresses.length === 0 && !showForm ? (
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-12 text-center text-pbs-gray-400">
          No addresses saved yet. Add your first address above.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white dark:bg-pbs-gray-900 rounded-3xl border-2 border-pbs-gray-100 dark:border-pbs-gray-800 p-6 relative">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest">
                  {addr.type}
                </span>
                {addr.isDefault && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                    <Check className="h-3 w-3" /> Default
                  </span>
                )}
              </div>

              {/* Address details */}
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-xl bg-pbs-red/10 dark:bg-pbs-red/20 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-pbs-red" />
                </div>
                <div className="text-sm space-y-0.5">
                  <p className="font-semibold text-pbs-gray-900 dark:text-white">{addr.name}</p>
                  {addr.company && <p className="text-pbs-gray-500 dark:text-pbs-gray-400">{addr.company}</p>}
                  <p className="text-pbs-gray-500 dark:text-pbs-gray-400">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                  <p className="text-pbs-gray-500 dark:text-pbs-gray-400">{addr.city}, {addr.state} {addr.zip}</p>
                  <p className="text-pbs-gray-500 dark:text-pbs-gray-400">{addr.country}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-pbs-gray-100 dark:border-pbs-gray-800">
                <button
                  onClick={() => handleDelete(addr.id)}
                  disabled={isPending}
                  className="flex items-center gap-1.5 text-xs font-medium text-pbs-gray-600 dark:text-pbs-gray-400 hover:text-pbs-red transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
                {!addr.isDefault && (
                  <>
                    <span className="text-pbs-gray-200 dark:text-pbs-gray-700">|</span>
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      disabled={isPending}
                      className="text-xs font-medium text-pbs-red hover:underline transition-colors"
                    >
                      Set as Default
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new address form */}
      {showForm && (
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
          <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-6">New Address</h2>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSaveNew} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'name',    label: 'Full Name',    span: false },
                { id: 'company', label: 'Company',      span: false },
                { id: 'line1',   label: 'Address Line 1', span: true },
                { id: 'line2',   label: 'Address Line 2 (optional)', span: true },
                { id: 'city',    label: 'City',         span: false },
                { id: 'state',   label: 'State',        span: false },
                { id: 'zip',     label: 'ZIP Code',     span: false },
                { id: 'phone',   label: 'Phone (optional)', span: false },
              ].map(({ id, label, span }) => (
                <div key={id} className={span ? 'sm:col-span-2' : ''}>
                  <label htmlFor={`new-${id}`} className="block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2">
                    {label}
                  </label>
                  <input
                    id={`new-${id}`}
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary" size="md" disabled={saving}>
                {saved ? <><Check className="h-4 w-4 mr-1.5" />Saved!</> : saving ? 'Saving...' : 'Save Address'}
              </Button>
              <Button type="button" variant="ghost" size="md" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
