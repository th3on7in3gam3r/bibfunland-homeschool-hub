'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Scroll, PlusCircle, Printer, LogOut, BookOpen,
  LayoutGrid, Star, Loader2, Trash2, User,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/components/AuthProvider';
import { useUser, useClerk, SignInButton } from '@clerk/nextjs';

interface Pack {
  id: string;
  title: string;
  overview: string;
  gradeRange: string;
  theme: string;
  createdAt: string;
}

interface Stats {
  totalPacks: number;
  totalWorksheets: number;
}

interface Subscription {
  tier: string;
  tierName: string;
  packsUsedThisMonth: number;
  packsLimit: number | null;
}

const ROLES = [
  'Educator',
  'Homeschool Mom',
  'Homeschool Dad',
  'Sunday School Teacher',
  'Children\'s Ministry Leader',
  'Parent',
  'Other',
];

export default function ProfilePage() {
  const { user: authUser, loading } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [packs, setPacks] = useState<Pack[]>([]);
  const [stats, setStats] = useState<Stats>({ totalPacks: 0, totalWorksheets: 0 });
  const [subscription, setSubscription] = useState<Subscription>({ tier: 'free', tierName: 'Free', packsUsedThisMonth: 0, packsLimit: 1 });
  const [dataLoading, setDataLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser) return;
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        setPacks(data.packs ?? []);
        setStats(data.stats ?? { totalPacks: 0, totalWorksheets: 0 });
        setSubscription(data.subscription ?? { tier: 'free', tierName: 'Free', packsUsedThisMonth: 0, packsLimit: 1 });
        setDataLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
        setDataLoading(false);
      });
  }, [authUser]);

  const handleDelete = async (packId: string) => {
    if (!confirm('Delete this pack and all its worksheets?')) return;
    setDeletingId(packId);
    try {
      const res = await fetch(`/api/packs/${packId}`, { method: 'DELETE' });
      if (res.ok) {
        setPacks((prev) => prev.filter((p) => p.id !== packId));
        setStats((prev) => ({ ...prev, totalPacks: prev.totalPacks - 1 }));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF5]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-[#FAFAF5]">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white rounded-[40px] p-16 border-4 border-stone-100 shadow-xl max-w-md">
            <User className="w-16 h-16 text-stone-200 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-stone-900 uppercase tracking-tight mb-4">
              Sign In Required
            </h2>
            <p className="text-stone-400 font-medium mb-8">
              Sign in to view your profile and worksheet packs.
            </p>
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 transition-all">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    );
  }

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />

      <main className="max-w-6xl mx-auto pt-20 md:pt-28 pb-24 px-4 sm:px-6">

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#3B82F6] rounded-[40px] p-10 mb-10 border-b-8 border-[#2563EB] relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none">
            <BookOpen className="w-full h-full text-white" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
            {/* Avatar */}
            <div className="relative shrink-0">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={authUser.displayName ?? 'User'}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-[20px] sm:rounded-[24px] border-4 border-white shadow-xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[20px] sm:rounded-[24px] border-4 border-white shadow-xl bg-yellow-400 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-black text-blue-900">
                    {(authUser.displayName ?? authUser.email ?? 'U')[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-400 rounded-full border-4 border-white" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase leading-tight truncate">
                  {authUser.displayName ?? 'Educator'}
                </h1>
                {subscription.tier === 'educator' && (
                  <span className="bg-yellow-400 text-blue-900 text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg border-b-2 border-yellow-600 uppercase tracking-widest">
                    EDUCATOR
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-blue-100 font-bold text-sm truncate">{authUser.email}</p>
                {joinDate && (
                  <span className="text-blue-200/60 font-bold text-xs uppercase tracking-widest">
                    &bull; Joined {joinDate}
                  </span>
                )}
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/20 shrink-0"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-8 relative z-10">
            <div className="bg-white/15 rounded-[20px] p-4 sm:p-6 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <LayoutGrid className="w-4 h-4 text-yellow-300 shrink-0" />
                <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest leading-tight">Packs</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white">{stats.totalPacks}</p>
            </div>

            <div className="bg-white/15 rounded-[20px] p-4 sm:p-6 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Scroll className="w-4 h-4 text-yellow-300 shrink-0" />
                <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest leading-tight">Sheets</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white">{stats.totalWorksheets}</p>
            </div>

            <div className="bg-white/15 rounded-[20px] p-4 sm:p-6 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-300 shrink-0" />
                <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest leading-tight">Plan</span>
              </div>
              <p className="text-base sm:text-xl font-black text-white uppercase tracking-tight">{subscription.tierName}</p>
              {subscription.packsLimit !== null && (
                <p className="text-[10px] text-blue-300 font-bold mt-1">
                  {subscription.packsUsedThisMonth}/{subscription.packsLimit} this month
                </p>
              )}
            </div>
          </div>

          {subscription.tier !== 'free' && subscription.tier !== 'educator' && (
              <a href="/api/stripe/portal" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mt-3 inline-block">
                Manage Subscription
              </a>
            )}
            {subscription.tier === 'free' && (
              <div className="mt-4 pt-4 border-t border-blue-500/30">
                <Link href="/pricing" className="text-yellow-300 hover:text-yellow-200 text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-300" /> Upgrade Plan
                </Link>
              </div>
            )}
        </motion.div>

        {/* My Packs */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Your Library</h2>
            <h3 className="text-3xl font-black text-stone-900 tracking-tighter uppercase">My Packs</h3>
          </div>
          <Link
            href="/generate"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> New Pack
          </Link>
        </div>

        {dataLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
          </div>
        ) : packs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white rounded-[40px] border-4 border-dashed border-stone-100"
          >
            <Scroll className="w-16 h-16 text-stone-200 mx-auto mb-6" />
            <h3 className="text-xl font-black text-stone-300 uppercase tracking-tight mb-4">
              No packs yet
            </h3>
            <p className="text-stone-400 font-medium mb-8">
              Create your first AI-powered worksheet pack.
            </p>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 transition-all"
            >
              <PlusCircle className="w-5 h-5" /> Create First Pack
            </Link>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packs.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[32px] border-4 border-stone-50 hover:border-blue-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
              >
                <div className="p-8 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-yellow-100 w-12 h-12 rounded-2xl flex items-center justify-center text-yellow-600 group-hover:bg-yellow-400 group-hover:text-white transition-colors shrink-0">
                      <Scroll className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-lg uppercase tracking-widest">
                      {pack.gradeRange}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                    {pack.title}
                  </h3>
                  <p className="text-stone-400 text-xs font-medium line-clamp-2 leading-relaxed">
                    {pack.overview}
                  </p>

                  {pack.createdAt && (
                    <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mt-4">
                      {new Date(pack.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </p>
                  )}
                </div>

                {/* Card footer */}
                <div className="px-8 pb-8 flex items-center gap-3">
                  <Link
                    href={`/pack/${pack.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-stone-700 transition-all"
                  >
                    <Printer className="w-4 h-4" /> View & Print
                  </Link>
                  <button
                    onClick={() => handleDelete(pack.id)}
                    disabled={deletingId === pack.id}
                    className="p-3 bg-stone-50 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border-2 border-transparent hover:border-red-100"
                    aria-label="Delete pack"
                  >
                    {deletingId === pack.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
