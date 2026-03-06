import { setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <span className="text-xs font-bold text-pbs-red uppercase tracking-widest">Legal</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-pbs-gray-900 dark:text-white tracking-tight mt-2">
          Terms of Service
        </h1>
        <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-2">
          Last updated: March 1, 2026
        </p>
      </div>

      <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-8 sm:p-10 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">1. Agreement to Terms</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            By accessing or using the Pack Brand Solutions website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all visitors, users, and customers of our platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">2. Services</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            Pack Brand Solutions provides custom-branded packaging products including cups, bags, boxes, food containers, labels, and related services. We also offer digital marketing services (Pack Brand Growth), online ordering solutions (Pack Brand Direct), and AI-powered voice ordering (Pack Brand Voice). All services are subject to availability and may be modified at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">3. Orders & Pricing</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed mb-3">
            All prices are listed in US Dollars (USD) and are subject to change without notice. Pricing may vary based on quantity, customization options, and product specifications. By placing an order, you agree to:
          </p>
          <ul className="list-disc list-inside text-sm text-pbs-gray-600 dark:text-pbs-gray-400 space-y-1.5 ml-2">
            <li>Provide accurate contact and shipping information</li>
            <li>Pay the agreed-upon price for products and services</li>
            <li>Review and approve all artwork and designs before production</li>
            <li>Accept minimum order quantities as specified per product</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">4. Custom Artwork & Intellectual Property</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            You retain all rights to your logos, trademarks, and original artwork submitted for printing. By submitting artwork, you represent that you have the legal right to use and reproduce the submitted materials. Pack Brand Solutions is not responsible for verifying ownership of submitted artwork. We may showcase completed projects in our portfolio unless you request otherwise in writing.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">5. Shipping & Delivery</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            We ship to all 50 US states. Delivery times are estimates and not guarantees. Pack Brand Solutions is not liable for delays caused by carriers, weather, customs, or other events beyond our control. Shipping costs and timelines will be communicated before order confirmation. Risk of loss passes to the customer upon delivery to the carrier.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">6. Returns & Refunds</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            Due to the custom nature of our products, all sales are final once production has begun. If you receive damaged or defective products, please contact us within 7 business days of delivery with photos of the issue. We will work with you to resolve the problem through replacement or credit at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">7. Account Responsibility</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use. Pack Brand Solutions reserves the right to suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">8. Limitation of Liability</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            Pack Brand Solutions shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific order in question.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">9. Contact</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            For questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:info@packbrandsolutions.com" className="text-pbs-red hover:underline font-medium">
              info@packbrandsolutions.com
            </a>{' '}
            or call{' '}
            <a href="tel:+15513893188" className="text-pbs-red hover:underline font-medium">
              (551) 389-3188
            </a>.
          </p>
        </section>

      </div>
    </div>
  );
}
