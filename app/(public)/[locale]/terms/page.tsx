import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';

type Props = { params: Promise<{ locale: string }> };

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TermsContent />;
}

function TermsContent() {
  const t = useTranslations('Terms');

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <span className="text-xs font-bold text-pbs-red uppercase tracking-widest">{t('legal')}</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-pbs-gray-900 dark:text-white tracking-tight mt-2">
          {t('title')}
        </h1>
        <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-2">
          {t('lastUpdated')}
        </p>
      </div>

      <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-8 sm:p-10 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">{t('s1Title')}</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            {t('s1Body')}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">{t('s2Title')}</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            {t('s2Body')}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">{t('s3Title')}</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed mb-3">
            {t('s3Intro')}
          </p>
          <ul className="list-disc list-inside text-sm text-pbs-gray-600 dark:text-pbs-gray-400 space-y-1.5 ml-2">
            {(['s3Item1', 's3Item2', 's3Item3', 's3Item4'] as const).map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">{t('s4Title')}</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            {t('s4Body')}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">{t('s5Title')}</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            {t('s5Body')}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">{t('s6Title')}</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            {t('s6Body')}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">{t('s7Title')}</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            {t('s7Body')}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">{t('s8Title')}</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            {t('s8Body')}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">{t('s9Title')}</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            {t('s9Before')}
            <a href="mailto:info@packbrandsolutions.com" className="text-pbs-red hover:underline font-medium">
              info@packbrandsolutions.com
            </a>
            {t('s9Middle')}
            <a href="tel:+15513893188" className="text-pbs-red hover:underline font-medium">
              (551) 389-3188
            </a>
            {t('s9After')}
          </p>
        </section>

      </div>
    </div>
  );
}
