'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Check, X, Sparkles, Wand2, BookOpen, Download,
  Star, Zap, GraduationCap, Users, Lock,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/components/AuthProvider';
import { SignInButton } from '@clerk/nextjs';
import { TIERS, TIER_ORDER } from '@/lib/tiers';

const TIER_ICONS = {
  free: BookOpen,
  student: GraduationCap,
  teacher: Users,
  educator: Zap,
};

const TIER_STYLES = {
  free:     { card: 'bg-white border-stone-200',          badge: 'bg-stone-100 text-stone-600',    btn: 'bg-stone-100 text-stone-700 hover:bg-stone-200' },
  student:  { card: 'bg-white border-blue-200',           badge: 'bg-blue-100 text-blue-700',      btn: 'bg-blue-600 text-white hover:bg-blue-500 border-b-4 border-blue-800 shadow-lg' },
  teacher:  { card: 'bg-white border-purple-200',         badge: 'bg-purple-100 text-purple-700',  btn: 'bg-purple-600 text-white hover:bg-purple-500 border-b-4 border-purple-800 shadow-lg' },
  educator: { card: 'bg-[#1E3A8A] border-blue-700',       badge: 'bg-yellow-400 text-blue-900',    btn: 'bg-yellow-400 text-blue-900 hover:bg-yellow-300 border-b-4 border-yellow-600 shadow-lg' },
};

const FEATURE_ROWS = [
  { label: 'Pack generations / month', key: 'packsPerMonth' as const },
  { label: 'Worksheets per pack',      key: 'worksheetsPerPack' as const },
  { label: 'Library access',           key: 'library' as const },
  { label: 'Grade ranges',             key: 'grades' as const },
  { label: 'AI expansion ideas',       key: 'aiIdeas' as const },
  { label: 'Pack editing',             key: 'canEdit' as const },
  { label: 'Drag-to-reorder',          key: 'canReorder' as const },
];

function featureValue(tier: keyof typeof TIERS, key: string): React.ReactNode {
  const limits = TIERS[tier].limits as any;
  switch (key) {
    case 'packsPerMonth':
      return limits.packsPerMonth === null ? <span className="text-green-500 font-black">Unlimited</span> : limits.packsPerMonth;
    case 'worksheetsPerPack':
      return `${limits.worksheetsPerPack} of 6`;
    case 'library':
      return limits.visibleLibraryPacks === null
        ? <span className="text-green-500 font-black">Full library</span>
        : `First ${limits.visibleLibraryPacks} packs`;
    case 'grades':
      return limits.grades.length === 4
        ? <span className="text-green-500 font-black">All grades</span>
        : limits.grades.join(', ');
    case 'aiIdeas':
      return limits.aiIdeas === 0
        ? <X className="w-4 h-4 text-stone-300 mx-auto" />
        : limits.aiIdeas;
    case 'canEdit':
    case 'canReorder':
      return limits[key]
        ? <Check className="w-4 h-4 text-green-500 mx-auto" />
        : <X className="w-4 h-4 text-stone-300 mx-auto" />;
    default:
      return '—';
  }
}

