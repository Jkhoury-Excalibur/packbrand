import { cn } from '@/lib/utils/cn';

type Column<T> = {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
};

export function AdminTable<T extends Record<string, unknown>>({ columns, rows, emptyMessage = 'No data found.' }: Props<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-pbs-gray-100 dark:border-pbs-gray-800">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  'px-4 py-3 text-left text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest whitespace-nowrap',
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-pbs-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-pbs-gray-100 dark:border-pbs-gray-800 last:border-0 hover:bg-pbs-gray-50 dark:hover:bg-pbs-gray-800/50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn('px-4 py-3.5 text-pbs-gray-700 dark:text-pbs-gray-300 whitespace-nowrap', col.className)}
                  >
                    {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
