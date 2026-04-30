import React from 'react';
import Link from 'next/link';
import { BookOpen, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center bg-white rounded-[40px] p-12 shadow-xl border-4 border-stone-100">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-6xl font-black text-stone-200 mb-2">404</h1>
        <h2 className="text-2xl font-black text-stone-900 uppercase tracking-tight mb-3">
          Page Not Found
        </h2>
        <p className="text-stone-400 font-medium text-sm leading-relaxed mb-8">
          This page doesn't exist. It may have been moved or deleted.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 transition-all"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link
            href="/browse"
            className="flex items-center gap-2 bg-stone-100 text-stone-700 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-stone-200 transition-all"
          >
            <Search className="w-4 h-4" /> Browse Packs
          </Link>
        </div>
      </div>
    </div>
  );
}