export default function PricingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />

      {/* Header */}
      <div className="bg-[#1E3A8A] pt-16 pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-yellow-400 rounded-full px-4 py-1.5 text-blue-900 font-black text-xs uppercase tracking-widest mb-5 border-2 border-yellow-300"
        >
          <Sparkles className="w-3.5 h-3.5" /> Choose Your Plan
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4"
        >
          Start Free. Grow as You Teach.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-blue-200 text-base font-medium max-w-xl mx-auto"
        >
          Every plan includes Bible-based content. Upgrade to unlock more grades, more worksheets, and unlimited creation.
        </motion.p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TIER_ORDER.map((tierKey, i) => {
            const tier = TIERS[tierKey];
            const Icon = TIER_ICONS[tierKey];
            const styles = TIER_STYLES[tierKey];
            const isEducator = tierKey === 'educator';
            const textColor = isEducator ? 'text-white' : 'text-stone-900';
            const subColor = isEducator ? 'text-blue-200' : 'text-stone-500';
            const featureColor = isEducator ? 'text-blue-100' : 'text-stone-600';

            return (
              <motion.div
                key={tierKey}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-[24px] border-2 p-6 flex flex-col shadow-sm ${styles.card} ${tierKey === 'teacher' ? 'ring-2 ring-purple-400 ring-offset-2' : ''}`}
              >
                {tierKey === 'teacher' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-purple-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-white shadow">
                    <Star className="w-2.5 h-2.5 fill-white" /> Most Popular
                  </div>
                )}

                <div className="mb-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${styles.badge}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className={`text-lg font-black uppercase tracking-tight mb-1 ${textColor}`}>{tier.name}</h2>
                  <div className="flex items-end gap-1 mb-2">
                    {tier.price === 0 ? (
                      <span className={`text-3xl font-black ${textColor}`}>Free</span>
                    ) : (
                      <>
                        <span className={`text-3xl font-black ${textColor}`}>${tier.price}</span>
                        <span className={`text-sm font-bold mb-0.5 ${subColor}`}>/mo</span>
                      </>
                    )}
                  </div>
                  <p className={`text-xs font-medium leading-relaxed ${subColor}`}>{tier.description}</p>
                </div>

                {/* Feature list */}
                <ul className="space-y-2.5 flex-1 mb-6">
                  {[
                    `${tier.limits.packsPerMonth === null ? 'Unlimited' : tier.limits.packsPerMonth} pack${tier.limits.packsPerMonth === 1 ? '' : 's'}/month`,
                    `${tier.limits.worksheetsPerPack} of 6 worksheets per pack`,
                    tier.limits.visibleLibraryPacks === null ? 'Full library access' : `First ${tier.limits.visibleLibraryPacks} library packs`,
                    tier.limits.grades.length === 4 ? 'All grade ranges' : tier.limits.grades.join(' & '),
                    tier.limits.aiIdeas > 0 ? `${tier.limits.aiIdeas} AI expansion idea${tier.limits.aiIdeas > 1 ? 's' : ''}` : null,
                    tier.limits.canEdit ? 'Pack editing' : null,
                    tier.limits.canReorder ? 'Drag-to-reorder worksheets' : null,
                  ].filter(Boolean).map((f) => (
                    <li key={f as string} className="flex items-start gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isEducator ? 'bg-yellow-400' : 'bg-green-100'}`}>
                        <Check className={`w-2.5 h-2.5 ${isEducator ? 'text-blue-900' : 'text-green-600'}`} />
                      </div>
                      <span className={`text-xs font-medium ${featureColor}`}>{f as string}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {tier.price === 0 ? (
                  user ? (
                    <Link href="/generate" className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest text-center transition-all ${styles.btn}`}>
                      <Wand2 className="w-3.5 h-3.5 inline mr-1.5" /> Start Creating
                    </Link>
                  ) : (
                    <SignInButton mode="modal">
                      <button className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${styles.btn}`}>
                        Get Started Free
                      </button>
                    </SignInButton>
                  )
                ) : (
                  <button 
                    onClick={async () => {
                      if (!user) {
                        // User needs to sign in first, but the button handles this via standard clerk if we were to wrap it.
                        // For now, simpler: alert them. Or you can add a SignInButton wrap here too.
                        alert('Please sign in to upgrade.');
                        return;
                      }
                      try {
                        const res = await fetch('/api/stripe/checkout', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ tier: tierKey }),
                        });
                        const data = await res.json();
                        if (data.url) window.location.href = data.url;
                        else alert('Checkout failed to start.');
                      } catch (e) {
                        console.error('Checkout error', e);
                      }
                    }}
                    className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${styles.btn}`}
                  >
                    Upgrade
                  </button>
                )}

              </motion.div>
            );
          })}
        </div>

        {/* Comparison table */}
        <div className="mt-16 bg-white rounded-[24px] border-2 border-stone-100 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-stone-100">
            <h2 className="text-lg font-black text-stone-900 uppercase tracking-tight">Full Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left px-6 py-4 font-black text-stone-400 text-xs uppercase tracking-widest w-1/3">Feature</th>
                  {TIER_ORDER.map((t) => (
                    <th key={t} className="px-4 py-4 font-black text-stone-700 text-xs uppercase tracking-widest text-center">
                      {TIERS[t].name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_ROWS.map(({ label, key }, i) => (
                  <tr key={key} className={i % 2 === 0 ? 'bg-stone-50/50' : ''}>
                    <td className="px-6 py-3.5 font-medium text-stone-600 text-xs">{label}</td>
                    {TIER_ORDER.map((t) => (
                      <td key={t} className="px-4 py-3.5 text-center text-xs font-bold text-stone-700">
                        {featureValue(t, key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-14">
          <h2 className="text-2xl font-black text-stone-900 uppercase tracking-tight text-center mb-8">Common Questions</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { q: 'What counts as a pack generation?', a: 'Each time you click "Generate Pack" and Claude creates worksheets, that counts as one generation toward your monthly limit.' },
              { q: 'Can I still browse packs on the free plan?', a: 'Yes — free users can see the first 6 packs in the library. Upgrade to Student or higher to access the full library.' },
              { q: 'Why does the free plan only include Preschool-K?', a: 'The free plan is a taste of what\'s possible. Upgrade to Student for Grades 1-2, or Teacher/Educator for all grades.' },
              { q: 'When will paid plans be available?', a: 'Stripe payments are coming soon. Sign up free now and you\'ll be notified when paid plans launch.' },
              { q: 'Can I cancel anytime?', a: 'Yes — all paid plans are month-to-month. Cancel anytime through the Stripe Customer Portal with no penalties.' },
              { q: 'What\'s the difference between Teacher and Educator?', a: 'Both get full access to all grades and 6 worksheets per pack. Educator adds unlimited generation — no monthly cap.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl border-2 border-stone-100 p-6">
                <h3 className="font-black text-stone-900 text-sm mb-2">{q}</h3>
                <p className="text-stone-500 text-sm font-medium leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 bg-[#1E3A8A] rounded-[28px] p-10 text-center">
          <Download className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
            Start Free Today
          </h2>
          <p className="text-blue-200 text-sm font-medium mb-6 max-w-md mx-auto">
            No credit card required. Generate your first Bible-themed worksheet pack in under a minute.
          </p>
          {user ? (
            <Link href="/generate" className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-yellow-300 transition-all shadow-lg">
              <Wand2 className="w-4 h-4" /> Create Your First Pack
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-yellow-300 transition-all shadow-lg">
                <Wand2 className="w-4 h-4" /> Get Started Free
              </button>
            </SignInButton>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
