import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type Props = {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
};

export function StatCard({ title, value, trend, trendUp, icon: Icon, iconColor, iconBg }: Props) {
  return (
    <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl p-6 border border-pbs-gray-100 dark:border-pbs-gray-800 flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest truncate">
          {title}
        </p>
        <p className="text-3xl font-black text-pbs-gray-900 dark:text-white tracking-tight">
          {value}
        </p>
        {trend && (
          <div className={cn('flex items-center gap-1 text-xs font-medium mt-0.5', trendUp ? 'text-green-600 dark:text-green-400' : 'text-pbs-red')}>
            {trendUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className={cn('shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center', iconBg ?? 'bg-pbs-red/10 dark:bg-pbs-red/20')}>
        <Icon className={cn('h-6 w-6', iconColor ?? 'text-pbs-red')} />
      </div>
    </div>
  );
}
