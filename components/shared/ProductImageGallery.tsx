'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { getProductIcon } from '@/lib/utils/icons';

type Props = {
  images: string[];
  alt: string;
  iconName: string;
};

export function ProductImageGallery({ images, alt, iconName }: Props) {
  const Icon = getProductIcon(iconName);
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;
  const activeImage = hasImages ? images[active] : null;
  const thumbs = hasImages ? images.slice(0, 4) : [0, 1, 2, 3];

  return (
    <div className="space-y-3">
      <div className="bg-pbs-gray-100 dark:bg-pbs-gray-800/60 rounded-3xl aspect-square flex items-center justify-center border border-pbs-gray-200 dark:border-pbs-gray-700 overflow-hidden">
        {activeImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={activeImage} alt={alt} className="object-cover w-full h-full" />
        ) : (
          <Icon className="h-36 w-36 text-pbs-gray-300 dark:text-pbs-gray-600" strokeWidth={0.75} />
        )}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {thumbs.map((_, i) => {
          const url = hasImages ? images[i] : undefined;
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              onClick={() => url && setActive(i)}
              disabled={!url}
              className={cn(
                'bg-pbs-gray-100 dark:bg-pbs-gray-800/60 rounded-2xl aspect-square flex items-center justify-center border-2 transition-colors overflow-hidden',
                isActive
                  ? 'border-pbs-red'
                  : 'border-transparent hover:border-pbs-gray-300 dark:hover:border-pbs-gray-600',
                url ? 'cursor-pointer' : 'cursor-default',
              )}
              aria-label={url ? `View image ${i + 1}` : undefined}
            >
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="object-cover w-full h-full" />
              ) : (
                <Icon className="h-8 w-8 text-pbs-gray-300 dark:text-pbs-gray-600" strokeWidth={1} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
