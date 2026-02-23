import { Bell } from 'lucide-react';

type Props = {
  title: string;
  subtitle?: string;
};

export function AdminHeader({ title, subtitle }: Props) {
  return (
    <header className="h-16 bg-white dark:bg-pbs-gray-900 border-b border-pbs-gray-100 dark:border-pbs-gray-800 flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-lg font-bold text-pbs-gray-900 dark:text-white leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-pbs-gray-500 hover:text-pbs-gray-900 dark:text-pbs-gray-400 dark:hover:text-white hover:bg-pbs-gray-100 dark:hover:bg-pbs-gray-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-pbs-red" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-pbs-red flex items-center justify-center text-white text-xs font-bold shrink-0">
            RD
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-pbs-gray-900 dark:text-white leading-tight">Rafael Diaz</p>
            <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">Owner</p>
          </div>
        </div>
      </div>
    </header>
  );
}
