export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'voided';

export interface PaymentInitResult {
  success: boolean;
  iframeUrl?: string;
  ptk?: string;
  error?: string;
}

export interface PaymentConfirmResult {
  success: boolean;
  transactionId: string;
  authCode?: string;
  cardType?: string;
  lastFour?: string;
  token?: string;
  rawResponse: Record<string, unknown>;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  amount: number;
  error?: string;
}
