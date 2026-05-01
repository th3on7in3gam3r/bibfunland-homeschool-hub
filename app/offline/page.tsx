'use client';

import Link from 'next/link';
import { WifiOff, BookOpen, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="w-20 h-20 bg-[#1E3A8A] rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-xl">
          <span className="text-yellow-400 font-black text-3xl">B</span>
        </div>

        <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-7 h-7 text-stone-400" />
        </div>

        <h1 className="text-2xl font-black text-stone-900 uppercase tracking-tight mb-3">
          You're Offline
        </h1>
        <p className="text-stone-500 font-medium text-sm leading-relaxed mb-8">
          No internet connection right now. Any packs you've already visited are still available below.
        </p>

        {/* Bible verse for comfort */}
        <div className="bg-[#1E3A8A] rounded-2xl p-6 mb-8 text-left">
          <p className="text-blue-100 text-sm font-medium leading-relaxed italic mb-3">
            "Your word is a lamp to my feet and a light to my path."
          </p>
          <p className="text-yellow-400 font-black text-xs uppercase tracking-widest">
            Psalm 119:105
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 bg-[#1E3A8A] text-white px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-800 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/browse"
            className="flex items-center justify-center gap-2 bg-stone-100 text-stone-700 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-stone-200 transition-all"
          >
            <BookOpen className="w-4 h-4" /> Browse Cached Packs
          </Link>
        </div>
      </div>
    </div>
  );
}
