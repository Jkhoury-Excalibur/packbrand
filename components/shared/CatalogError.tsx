'use client';

import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';

export default function CatalogError({ reset }: { reset: () => void }) {
  const es = useLocale() === 'es';
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center space-y-5" role="alert">
      <h1 className="text-2xl font-bold">{es ? 'No pudimos cargar el catálogo' : 'We couldn’t load the catalog'}</h1>
      <p>{es ? 'Inténtalo de nuevo en un momento.' : 'Please try again in a moment.'}</p>
      <Button onClick={reset}>{es ? 'Intentar de nuevo' : 'Try again'}</Button>
    </div>
  );
}
