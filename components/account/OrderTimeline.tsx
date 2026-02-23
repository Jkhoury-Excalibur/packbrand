import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { OrderStatus } from '@/lib/data/mock-orders';

const STEPS: { key: OrderStatus; label: string; sub: string }[] = [
  { key: 'Pending',    label: 'Order Placed',  sub: 'We received your order'    },
  { key: 'Processing', label: 'Processing',    sub: 'Being prepared for print'  },
  { key: 'Shipped',    label: 'Shipped',       sub: 'On its way to you'         },
  { key: 'Delivered',  label: 'Delivered',     sub: 'Order complete'            },
];

const ORDER: Record<OrderStatus, number> = {
  Pending:    0,
  Processing: 1,
  Shipped:    2,
  Delivered:  3,
  Cancelled:  -1,
};

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const current = ORDER[status] ?? 0;

  return (
    <div className="flex items-start gap-0 w-full">
      {STEPS.map((step, i) => {
        const done    = i < current;
        const active  = i === current;
        const future  = i > current;
        const isLast  = i === STEPS.length - 1;

        return (
          <div key={step.key} className="flex-1 flex flex-col items-center">
            {/* Connector row */}
            <div className="flex items-center w-full">
              {/* Left line */}
              <div className={cn('flex-1 h-0.5', i === 0 ? 'bg-transparent' : (done || active) ? 'bg-pbs-red' : 'bg-pbs-gray-200 dark:bg-pbs-gray-700')} />

              {/* Circle */}
              <div className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors',
                done   ? 'bg-pbs-red border-pbs-red text-white' :
                active ? 'bg-white dark:bg-pbs-gray-900 border-pbs-red text-pbs-red' :
                         'bg-white dark:bg-pbs-gray-900 border-pbs-gray-200 dark:border-pbs-gray-700 text-pbs-gray-300 dark:text-pbs-gray-600',
              )}>
                {done
                  ? <Check className="h-4 w-4" strokeWidth={2.5} />
                  : <span className="text-xs font-bold">{i + 1}</span>
                }
              </div>

              {/* Right line */}
              <div className={cn('flex-1 h-0.5', isLast ? 'bg-transparent' : done ? 'bg-pbs-red' : 'bg-pbs-gray-200 dark:bg-pbs-gray-700')} />
            </div>

            {/* Label */}
            <div className="mt-2 text-center px-1">
              <p className={cn('text-xs font-semibold', active ? 'text-pbs-red' : done ? 'text-pbs-gray-900 dark:text-white' : 'text-pbs-gray-400 dark:text-pbs-gray-600')}>
                {step.label}
              </p>
              <p className="text-[10px] text-pbs-gray-400 dark:text-pbs-gray-600 mt-0.5 hidden sm:block">
                {step.sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
