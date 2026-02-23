import { cn } from '@/lib/utils/cn';

type Status =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Active'
  | 'Inactive';

const styles: Record<Status, string> = {
  Pending:    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  Processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Shipped:    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  Delivered:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Cancelled:  'bg-pbs-gray-100 text-pbs-gray-500 dark:bg-pbs-gray-800 dark:text-pbs-gray-400',
  Active:     'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Inactive:   'bg-pbs-gray-100 text-pbs-gray-500 dark:bg-pbs-gray-800 dark:text-pbs-gray-400',
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', styles[status])}>
      {status}
    </span>
  );
}
