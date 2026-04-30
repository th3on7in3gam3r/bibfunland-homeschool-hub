'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Scroll, ArrowRight, Grid, List as ListIcon,
  BookOpen, Wand2, FileText, X, SlidersHorizontal, Lock,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { PACK_CATEGORIES } from '@/lib/constants';

interface Pack {
  id: string;
  title: string;
  overview: string;
  gradeRange: string;
  theme: string;
  category: string;
}

const CATEGORY_COLORS: Record<string, { chip: string; dot: string }> = {
  'Bible Story':        { chip: 'bg-blue-50 text-blue-600 border-blue-200',   dot: 'bg-blue-500' },
  'Thematic':           { chip: 'bg-purple-50 text-purple-600 border-purple-200', dot: 'bg-purple-500' },
  'Academic Skill':     { chip: 'bg-green-50 text-green-600 border-green-200',  dot: 'bg-green-500' },
  'Memory Verse':       { chip: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  'Character & Virtue': { chip: 'bg-rose-50 text-rose-600 border-rose-200',    dot: 'bg-rose-500' },
  'Seasonal & Holiday': { chip: 'bg-orange-50 text-orange-600 border-orange-200', dot: 'bg-orange-500' },
};

const GRADE_RANGES = ['Preschool-K', 'Grades 1-2', 'Grades 3-4', 'Grades 5-6'];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-[24px] p-6 border-2 border-stone-100 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-stone-100 rounded-xl" />
        <div className="w-20 h-5 bg-stone-100 rounded-lg" />
      </div>
      <div className="h-5 bg-stone-100 rounded-lg mb-2 w-3/4" />
      <div className="h-4 bg-stone-100 rounded-lg mb-1 w-full" />
      <div className="h-4 bg-stone-100 rounded-lg w-2/3" />
      <div className="mt-5 pt-4 border-t border-stone-50 flex justify-between">
        <div className="w-16 h-4 bg-stone-100 rounded" />
        <div className="w-12 h-4 bg-stone-100 rounded" />
      </div>
    </div>
  );
}

