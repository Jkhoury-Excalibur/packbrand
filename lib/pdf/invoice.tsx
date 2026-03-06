import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const RED = '#D72638';
const GRAY_900 = '#1a1a1a';
const GRAY_600 = '#666666';
const GRAY_400 = '#999999';
const GRAY_200 = '#e5e7eb';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: GRAY_900,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  brandName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: RED,
  },
  brandTagline: {
    fontSize: 8,
    color: GRAY_400,
    marginTop: 2,
  },
  invoiceTitle: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: GRAY_900,
    textAlign: 'right' as const,
  },
  invoiceMeta: {
    fontSize: 9,
    color: GRAY_600,
    textAlign: 'right' as const,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: GRAY_400,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoBlock: {
    width: '48%',
  },
  infoText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: GRAY_900,
  },
  infoLabel: {
    fontSize: 9,
    color: GRAY_600,
  },
  table: {
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: GRAY_200,
    paddingBottom: 6,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: GRAY_200,
  },
  colProduct: { width: '40%' },
  colSize: { width: '15%' },
  colQty: { width: '15%', textAlign: 'right' as const },
  colPrice: { width: '15%', textAlign: 'right' as const },
  colTotal: { width: '15%', textAlign: 'right' as const },
  thText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: GRAY_400,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  cellText: {
    fontSize: 10,
    color: GRAY_900,
  },
  cellSub: {
    fontSize: 8,
    color: GRAY_600,
    marginTop: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 3,
  },
  summaryLabel: {
    width: 120,
    fontSize: 10,
    color: GRAY_600,
    textAlign: 'right' as const,
    paddingRight: 12,
  },
  summaryValue: {
    width: 80,
    fontSize: 10,
    textAlign: 'right' as const,
    color: GRAY_900,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: GRAY_200,
    marginTop: 4,
  },
  totalLabel: {
    width: 120,
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: GRAY_900,
    textAlign: 'right' as const,
    paddingRight: 12,
  },
  totalValue: {
    width: 80,
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: RED,
    textAlign: 'right' as const,
  },
  footer: {
    position: 'absolute' as const,
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 0.5,
    borderTopColor: GRAY_200,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: GRAY_400,
  },
});

export type InvoiceData = {
  orderNumber: string;
  date: string;
  status: string;
  customer: {
    name: string;
    company?: string;
    email: string;
    phone?: string;
  };
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: {
    name: string;
    categoryName?: string;
    size: string;
    qty: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
};

export function InvoicePDF({ data }: { data: InvoiceData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>PackBrand Solutions</Text>
            <Text style={styles.brandTagline}>Custom Branded Packaging</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceMeta}>{data.orderNumber}</Text>
            <Text style={styles.invoiceMeta}>{data.date}</Text>
            <Text style={styles.invoiceMeta}>Status: {data.status}</Text>
          </View>
        </View>

        {/* Bill To / Ship To */}
        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={styles.infoText}>{data.customer.name}</Text>
            {data.customer.company && <Text style={styles.infoText}>{data.customer.company}</Text>}
            <Text style={styles.infoLabel}>{data.customer.email}</Text>
            {data.customer.phone && <Text style={styles.infoLabel}>{data.customer.phone}</Text>}
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.sectionTitle}>Ship To</Text>
            <Text style={styles.infoText}>{data.customer.name}</Text>
            {data.customer.company && <Text style={styles.infoText}>{data.customer.company}</Text>}
            <Text style={styles.infoText}>{data.shippingAddress.line1}</Text>
            {data.shippingAddress.line2 && <Text style={styles.infoText}>{data.shippingAddress.line2}</Text>}
            <Text style={styles.infoText}>
              {data.shippingAddress.city}, {data.shippingAddress.state} {data.shippingAddress.zip}
            </Text>
            <Text style={styles.infoText}>{data.shippingAddress.country}</Text>
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.colProduct}><Text style={styles.thText}>Product</Text></View>
            <View style={styles.colSize}><Text style={styles.thText}>Size</Text></View>
            <View style={styles.colQty}><Text style={styles.thText}>Qty</Text></View>
            <View style={styles.colPrice}><Text style={styles.thText}>Unit Price</Text></View>
            <View style={styles.colTotal}><Text style={styles.thText}>Total</Text></View>
          </View>
          {data.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={styles.colProduct}>
                <Text style={styles.cellText}>{item.name}</Text>
                {item.categoryName && <Text style={styles.cellSub}>{item.categoryName}</Text>}
              </View>
              <View style={styles.colSize}><Text style={styles.cellText}>{item.size}</Text></View>
              <View style={styles.colQty}><Text style={styles.cellText}>{item.qty.toLocaleString()}</Text></View>
              <View style={styles.colPrice}><Text style={styles.cellText}>${item.unitPrice.toFixed(2)}</Text></View>
              <View style={styles.colTotal}><Text style={styles.cellText}>${item.lineTotal.toLocaleString()}</Text></View>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${data.subtotal.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>{data.shipping === 0 ? 'Free' : `$${data.shipping.toFixed(2)}`}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${data.total.toLocaleString()}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>PackBrand Solutions · 22 Ward Street, Hackensack, NJ 07601</Text>
          <Text style={styles.footerText}>info@packbrandsolutions.com · (551) 389-3188</Text>
        </View>
      </Page>
    </Document>
  );
}
