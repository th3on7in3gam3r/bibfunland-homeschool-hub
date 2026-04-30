'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import {
  X, Wand2, BookOpen, Printer, Star,
  GraduationCap, Check, ArrowRight,
} from 'lucide-react';
import { useAuth } from './AuthProvider';

const STORAGE_KEY = 'bfl_onboarded';



export function OnboardingModal() {
  const { user, loading: authLoading } = useAuth();
  const [show, setShow] = useState(false);
  const [tierData, setTierData] = useState<any>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    
    // Check if onboarded
    const alreadySeen = localStorage.getItem(STORAGE_KEY);
    if (alreadySeen) return;

    // Fetch tier data
    fetch('/api/user/tier')
      .then(r => r.json())
      .then(data => setTierData(data))
      .catch(() => {});

    // Small delay so the page renders first
    const t = setTimeout(() => setShow(true), 800);
    return () => clearTimeout(t);
  }, [user, authLoading]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setShow(false);
    fetch('/api/onboarding', { method: 'POST' }).catch(() => {});
  };

  const planName = tierData?.tierName ?? 'Free';
  const packsLimit = tierData?.packsLimit === null ? 'Unlimited' : (tierData?.packsLimit ?? '2');
  const worksheetsLimit = tierData?.worksheetsLimit ?? '6';
  const gradesLabel = tierData?.gradeRangeLabel ?? 'Preschool-K';

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
            onClick={dismiss}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl border-4 border-stone-100 flex flex-col max-h-[90vh] overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="bg-[#1E3A8A] px-8 pt-8 pb-10 text-center relative">
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 p-2 rounded-xl text-blue-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border-4 border-yellow-300 shadow-lg">
                <span className="text-blue-900 font-black text-2xl">B</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-1 uppercase">
                Welcome to BibleFunLand!
              </h2>
              <p className="text-blue-200 text-sm font-medium">
                You're on the <span className="text-yellow-300 font-black">{planName} Plan</span> — here's what you can do.
              </p>

              {/* Tier summary */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { value: packsLimit, label: tierData?.packsLimit === null ? 'Packs' : 'Packs/month' },
                  { value: worksheetsLimit, label: 'Worksheets' },
                  { value: gradesLabel, label: 'Grades' },
                ].map(({ value, label }) => (
                  <div key={label} className="bg-white/10 rounded-2xl py-3 px-2 border border-white/10 flex flex-col items-center justify-center min-h-[80px]">
                    <p className={`font-black text-white ${String(value).length > 6 ? 'text-sm' : 'text-2xl'}`}>{value}</p>
                    <p className="text-[9px] font-bold text-blue-300 uppercase tracking-widest text-center mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="px-8 py-6 space-y-4">
              {[
                {
                  icon: Wand2,
                  iconBg: 'bg-blue-100 text-blue-600',
                  title: 'Generate a Pack',
                  desc: 'Pick a Bible story and grade range. Our AI creates unique worksheets in about 30 seconds.',
                },
                {
                  icon: BookOpen,
                  iconBg: 'bg-yellow-100 text-yellow-600',
                  title: 'Browse the Library',
                  desc: 'Explore packs created by other educators. Filter by category and grade range.',
                },
                {
                  icon: Printer,
                  iconBg: 'bg-green-100 text-green-600',
                  title: 'Print & Teach',
                  desc: 'Select the worksheets you want, preview them, and save as PDF.',
                },
              ].map(({ icon: Icon, iconBg, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-stone-900 text-sm uppercase tracking-tight">{title}</h3>
                    <p className="text-stone-500 text-xs font-medium leading-relaxed mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/generate"
                onClick={dismiss}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg border-b-4 border-blue-800"
              >
                <Wand2 className="w-4 h-4" /> Create My First Pack
              </Link>
              <button
                onClick={dismiss}
                className="flex-1 flex items-center justify-center gap-2 bg-stone-100 text-stone-600 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-stone-200 transition-all"
              >
                <BookOpen className="w-4 h-4" /> Browse Library
              </button>
            </div>
          </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
