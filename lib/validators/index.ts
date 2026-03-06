import { z } from 'zod';

// ── Categories ──

export const categorySchema = z.object({
  name: z.string().min(1),
  nameEs: z.string().optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  descriptionEs: z.string().optional(),
  iconName: z.string().default('Package'),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// ── Products ──

export const productSpecSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const pricingTierSchema = z.object({
  minQty: z.number().int().positive(),
  maxQty: z.number().int().positive().optional(),
  unitPrice: z.number().positive(),
}).refine(
  (t) => t.maxQty === undefined || t.minQty <= t.maxQty,
  { message: 'maxQty must be >= minQty' }
);

export const productSchema = z.object({
  categoryId: z.string().min(1),
  iconName: z.string().optional(),
  name: z.string().min(1),
  nameEs: z.string().optional(),
  shortDescription: z.string().min(1),
  shortDescEs: z.string().optional(),
  description: z.string().min(1),
  descEs: z.string().optional(),
  tags: z.array(z.string()),
  features: z.array(z.string()),
  sizes: z.array(z.string()).optional(),
  specs: z.array(productSpecSchema),
  basePrice: z.number().positive(),
  images: z.array(z.string()).default([]),
  pricingTiers: z.array(pricingTierSchema).default([]),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  allowLogoUpload: z.boolean().default(false),
  allowCustomText: z.boolean().default(false),
});

export type ProductInput = z.infer<typeof productSchema>;

// ── Orders ──

export const orderStatusSchema = z.enum([
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
]);

export const shippingAddressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(1),
});

export const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string().min(1),
  categoryId: z.string().min(1),
  categoryName: z.string().min(1),
  size: z.string().min(1),
  qty: z.number().int().positive(),
  unitPrice: z.number().positive(),
  lineTotal: z.number().positive(),
});

export const createOrderSchema = z.object({
  contact: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    company: z.string().optional(),
  }),
  shippingAddress: shippingAddressSchema,
  items: z.array(orderItemSchema).min(1),
  specialInstructions: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderSchema = z.object({
  status: orderStatusSchema.optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;

// ── Addresses ──

export const addressSchema = z.object({
  type: z.enum(['shipping', 'billing']),
  isDefault: z.boolean().default(false),
  name: z.string().min(1),
  company: z.string().optional(),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().default('United States'),
  phone: z.string().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;

// ── Inquiries ──

export const inquirySchema = z.object({
  type: z.enum(['general', 'direct', 'growth', 'voice']),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  businessName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  productType: z.string().optional(),
  quantity: z.string().optional(),
  budget: z.string().optional(),
  callVolume: z.string().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

// ── Staff ──

export const staffSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  role: z.string().min(1),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

export type StaffInput = z.infer<typeof staffSchema>;

// ── Settings ──

export const settingsSchema = z.object({
  storeName: z.string().min(1),
  storeEmail: z.string().email(),
  storePhone: z.string().min(1),
  storeAddress: z.string().min(1),
  currency: z.string().default('USD'),
  timezone: z.string().default('America/New_York'),
  taxRate: z.number().min(0).max(1).default(0),
  shippingRate: z.number().min(0).default(49.99),
  freeShippingThreshold: z.number().min(0).default(500),
  notifications: z.object({
    newOrders: z.boolean().default(true),
    lowStock: z.boolean().default(true),
    newUsers: z.boolean().default(true),
    inquiries: z.boolean().default(true),
  }),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
