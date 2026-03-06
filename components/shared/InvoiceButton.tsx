'use client';

import { FileText } from 'lucide-react';

export function InvoiceButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 text-sm font-medium text-pbs-gray-600 dark:text-pbs-gray-400 hover:border-pbs-red hover:text-pbs-red transition-colors"
    >
      <FileText className="h-4 w-4" /> Invoice
    </button>
  );
}
