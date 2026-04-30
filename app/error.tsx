'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center bg-white rounded-[40px] p-12 shadow-xl border-4 border-stone-100">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-black text-stone-900 uppercase tracking-tight mb-3">
          Something went wrong
        </h1>
        <p className="text-stone-400 font-medium text-sm leading-relaxed mb-8">
          An unexpected error occurred. You can try refreshing the page or go back home.
        </p>
        {error.digest && (
          <p className="text-[10px] font-mono text-stone-300 mb-6 bg-stone-50 rounded-xl px-4 py-2">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 bg-stone-100 text-stone-700 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-stone-200 transition-all"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
