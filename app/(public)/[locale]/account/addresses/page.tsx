'use client';

import { useState } from 'react';
import { MapPin, Plus, Pencil, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const MOCK_ADDRESSES = [
  {
    id: 'addr-1',
    type: 'Shipping',
    isDefault: true,
    name: 'Maria Lopez',
    company: 'Go Picadera',
    line1: '847 Bergenline Ave',
    line2: 'Suite 2B',
    city: 'Union City',
    state: 'NJ',
    zip: '07087',
    country: 'United States',
    phone: '(551) 555-0142',
  },
  {
    id: 'addr-2',
    type: 'Billing',
    isDefault: false,
    name: 'Maria Lopez',
    company: 'Go Picadera',
    line1: '22 Ward Street',
    line2: '',
    city: 'Hackensack',
    state: 'NJ',
    zip: '07601',
    country: 'United States',
    phone: '(551) 555-0142',
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowForm(false); }, 1800);
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
              <button className="flex items-center gap-1.5 text-xs font-medium text-pbs-gray-600 dark:text-pbs-gray-400 hover:text-pbs-red transition-colors">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <span className="text-pbs-gray-200 dark:text-pbs-gray-700">|</span>
              <button className="flex items-center gap-1.5 text-xs font-medium text-pbs-gray-600 dark:text-pbs-gray-400 hover:text-pbs-red transition-colors">
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
              {!addr.isDefault && (
                <>
                  <span className="text-pbs-gray-200 dark:text-pbs-gray-700">|</span>
                  <button
                    onClick={() => handleSetDefault(addr.id)}
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

      {/* Add new address form */}
      {showForm && (
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
          <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-6">New Address</h2>
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
              <Button type="submit" variant="primary" size="md">
                {saved ? <><Check className="h-4 w-4 mr-1.5" />Saved!</> : 'Save Address'}
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
