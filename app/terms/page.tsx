import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FileText } from 'lucide-react';

const LAST_UPDATED = 'April 29, 2026';

export const metadata = {
  title: 'Terms of Use — BibleFunLand Homeschool Hub',
  description: 'Terms of Use for BibleFunLand Homeschool Hub.',
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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />

      {/* Header */}
      <div className="bg-[#1E3A8A] pt-16 pb-12 px-6 text-center">
        <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-6 h-6 text-blue-900" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          Terms of Use
        </h1>
        <p className="text-blue-300 text-sm font-medium">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-14 pb-20">
        <div className="bg-white rounded-[28px] border-2 border-stone-100 p-8 sm:p-12 shadow-sm">

          <p className="text-stone-500 text-sm font-medium leading-relaxed mb-10">
            Welcome to BibleFunLand Homeschool Hub ("the Hub", "we", "us", or "our"). By accessing or using our website at{' '}
            <a href="https://homeschool.biblefunland.com" className="text-blue-600 hover:underline">
              homeschool.biblefunland.com
            </a>{' '}
            you agree to be bound by these Terms of Use. Please read them carefully.
          </p>

          <Section title="1. Acceptance of Terms">
            <p>
              By creating an account or using any part of the Hub, you confirm that you are at least 18 years old (or the legal age of majority in your jurisdiction) and that you agree to these Terms. If you do not agree, please do not use the Hub.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              BibleFunLand Homeschool Hub is an AI-powered platform that allows registered users to generate, browse, and print Bible-themed educational worksheet packs for children ages 3–12. Content is generated using Anthropic's Claude AI model.
            </p>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice.
            </p>
          </Section>

          <Section title="3. User Accounts">
            <p>
              You must create an account via Clerk authentication to generate or download worksheet packs. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.
            </p>
            <p>
              You agree to provide accurate and complete information when creating your account and to update it as necessary.
            </p>
          </Section>

          <Section title="4. Acceptable Use">
            <p>You agree to use the Hub only for lawful purposes. You may not:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the Hub to generate content that is harmful, abusive, or violates any applicable law.</li>
              <li>Attempt to reverse-engineer, scrape, or systematically download content from the Hub.</li>
              <li>Resell or redistribute AI-generated worksheet packs as your own commercial product without our written permission.</li>
              <li>Use automated tools to generate packs in bulk beyond normal personal or classroom use.</li>
              <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity.</li>
            </ul>
          </Section>

          <Section title="5. Intellectual Property">
            <p>
              The Hub's design, branding, code, and non-AI-generated content are owned by BibleFunLand and protected by applicable intellectual property laws.
            </p>
            <p>
              AI-generated worksheet content is provided for your personal, non-commercial homeschool use. You may print and use worksheets for your own household or classroom. You may not sell, license, or commercially distribute generated worksheets without our express written consent.
            </p>
            <p>
              Scripture quotations are from the Holy Bible, New International Version® (NIV®) or English Standard Version® (ESV®), used under fair use for educational purposes.
            </p>
          </Section>

          <Section title="6. Free and Pro Plans">
            <p>
              Free accounts may generate up to 3 worksheet packs per calendar month. Pro subscribers ($7.99/month) receive unlimited generation. Plan limits and pricing are subject to change with reasonable notice.
            </p>
            <p>
              Subscription billing is handled by Stripe. By subscribing, you agree to Stripe's terms of service. You may cancel your subscription at any time through the Stripe Customer Portal.
            </p>
          </Section>

          <Section title="7. Disclaimer of Warranties">
            <p>
              The Hub is provided "as is" and "as available" without warranties of any kind, express or implied. We do not warrant that the service will be uninterrupted, error-free, or that AI-generated content will be theologically accurate in all cases. Always review generated content before use with children.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, BibleFunLand shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Hub, even if we have been advised of the possibility of such damages.
            </p>
          </Section>

          <Section title="9. Termination">
            <p>
              We reserve the right to suspend or terminate your account at our sole discretion if you violate these Terms or engage in conduct we deem harmful to the Hub or its users.
            </p>
          </Section>

          <Section title="10. Changes to Terms">
            <p>
              We may update these Terms from time to time. We will notify you of material changes by updating the "Last updated" date above. Continued use of the Hub after changes constitutes acceptance of the revised Terms.
            </p>
          </Section>

          <Section title="11. Governing Law">
            <p>
              These Terms are governed by the laws of the United States. Any disputes shall be resolved in the applicable courts of the United States.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              If you have questions about these Terms, please contact us at{' '}
              <a href="mailto:support@biblefunland.com" className="text-blue-600 hover:underline">
                support@biblefunland.com
              </a>
              .
            </p>
          </Section>

          <div className="mt-10 pt-8 border-t-2 border-stone-100 flex flex-col sm:flex-row gap-3">
            <Link
              href="/privacy"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-100 text-stone-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-stone-200 transition-all"
            >
              Privacy Policy →
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
