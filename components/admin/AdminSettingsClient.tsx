'use client';

import { useState } from 'react';
import { Save, Check, Bell, Globe, Palette, Store } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/Button';
import { updateSettingsAction } from '@/lib/actions/settings';
import { cn } from '@/lib/utils/cn';

const INPUT_CLS =
  'w-full px-4 py-2.5 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors';
const LABEL_CLS =
  'block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2';

type SettingsData = {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  timezone: string;
  notifications: {
    newOrders: boolean;
    lowStock: boolean;
    newUsers: boolean;
    inquiries: boolean;
  };
};

export function AdminSettingsClient({ settings }: { settings: SettingsData }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [storeName, setStoreName] = useState(settings.storeName);
  const [storeEmail, setStoreEmail] = useState(settings.storeEmail);
  const [storePhone, setStorePhone] = useState(settings.storePhone);
  const [storeAddress, setStoreAddress] = useState(settings.storeAddress);
  const [currency, setCurrency] = useState(settings.currency);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [orderNotif, setOrderNotif] = useState(settings.notifications.newOrders);
  const [lowStockNotif, setLowStockNotif] = useState(settings.notifications.lowStock);
  const [newUserNotif, setNewUserNotif] = useState(settings.notifications.newUsers);
  const [inquiryNotif, setInquiryNotif] = useState(settings.notifications.inquiries);

  const handleSave = async () => {
    setSaving(true);
    await updateSettingsAction({
      storeName,
      storeEmail,
      storePhone,
      storeAddress,
      currency,
      timezone,
      notifications: {
        newOrders: orderNotif,
        lowStock: lowStockNotif,
        newUsers: newUserNotif,
        inquiries: inquiryNotif,
      },
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <AdminHeader title="Settings" subtitle="Manage your store configuration" />

      <main className="flex-1 p-6 space-y-6 overflow-auto">

        {/* Store Information */}
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-pbs-red/10 dark:bg-pbs-red/20 flex items-center justify-center shrink-0">
              <Store className="h-4 w-4 text-pbs-red" />
            </div>
            <div>
              <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white">Store Information</h2>
              <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">General business details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={LABEL_CLS}>Store Name</label>
              <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className={INPUT_CLS} />
            </div>
            <div>
              <label className={LABEL_CLS}>Contact Email</label>
              <input type="email" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} className={INPUT_CLS} />
            </div>
            <div>
              <label className={LABEL_CLS}>Phone Number</label>
              <input type="tel" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} className={INPUT_CLS} />
            </div>
            <div>
              <label className={LABEL_CLS}>Business Address</label>
              <input type="text" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} className={INPUT_CLS} />
            </div>
          </div>
        </div>

        {/* Regional */}
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white">Regional Settings</h2>
              <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">Currency, timezone, and locale</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={LABEL_CLS}>Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={INPUT_CLS}>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Timezone</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={INPUT_CLS}>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
              <Bell className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white">Notifications</h2>
              <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">Configure email alerts</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'New order notifications', desc: 'Get an email when a new order is placed', checked: orderNotif, set: setOrderNotif },
              { label: 'Low stock alerts', desc: 'Get notified when product inventory is low', checked: lowStockNotif, set: setLowStockNotif },
              { label: 'New user signups', desc: 'Receive alerts when new customers register', checked: newUserNotif, set: setNewUserNotif },
              { label: 'Inquiry notifications', desc: 'Get notified when contact forms are submitted', checked: inquiryNotif, set: setInquiryNotif },
            ].map(({ label, desc, checked, set }) => (
              <label key={label} className="flex items-start gap-4 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => set(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={cn(
                    'h-5 w-9 rounded-full transition-colors',
                    checked ? 'bg-pbs-red' : 'bg-pbs-gray-200 dark:bg-pbs-gray-700',
                  )} />
                  <div className={cn(
                    'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                    checked && 'translate-x-4',
                  )} />
                </div>
                <div>
                  <p className="text-sm font-medium text-pbs-gray-900 dark:text-white">{label}</p>
                  <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-pbs-gold/20 flex items-center justify-center shrink-0">
              <Palette className="h-4 w-4 text-pbs-gold-dark" />
            </div>
            <div>
              <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white">Appearance</h2>
              <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">Brand colors and logo</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={LABEL_CLS}>Primary Brand Color</label>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-pbs-red border-2 border-pbs-gray-200 dark:border-pbs-gray-700 shrink-0" />
                <input type="text" defaultValue="#D72638" className={INPUT_CLS} readOnly />
              </div>
            </div>
            <div>
              <label className={LABEL_CLS}>Logo</label>
              <div className="h-10 flex items-center px-4 rounded-xl border-2 border-dashed border-pbs-gray-200 dark:border-pbs-gray-700 text-sm text-pbs-gray-400">
                Upload logo (coming soon)
              </div>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" className="gap-2" onClick={handleSave} disabled={saving}>
            {saved ? <><Check className="h-4 w-4" /> Saved!</> : saving ? 'Saving...' : <><Save className="h-4 w-4" /> Save Settings</>}
          </Button>
          {saved && (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              Settings updated successfully.
            </p>
          )}
        </div>

      </main>
    </>
  );
}
