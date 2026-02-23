import type { OrderStatus } from './mock-orders';

export type AccountOrder = {
  id: string;
  product: string;
  category: string;
  size: string;
  qty: number;
  unitPrice: number;
  total: number;
  date: string;
  status: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
};

/** Orders belonging to the mock "logged in" customer: Maria Lopez / Go Picadera */
export const ACCOUNT_ORDERS: AccountOrder[] = [
  {
    id: 'ORD-1021',
    product: 'Custom Printed Coffee Cups',
    category: 'cups',
    size: '12oz',
    qty: 500,
    unitPrice: 2.48,
    total: 1240,
    date: '2026-02-20',
    status: 'Delivered',
    trackingNumber: '1Z999AA10123456784',
    estimatedDelivery: '2026-02-28',
  },
  {
    id: 'ORD-1008',
    product: 'Kraft Paper Bags',
    category: 'bags',
    size: 'Medium',
    qty: 250,
    unitPrice: 1.96,
    total: 490,
    date: '2026-01-14',
    status: 'Delivered',
    trackingNumber: '1Z999AA10123456701',
    estimatedDelivery: '2026-01-24',
  },
  {
    id: 'ORD-0997',
    product: 'Custom Printed Coffee Cups',
    category: 'cups',
    size: '16oz',
    qty: 500,
    unitPrice: 2.60,
    total: 1300,
    date: '2025-12-05',
    status: 'Delivered',
    trackingNumber: '1Z999AA10123456688',
    estimatedDelivery: '2025-12-18',
  },
  {
    id: 'ORD-0984',
    product: 'Custom Food Bowls',
    category: 'food-containers',
    size: '16oz',
    qty: 500,
    unitPrice: 1.84,
    total: 920,
    date: '2025-11-10',
    status: 'Delivered',
    trackingNumber: '1Z999AA10123456601',
    estimatedDelivery: '2025-11-24',
  },
  {
    id: 'ORD-0971',
    product: 'Custom Product Labels',
    category: 'labels',
    size: 'Custom',
    qty: 500,
    unitPrice: 0.62,
    total: 310,
    date: '2025-10-02',
    status: 'Delivered',
    trackingNumber: '1Z999AA10123456522',
    estimatedDelivery: '2025-10-12',
  },
  {
    id: 'ORD-0958',
    product: 'Cold Beverage Cups',
    category: 'cups',
    size: '24oz',
    qty: 500,
    unitPrice: 1.90,
    total: 950,
    date: '2025-09-08',
    status: 'Delivered',
    trackingNumber: '1Z999AA10123456433',
    estimatedDelivery: '2025-09-20',
  },
  {
    id: 'ORD-0945',
    product: 'Kraft Paper Bags',
    category: 'bags',
    size: 'Large',
    qty: 250,
    unitPrice: 2.28,
    total: 570,
    date: '2025-08-15',
    status: 'Delivered',
    trackingNumber: '1Z999AA10123456344',
    estimatedDelivery: '2025-08-29',
  },
  {
    id: 'ORD-0932',
    product: 'Custom Printed Coffee Cups',
    category: 'cups',
    size: '8oz',
    qty: 500,
    unitPrice: 2.20,
    total: 1100,
    date: '2025-07-22',
    status: 'Delivered',
    trackingNumber: '1Z999AA10123456255',
    estimatedDelivery: '2025-08-05',
  },
];
