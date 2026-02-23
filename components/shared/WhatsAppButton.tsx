'use client';

import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const WHATSAPP_PHONE = '15513893188';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}`;

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'fixed bottom-6 right-6 z-40',
        'flex items-center justify-center',
        'h-14 w-14 rounded-full',
        'bg-pbs-whatsapp hover:bg-pbs-whatsapp-dark',
        'text-white shadow-lg hover:shadow-xl',
        'transition-all duration-300 hover:scale-110',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pbs-whatsapp',
      )}
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />

      {/* Pulse animation ring */}
      <span
        className="absolute inset-0 rounded-full bg-pbs-whatsapp animate-ping opacity-20"
        aria-hidden="true"
      />
    </a>
  );
}
