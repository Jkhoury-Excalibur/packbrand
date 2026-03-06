'use client';

import { useState, useTransition } from 'react';
import { Star } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { moderateReviewAction } from '@/lib/actions/reviews';
import { cn } from '@/lib/utils/cn';

type ReviewRow = {
  id: string;
  productId: string;
  productName: string;
  author: string;
  company: string;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
};

const STATUS_TABS = [
  { key: 'all' as const,      label: 'All'      },
  { key: 'pending' as const,  label: 'Pending'  },
  { key: 'approved' as const, label: 'Approved' },
  { key: 'rejected' as const, label: 'Rejected' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn('h-3.5 w-3.5', s <= rating ? 'fill-pbs-gold text-pbs-gold' : 'text-pbs-gray-300 dark:text-pbs-gray-600')}
        />
      ))}
    </div>
  );
}

export function AdminReviewsClient({ reviews: initial }: { reviews: ReviewRow[] }) {
  const [reviews, setReviews] = useState(initial);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isPending, startTransition] = useTransition();

  const filtered = activeTab === 'all' ? reviews : reviews.filter((r) => r.status === activeTab);

  const handleModerate = (id: string, status: 'approved' | 'rejected') => {
    startTransition(async () => {
      await moderateReviewAction(id, status);
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    });
  };

  const columns = [
    {
      key: 'product',
      header: 'Product',
      render: (r: ReviewRow) => (
        <div>
          <p className="font-medium text-pbs-gray-900 dark:text-white text-sm">{r.productName}</p>
        </div>
      ),
    },
    {
      key: 'reviewer',
      header: 'Reviewer',
      render: (r: ReviewRow) => (
        <div>
          <p className="font-medium text-pbs-gray-900 dark:text-white">{r.author}</p>
          {r.company && <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">{r.company}</p>}
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (r: ReviewRow) => <StarRating rating={r.rating} />,
    },
    {
      key: 'text',
      header: 'Review',
      render: (r: ReviewRow) => (
        <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 max-w-xs truncate">{r.text}</p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r: ReviewRow) => <StatusBadge status={(r.status.charAt(0).toUpperCase() + r.status.slice(1)) as 'Pending' | 'Approved' | 'Rejected'} />,
    },
    {
      key: 'date',
      header: 'Date',
      render: (r: ReviewRow) => <span className="text-pbs-gray-500 dark:text-pbs-gray-400 text-sm">{r.date}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (r: ReviewRow) => (
        <div className="flex items-center gap-2">
          {r.status !== 'approved' && (
            <button
              onClick={() => handleModerate(r.id, 'approved')}
              disabled={isPending}
              className="text-xs font-medium text-green-600 hover:underline disabled:opacity-50"
            >
              Approve
            </button>
          )}
          {r.status !== 'rejected' && (
            <button
              onClick={() => handleModerate(r.id, 'rejected')}
              disabled={isPending}
              className="text-xs font-medium text-red-500 hover:underline disabled:opacity-50"
            >
              Reject
            </button>
          )}
        </div>
      ),
    },
  ];

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  return (
    <>
      <AdminHeader
        title="Reviews"
        subtitle={pendingCount > 0 ? `${pendingCount} pending review${pendingCount !== 1 ? 's' : ''} awaiting moderation` : `${reviews.length} total review${reviews.length !== 1 ? 's' : ''}`}
      />

      <main className="flex-1 p-6 space-y-5 overflow-auto">
        <div className="flex gap-1 bg-white dark:bg-pbs-gray-900 border border-pbs-gray-100 dark:border-pbs-gray-800 rounded-2xl p-1 w-fit">
          {STATUS_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-sm font-medium transition-colors',
                activeTab === key
                  ? 'bg-pbs-red text-white'
                  : 'text-pbs-gray-500 dark:text-pbs-gray-400 hover:text-pbs-gray-900 dark:hover:text-white',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800">
          <AdminTable
            columns={columns as never[]}
            rows={filtered as never[]}
            emptyMessage="No reviews in this category."
          />
        </div>
      </main>
    </>
  );
}
