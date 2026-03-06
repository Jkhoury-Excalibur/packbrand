import { getDb } from './client';
import type { SettingsInput } from '../validators';

export type DbSettings = SettingsInput & {
  _id: string;
};

const SETTINGS_ID = 'global';

async function col() {
  const db = await getDb();
  return db.collection<DbSettings>('settings');
}

const DEFAULT_SETTINGS: DbSettings = {
  _id: SETTINGS_ID,
  storeName: 'PackBrand Solutions',
  storeEmail: 'info@packbrandsolutions.com',
  storePhone: '(551) 389-3188',
  storeAddress: '123 Main St, Hackensack, NJ 07601',
  currency: 'USD',
  timezone: 'America/New_York',
  notifications: {
    newOrders: true,
    lowStock: true,
    newUsers: true,
    inquiries: true,
  },
};

export async function getSettings(): Promise<DbSettings> {
  const c = await col();
  const settings = await c.findOne({ _id: SETTINGS_ID });
  if (!settings) {
    await c.insertOne(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
  return settings;
}

export async function updateSettings(data: Partial<SettingsInput>) {
  const c = await col();
  return c.updateOne(
    { _id: SETTINGS_ID },
    { $set: data },
    { upsert: true }
  );
}
