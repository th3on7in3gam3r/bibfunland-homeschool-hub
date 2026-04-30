import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Shield } from 'lucide-react';

const LAST_UPDATED = 'April 29, 2026';

export const metadata = {
  title: 'Privacy Policy — BibleFunLand Homeschool Hub',
  description: 'Privacy Policy for BibleFunLand Homeschool Hub.',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-black text-stone-900 uppercase tracking-tight mb-3 pb-2 border-b-2 border-stone-100">
        {title}
      </h2>
      <div className="text-stone-600 text-sm font-medium leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />

      {/* Header */}
      <div className="bg-[#1E3A8A] pt-16 pb-12 px-6 text-center">
        <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6 text-blue-900" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-blue-300 text-sm font-medium">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-14 pb-20">
        <div className="bg-white rounded-[28px] border-2 border-stone-100 p-8 sm:p-12 shadow-sm">

          <p className="text-stone-500 text-sm font-medium leading-relaxed mb-10">
            BibleFunLand Homeschool Hub ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information when you use our service at{' '}
            <a href="https://homeschool.biblefunland.com" className="text-blue-600 hover:underline">
              homeschool.biblefunland.com
            </a>.
          </p>

          <Section title="1. Information We Collect">
            <p><strong className="text-stone-800">Account Information</strong></p>
            <p>
              When you sign in, we use Clerk for authentication. Clerk collects your name, email address, and profile photo (if provided via OAuth). We store your Clerk user ID in our database to associate your created packs with your account.
            </p>
            <p><strong className="text-stone-800">Content You Create</strong></p>
            <p>
              Worksheet packs and worksheets you generate are stored in our Turso (libSQL) database. This includes the theme, grade range, category, and AI-generated content of each pack.
            </p>
            <p><strong className="text-stone-800">Testimonials</strong></p>
            <p>
              If you submit a community testimonial, we store your display name, the content of your review, and your rating.
            </p>
            <p><strong className="text-stone-800">Usage Data</strong></p>
            <p>
              We track the number of packs you generate per calendar month to enforce free-tier limits. We do not use third-party analytics trackers.
            </p>
            <p><strong className="text-stone-800">Payment Information</strong></p>
            <p>
              If you subscribe to the Pro plan, payment is processed by Stripe. We never store your credit card number or full payment details. We store only your Stripe customer ID and subscription status in our database.
            </p>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-1">
              <li>To authenticate you and maintain your session via Clerk.</li>
              <li>To associate worksheet packs with your account so you can manage them.</li>
              <li>To enforce free-tier generation limits (3 packs/month).</li>
              <li>To process subscription payments via Stripe.</li>
              <li>To display community testimonials you have submitted.</li>
              <li>To improve the service and troubleshoot issues.</li>
            </ul>
            <p>
              We do not sell your personal information to third parties. We do not use your data for advertising purposes.
            </p>
          </Section>

          <Section title="3. AI Content Generation">
            <p>
              When you generate a worksheet pack, your theme and grade range are sent to Anthropic's Claude API to produce educational content. Anthropic's{' '}
              <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>{' '}
              governs how they handle data sent to their API. We do not send personally identifiable information to Anthropic — only the theme and grade range you provide.
            </p>
          </Section>

          <Section title="4. Data Storage and Security">
            <p>
              Your data is stored in a Turso (libSQL) database hosted on AWS infrastructure. We use industry-standard security practices including encrypted connections (TLS) and token-based database authentication.
            </p>
            <p>
              Authentication is handled by Clerk, which is SOC 2 Type II certified. Payment processing is handled by Stripe, which is PCI DSS Level 1 certified.
            </p>
            <p>
              While we take reasonable measures to protect your data, no system is completely secure. We cannot guarantee absolute security of your information.
            </p>
          </Section>

          <Section title="5. Cookies and Local Storage">
            <p>
              We use cookies set by Clerk to maintain your authentication session. These are essential cookies required for the service to function. We do not use advertising or tracking cookies.
            </p>
          </Section>

          <Section title="6. Children's Privacy">
            <p>
              BibleFunLand Homeschool Hub is designed for use by parents and educators, not directly by children. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.
            </p>
            <p>
              Worksheet content is designed for children ages 3–12, but account creation and data collection is only for adult users (parents and educators).
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-stone-800">Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong className="text-stone-800">Deletion:</strong> Request deletion of your account and associated data. You can delete your packs from your profile page. To delete your account entirely, contact us.</li>
              <li><strong className="text-stone-800">Correction:</strong> Update your name or email through your Clerk account settings.</li>
              <li><strong className="text-stone-800">Portability:</strong> Request an export of your generated packs.</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:privacy@biblefunland.com" className="text-blue-600 hover:underline">
                privacy@biblefunland.com
              </a>.
            </p>
          </Section>

          <Section title="8. Third-Party Services">
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-stone-800">Clerk</strong> — Authentication.{' '}
                <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Privacy Policy</a>
              </li>
              <li>
                <strong className="text-stone-800">Turso</strong> — Database hosting.{' '}
                <a href="https://turso.tech/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Privacy Policy</a>
              </li>
              <li>
                <strong className="text-stone-800">Anthropic</strong> — AI content generation.{' '}
                <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Privacy Policy</a>
              </li>
              <li>
                <strong className="text-stone-800">Stripe</strong> — Payment processing.{' '}
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Privacy Policy</a>
              </li>
            </ul>
          </Section>

          <Section title="9. Data Retention">
            <p>
              We retain your account data and generated packs for as long as your account is active. If you delete a pack, it is permanently removed from our database. If you request account deletion, we will remove your personal data within 30 days.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by updating the "Last updated" date at the top of this page. Continued use of the Hub after changes constitutes acceptance of the revised policy.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 mt-2">
              <p className="font-black text-stone-800 text-sm">BibleFunLand Homeschool Hub</p>
              <p className="text-stone-500 text-sm mt-1">
                Email:{' '}
                <a href="mailto:privacy@biblefunland.com" className="text-blue-600 hover:underline">
                  privacy@biblefunland.com
                </a>
              </p>
              <p className="text-stone-500 text-sm">
                Website:{' '}
                <a href="https://biblefunland.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  biblefunland.com
                </a>
              </p>
            </div>
          </Section>

          <div className="mt-10 pt-8 border-t-2 border-stone-100 flex flex-col sm:flex-row gap-3">
            <Link
              href="/terms"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-100 text-stone-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-stone-200 transition-all"
            >
              Terms of Use →
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg border-b-2 border-blue-800"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
