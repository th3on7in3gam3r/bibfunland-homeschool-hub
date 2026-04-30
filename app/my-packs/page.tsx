'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  FileText, Search, Clock, Plus, 
  ArrowRight, Scroll, Star, LayoutGrid, List
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PackCardSkeleton } from '@/components/PackCardSkeleton';
import { useAuth } from '@/components/AuthProvider';

export default function MyPacksPage() {
  const { user, isLoaded } = useAuth();
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      setLoading(false);
      return;
    }

    fetch('/api/packs?mine=true')
      .then((r) => r.json())
      .then((data) => {
        setPacks(data.packs ?? []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load your packs:', err);
        setLoading(false);
      });
  }, [user, isLoaded]);

  if (isLoaded && !user) {
    return (
      <div className="min-h-screen bg-[#FAFAF5]">
        <Navbar />
        <div className="max-w-xl mx-auto py-32 px-6 text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <LayoutGrid className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-stone-900 mb-4 tracking-tight">Your Personal Library</h1>
          <p className="text-stone-500 font-medium mb-10 leading-relaxed">
            Sign in to see all the worksheet packs you've generated and re-download them anytime.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg border-b-4 border-blue-800"
          >
            Sign In to View
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />

      <main className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-blue-100">
              <Clock className="w-3 h-3" /> Dashboard
            </div>
            <h1 className="text-4xl font-black text-stone-900 tracking-tight">My Packs</h1>
            <p className="text-stone-500 font-medium mt-2">Everything you've created, all in one place.</p>
          </div>

          <Link
            href="/generate"
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2 shadow-lg border-b-4 border-blue-800"
          >
            <Plus className="w-5 h-5" /> Generate New Pack
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <PackCardSkeleton key={i} />)}
          </div>
        ) : packs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packs.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/pack/${pack.id}`} className="block h-full group">
                  <div className="bg-white border-2 border-stone-100 rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex flex-col h-full relative overflow-hidden">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-bl-[64px] -mr-16 -mt-16 group-hover:bg-blue-50 transition-colors" />
                    
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                        <Scroll className="w-7 h-7" />
                      </div>
                      <span className="text-[10px] font-black bg-stone-100 text-stone-500 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-stone-200">
                        {pack.gradeRange}
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-stone-900 leading-tight tracking-tight mb-3 group-hover:text-blue-600 transition-colors relative z-10">
                      {pack.title}
                    </h2>
                    
                    <p className="text-stone-500 text-sm font-medium line-clamp-3 leading-relaxed flex-1 mb-8 relative z-10">
                      {pack.overview}
                    </p>

                    <div className="pt-6 border-t border-stone-50 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-stone-400 group-hover:text-blue-600 transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                          {new Date(pack.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-blue-600 font-black text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">
                        Open Pack <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] border-4 border-dashed border-stone-100 py-32 text-center">
            <div className="w-20 h-20 bg-stone-50 text-stone-300 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Plus className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-stone-900 mb-3 tracking-tight">No Packs Yet</h2>
            <p className="text-stone-400 font-medium max-w-md mx-auto mb-10 leading-relaxed">
              Your generated packs will appear here. Start by creating your first Bible-based activity pack!
            </p>
            <Link
              href="/generate"
              className="inline-flex bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg border-b-4 border-blue-800"
            >
              Generate First Pack
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
