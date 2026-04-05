'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, Truck, MapPin, User, Mail, Phone, Building2, StickyNote, Save, Check, Download,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { OrderTimeline } from '@/components/account/OrderTimeline';
import { Button } from '@/components/ui/Button';
import { updateOrderAction } from '@/lib/actions/orders';
import type { OrderStatus } from '@/lib/types/order';
import { cn } from '@/lib/utils/cn';

const STATUS_OPTIONS: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const INPUT_CLS = 'w-full px-4 py-2.5 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors';
const LABEL_CLS = 'block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2';

type OrderData = {
  id: string;
  orderNumber: string;
  customer: string;
  company: string;
  email: string;
  phone: string;
  date: string;
  total: number;
  subtotal: number;
  shipping: number;
  status: string;
  trackingNumber: string;
  notes: string;
  items: { productId: string; name: string; categoryId: string; categoryName: string; size: string; qty: number; unitPrice: number; lineTotal: number }[];
  shippingAddress: { line1: string; line2?: string; city: string; state: string; zip: string; country: string };
};

export function AdminOrderDetailClient({ order }: { order: OrderData }) {
  const [status, setStatus] = useState<OrderStatus>(order.status as OrderStatus);
  const [tracking, setTracking] = useState(order.trackingNumber);
  const [notes, setNotes] = useState(order.notes);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateOrderAction(order.id, { status, trackingNumber: tracking, notes });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <AdminHeader title={order.orderNumber} subtitle={`Submitted on ${order.date}`} />

      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-pbs-gray-500 dark:text-pbs-gray-400 hover:text-pbs-red transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Work Orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-pbs-red flex items-center justify-center text-white text-lg font-bold shrink-0">
              {order.customer.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-bold text-pbs-gray-900 dark:text-white tracking-tight">{order.customer}</h2>
              <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400">{order.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={status} />
            <a
              href={`/api/orders/${order.id}/invoice`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pbs-gray-100 dark:bg-pbs-gray-800 text-pbs-gray-700 dark:text-pbs-gray-300 text-xs font-medium hover:bg-pbs-gray-200 dark:hover:bg-pbs-gray-700 transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Invoice PDF
            </a>
          </div>
        </div>

        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
          <h3 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-6">Work Order Status</h3>
          <OrderTimeline status={status} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
              <h3 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-5">Work Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="h-14 w-14 rounded-2xl bg-pbs-gray-100 dark:bg-pbs-gray-800 flex items-center justify-center shrink-0 text-2xl">📦</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-pbs-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mt-0.5">Size: {item.size} · Qty: {item.qty.toLocaleString()} units</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-pbs-gray-900 dark:text-white">${item.lineTotal.toLocaleString()}</p>
                      <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mt-0.5">${item.unitPrice.toFixed(2)} × {item.qty.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-pbs-gray-100 dark:border-pbs-gray-800 space-y-2 text-sm">
                <div className="flex justify-between text-pbs-gray-500 dark:text-pbs-gray-400"><span>Subtotal</span><span>${order.subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-pbs-gray-500 dark:text-pbs-gray-400"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between font-bold text-pbs-gray-900 dark:text-white text-base pt-2 border-t border-pbs-gray-100 dark:border-pbs-gray-800"><span>Total</span><span>${order.total.toLocaleString()}</span></div>
              </div>
            </div>

            {/* Update Work Order */}
            <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
              <h3 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-5">Update Work Order</h3>
              <div className="space-y-5">
                <div>
                  <label className={LABEL_CLS}>Fulfillment Status</label>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((s) => (
                      <button key={s} type="button" onClick={() => setStatus(s)} className={cn('px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors', status === s ? 'border-pbs-red bg-pbs-red/10 text-pbs-red dark:bg-pbs-red/20' : 'border-pbs-gray-200 dark:border-pbs-gray-700 text-pbs-gray-600 dark:text-pbs-gray-400 hover:border-pbs-gray-300 dark:hover:border-pbs-gray-600')}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="tracking" className={LABEL_CLS}><Truck className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Tracking Number</label>
                  <input id="tracking" type="text" placeholder="e.g. 1Z999AA10123456784" value={tracking} onChange={(e) => setTracking(e.target.value)} className={INPUT_CLS} />
                </div>
                <div>
                  <label htmlFor="notes" className={LABEL_CLS}><StickyNote className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Internal Notes</label>
                  <textarea id="notes" rows={3} placeholder="Add internal notes about this work order..." value={notes} onChange={(e) => setNotes(e.target.value)} className={`${INPUT_CLS} resize-none`} />
                </div>
                <Button variant="primary" size="md" className="gap-2" onClick={handleSave} disabled={saving}>
                  {saved ? <><Check className="h-4 w-4" /> Saved!</> : saving ? 'Saving...' : <><Save className="h-4 w-4" /> Save Changes</>}
                </Button>
                {saved && <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-2">Work order updated successfully.</p>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
              <h3 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-5">Customer</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3"><div className="h-8 w-8 rounded-xl bg-pbs-red/10 dark:bg-pbs-red/20 flex items-center justify-center shrink-0"><User className="h-4 w-4 text-pbs-red" /></div><p className="text-sm font-semibold text-pbs-gray-900 dark:text-white">{order.customer}</p></div>
                {order.company && <div className="flex items-center gap-3"><div className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0"><Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" /></div><p className="text-sm text-pbs-gray-700 dark:text-pbs-gray-300">{order.company}</p></div>}
                <div className="flex items-center gap-3"><div className="h-8 w-8 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0"><Mail className="h-4 w-4 text-green-600 dark:text-green-400" /></div><a href={`mailto:${order.email}`} className="text-sm text-pbs-gray-700 dark:text-pbs-gray-300 hover:text-pbs-red transition-colors">{order.email}</a></div>
                <div className="flex items-center gap-3"><div className="h-8 w-8 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0"><Phone className="h-4 w-4 text-purple-600 dark:text-purple-400" /></div><a href={`tel:${order.phone}`} className="text-sm text-pbs-gray-700 dark:text-pbs-gray-300 hover:text-pbs-red transition-colors">{order.phone}</a></div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
              <h3 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-5">Shipping Address</h3>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-xl bg-pbs-red/10 dark:bg-pbs-red/20 flex items-center justify-center shrink-0"><MapPin className="h-4 w-4 text-pbs-red" /></div>
                <div className="text-sm space-y-0.5">
                  <p className="font-semibold text-pbs-gray-900 dark:text-white">{order.customer}</p>
                  {order.company && <p className="text-pbs-gray-500 dark:text-pbs-gray-400">{order.company}</p>}
                  <p className="text-pbs-gray-500 dark:text-pbs-gray-400">{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && <p className="text-pbs-gray-500 dark:text-pbs-gray-400">{order.shippingAddress.line2}</p>}
                  <p className="text-pbs-gray-500 dark:text-pbs-gray-400">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                  <p className="text-pbs-gray-500 dark:text-pbs-gray-400">{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