export default function BrowsePage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeGrade, setActiveGrade] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({ limit: '50' });
    if (activeCategory) params.set('category', activeCategory);

    setLoading(true);
    fetch(`/api/packs?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setPacks(data.packs ?? []);
        setVisibleLimit(data.visibleLimit ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeCategory]);

  const filteredPacks = packs.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.overview?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = !activeGrade || p.gradeRange === activeGrade;
    return matchesSearch && matchesGrade;
  });

  const activeFilterCount = [activeCategory, activeGrade, searchTerm].filter(Boolean).length;

  const clearAll = () => {
    setSearchTerm('');
    setActiveCategory(null);
    setActiveGrade(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />

      {/* ── Page Header ──────────────────────────────────── */}
      <div className="bg-[#1E3A8A] pt-16 pb-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-blue-300 font-black text-xs uppercase tracking-widest mb-2">
                Scripture Library
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Browse Worksheet Packs
              </h1>
              <p className="text-blue-200 text-sm font-medium mt-2 max-w-lg">
                From Genesis to Revelation — find the perfect lesson for your homeschool.
              </p>
            </div>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all shrink-0 self-start sm:self-auto"
            >
              <Wand2 className="w-4 h-4" /> Create New Pack
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24">

        {/* ── Search + Controls ────────────────────────────── */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by story, theme, or keyword..."
              className="w-full bg-white border-2 border-stone-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:border-blue-400 focus:outline-none shadow-sm transition-all text-stone-800 placeholder:text-stone-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
              showFilters || activeFilterCount > 0
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-white text-blue-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* View toggle */}
          <div className="flex bg-white border-2 border-stone-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-all ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-stone-400 hover:text-stone-600'}`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 transition-all ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-stone-400 hover:text-stone-600'}`}
              aria-label="List view"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Filter Panel ─────────────────────────────────── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white border-2 border-stone-100 rounded-2xl p-5 mb-4 space-y-4">
                {/* Category */}
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Category</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveCategory(null)}
                      className={`px-3 py-1.5 rounded-lg border-2 font-black text-xs uppercase tracking-widest transition-all ${
                        !activeCategory ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-400 border-stone-100 hover:border-stone-300'
                      }`}
                    >
                      All
                    </button>
                    {PACK_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                        className={`px-3 py-1.5 rounded-lg border-2 font-black text-xs uppercase tracking-widest transition-all ${
                          activeCategory === cat
                            ? `${CATEGORY_COLORS[cat]?.chip ?? ''} border-current`
                            : 'bg-white text-stone-400 border-stone-100 hover:border-stone-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grade Range */}
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Grade Range</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveGrade(null)}
                      className={`px-3 py-1.5 rounded-lg border-2 font-black text-xs uppercase tracking-widest transition-all ${
                        !activeGrade ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-400 border-stone-100 hover:border-stone-300'
                      }`}
                    >
                      All Grades
                    </button>
                    {GRADE_RANGES.map((grade) => (
                      <button
                        key={grade}
                        onClick={() => setActiveGrade(activeGrade === grade ? null : grade)}
                        className={`px-3 py-1.5 rounded-lg border-2 font-black text-xs uppercase tracking-widest transition-all ${
                          activeGrade === grade
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-stone-400 border-stone-100 hover:border-stone-300'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results bar ──────────────────────────────────── */}
        {!loading && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-black text-stone-400 uppercase tracking-widest">
              {filteredPacks.length} {filteredPacks.length === 1 ? 'pack' : 'packs'} found
            </p>
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="text-xs font-black text-blue-500 hover:text-blue-700 uppercase tracking-widest transition-colors flex items-center gap-1">
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>
        )}

        {/* ── Content ──────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredPacks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white rounded-[32px] border-2 border-dashed border-stone-200"
          >
            <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <BookOpen className="w-8 h-8 text-stone-300" />
            </div>
            <h3 className="text-xl font-black text-stone-400 uppercase tracking-tight mb-2">
              No packs found
            </h3>
            <p className="text-stone-400 text-sm font-medium mb-6">
              {activeFilterCount > 0
                ? 'Try adjusting your filters or search term.'
                : 'Be the first to create a pack for this topic.'}
            </p>
            <div className="flex gap-3 justify-center">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="px-5 py-2.5 bg-stone-100 text-stone-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-stone-200 transition-all"
                >
                  Clear Filters
                </button>
              )}
              <Link
                href="/generate"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg border-b-2 border-blue-800"
              >
                <Wand2 className="w-4 h-4" /> Create a Pack
              </Link>
            </div>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPacks.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.04, 0.3) }}
                whileHover={{ y: -3 }}
              >
                <Link href={`/pack/${pack.id}`} className="block h-full">
                  <div className="group bg-white rounded-[24px] p-6 border-2 border-stone-100 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all h-full flex flex-col">
                    {/* Card header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {pack.category && CATEGORY_COLORS[pack.category] && (
                          <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[pack.category].dot}`} />
                        )}
                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                          {pack.category || 'Bible Story'}
                        </span>
                      </div>
                      <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg uppercase tracking-widest shrink-0">
                        {pack.gradeRange}
                      </span>
                    </div>

                    {/* Title + overview */}
                    <h3 className="text-base font-black text-stone-900 leading-tight tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                      {pack.title}
                    </h3>
                    <p className="text-stone-400 text-xs font-medium line-clamp-3 leading-relaxed flex-1">
                      {pack.overview}
                    </p>

                    {/* Footer */}
                    <div className="mt-5 pt-4 border-t border-stone-50 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] font-black text-stone-300 uppercase tracking-widest">
                        <FileText className="w-3.5 h-3.5" /> 6 Worksheets
                      </div>
                      <span className="flex items-center gap-1 text-blue-500 font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                        Open <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          /* List view */
          <div className="bg-white rounded-[24px] border-2 border-stone-100 overflow-hidden divide-y divide-stone-50">
            {filteredPacks.map((pack) => (
              <Link key={pack.id} href={`/pack/${pack.id}`}>
                <div className="flex items-center gap-4 px-5 py-4 hover:bg-blue-50/50 transition-colors group">
                  {/* Color dot */}
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${CATEGORY_COLORS[pack.category]?.dot ?? 'bg-stone-300'}`} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-stone-800 text-sm truncate group-hover:text-blue-600 transition-colors">
                      {pack.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                        {pack.gradeRange}
                      </span>
                      <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">
                        {pack.category}
                      </span>
                    </div>
                  </div>

                  {/* Worksheet count */}
                  <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest hidden sm:block shrink-0">
                    6 sheets
                  </span>

                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Upgrade banner when library is limited */}
        {!loading && visibleLimit !== null && (
          <div className="mt-10 bg-[#1E3A8A] rounded-[24px] p-8 text-center">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5 text-blue-900" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">
              You're seeing {visibleLimit} of many packs
            </h3>
            <p className="text-blue-200 text-sm font-medium mb-5 max-w-sm mx-auto">
              Upgrade to Student, Teacher, or Educator to unlock the full library.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all shadow-lg"
            >
              View Plans →
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
