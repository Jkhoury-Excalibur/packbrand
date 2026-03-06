import { setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <span className="text-xs font-bold text-pbs-red uppercase tracking-widest">Legal</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-pbs-gray-900 dark:text-white tracking-tight mt-2">
          Privacy Policy
        </h1>
        <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-2">
          Last updated: March 1, 2026
        </p>
      </div>

      <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-8 sm:p-10 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">1. Information We Collect</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed mb-3">
            We collect information that you provide directly when using our services:
          </p>
          <ul className="list-disc list-inside text-sm text-pbs-gray-600 dark:text-pbs-gray-400 space-y-1.5 ml-2">
            <li><strong>Account information:</strong> Name, email address, phone number, company name</li>
            <li><strong>Order information:</strong> Shipping address, billing details, order history</li>
            <li><strong>Communication data:</strong> Messages sent through our contact form, email, or WhatsApp</li>
            <li><strong>Artwork files:</strong> Logos, designs, and images you submit for custom printing</li>
            <li><strong>Usage data:</strong> Pages visited, features used, and interactions with our platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">2. How We Use Your Information</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed mb-3">
            We use your information to:
          </p>
          <ul className="list-disc list-inside text-sm text-pbs-gray-600 dark:text-pbs-gray-400 space-y-1.5 ml-2">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders, products, and services</li>
            <li>Provide customer support in English and Spanish</li>
            <li>Improve our products, services, and website experience</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">3. Information Sharing</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            We do not sell your personal information. We may share your information with trusted third parties only as necessary to provide our services, including shipping carriers for order delivery, payment processors for secure transactions, and printing partners for custom product manufacturing. All partners are required to maintain the confidentiality and security of your information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">4. Data Security</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. This includes encrypted data transmission (SSL/TLS), secure password storage, and regular security assessments. However, no method of internet transmission or electronic storage is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">5. Cookies & Tracking</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            Our website uses cookies and similar technologies to enhance your browsing experience, remember your preferences (such as language and theme), and analyze website traffic. You can control cookie preferences through your browser settings. Disabling cookies may limit certain features of our website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">6. Your Rights</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed mb-3">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-sm text-pbs-gray-600 dark:text-pbs-gray-400 space-y-1.5 ml-2">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal data</li>
            <li>Opt out of marketing communications at any time</li>
            <li>Request a copy of your data in a portable format</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">7. Data Retention</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. Order records are retained for a minimum of 7 years for accounting and tax purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">8. Children&apos;s Privacy</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will take steps to delete that information promptly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">9. Changes to This Policy</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this page periodically to stay informed about how we protect your information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-3">10. Contact Us</h2>
          <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            For questions or concerns about this Privacy Policy or your personal data, please contact us at{' '}
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
