import crypto from 'crypto';

/**
 * Generates a unique transaction ID for payment tracking.
 * Format: Timestamp (base36) + Random hex = 12-15 characters.
 *
 * Used instead of MongoDB ObjectId for the gateway's ticketid field
 * which has a 15-character limit.
 */
export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  const id = `${timestamp}${random}`;
  return id.slice(0, 15);
}

export function isValidTransactionId(transactionId: string): boolean {
  return /^[A-Z0-9]{12,15}$/.test(transactionId);
}
