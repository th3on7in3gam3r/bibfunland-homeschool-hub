'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Loader2, BookOpen, Tag, Lock, TrendingUp } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/components/AuthProvider';
import { SignInButton } from '@clerk/nextjs';
import { User } from 'lucide-react';
import { PACK_CATEGORIES } from '@/lib/constants';
import { TIERS, canAccessGrade } from '@/lib/tiers';
import type { TierKey } from '@/lib/tiers';
import Link from 'next/link';

const GRADE_RANGES = [
  'Preschool-K',
  'Grades 1-2',
  'Grades 3-4',
  'Grades 5-6',
];

const SUGGESTED_THEMES = [
  "Noah's Ark",
  'The Fruit of the Spirit',
  'David and Goliath',
  'Creation Week',
  'Jesus Feeds the 5,000',
  'The Armor of God',
];

const PRESET_TEMPLATES = [
  // ── Original 3 ──────────────────────────────────────────────────────────
  {
    title: 'David and Goliath: Faith & Courage',
    theme: "David and Goliath (1 Samuel 17). Include: 1. A size comparison chart activity. 2. Compare & Contrast between David and Saul's armor. 3. Discussion questions: 'What made David brave?' and 'How does God help us face big problems?'. 4. Memory Verse: 1 Samuel 17:45-47.",
    range: 'Grades 5-6',
  },
  {
    title: "Noah's Ark: Flood Math",
    theme: "Noah's Ark Math focus (Genesis 6-9). Include 5 specific problems: animal pairs (if there are 10 pairs of birds, how many wings?), counting 40 days/nights, ark dimensions, and food gathering. Memory Verse: Genesis 7:4.",
    range: 'Grades 1-2',
  },
  {
    title: '7 Days of Creation Adventure',
    theme: 'The 7 Days of Creation (Genesis 1-2). Include: 1. Sequencing activity (Day 1-7). 2. Matching items to days. 3. A large coloring page for Day 7 (Rest). 4. Memory Verse: Genesis 2:2.',
    range: 'Preschool-K',
  },

  // ── 10 New Templates (spec requirement) ─────────────────────────────────
  {
    title: 'Moses and the Burning Bush',
    theme: "Moses and the Burning Bush (Exodus 3-4). Include: 1. Story sequencing cards (Moses tending flocks → burning bush → God speaks → Moses objects → God reassures). 2. Vocabulary matching: holy ground, I AM, staff, Pharaoh. 3. Writing prompt: 'If God called your name, what would you say?'. 4. Simple map tracing Moses's journey from Midian to Egypt. Memory Verse: Exodus 3:14.",
    range: 'Grades 3-4',
  },
  {
    title: 'The Good Samaritan: Loving Your Neighbor',
    theme: "The Good Samaritan (Luke 10:25-37). Include: 1. Story retelling with 4 character cards (traveler, priest, Levite, Samaritan). 2. Reading comprehension questions. 3. Real-life application: 'Who is your neighbor? Draw 3 ways you can help someone this week.' 4. Character trait focus: compassion and kindness. Memory Verse: Luke 10:27.",
    range: 'Grades 1-2',
  },
  {
    title: 'Jonah and the Whale: Running from God',
    theme: "Jonah and the Whale (Jonah 1-4). Include: 1. Story map with 5 scenes (Jonah runs → storm → overboard → inside the fish → Nineveh). 2. Ocean-themed math: counting fish, measuring the whale. 3. Discussion: 'Have you ever tried to run away from something hard? What happened?'. 4. Coloring activity of Jonah inside the great fish. Memory Verse: Jonah 2:1.",
    range: 'Preschool-K',
  },
  {
    title: 'The Birth of Jesus: The Nativity Story',
    theme: "The Birth of Jesus — The Nativity (Luke 2:1-20, Matthew 2:1-12). Include: 1. Nativity scene character matching (Mary, Joseph, shepherds, wise men, angels, baby Jesus). 2. Sequencing the Christmas story in order. 3. Counting activity: 3 wise men, 1 star, 2 parents, many angels. 4. Creative drawing: 'Draw what you would bring as a gift for baby Jesus.' Memory Verse: Luke 2:11.",
    range: 'Preschool-K',
  },
  {
    title: "Daniel in the Lions' Den: Trusting God",
    theme: "Daniel in the Lions' Den (Daniel 6). Include: 1. Story comprehension questions (Why was Daniel thrown in? What did the king do all night? What happened in the morning?). 2. Character study: Daniel's faith habits — praying 3 times a day. 3. Writing prompt: 'Describe a time you had to be brave and do the right thing even when it was hard.' 4. Lion-themed math word problems. Memory Verse: Daniel 6:22.",
    range: 'Grades 3-4',
  },
  {
    title: 'The Ten Commandments: God\'s Rules for Life',
    theme: "The Ten Commandments (Exodus 20:1-17). Include: 1. Matching each commandment to a modern-day example. 2. Sorting activity: 'Loving God' commandments vs 'Loving Others' commandments. 3. Fill-in-the-blank with the commandments. 4. Discussion: 'Why do you think God gave us these rules?' Memory Verse: Exodus 20:3.",
    range: 'Grades 3-4',
  },
  {
    title: 'The Prodigal Son: Grace and Forgiveness',
    theme: "The Prodigal Son (Luke 15:11-32). Include: 1. Story sequencing (son asks for inheritance → leaves → wastes money → returns → father celebrates). 2. Emotion chart: How did each character feel at each stage? 3. Writing prompt: 'Write about a time someone forgave you or you forgave someone.' 4. Vocabulary: prodigal, inheritance, repentance, grace, celebration. Memory Verse: Luke 15:24.",
    range: 'Grades 5-6',
  },
  {
    title: 'Esther Saves Her People: Courage for Such a Time',
    theme: "Esther Saves Her People (Esther 4-5). Include: 1. Character web: Esther, Mordecai, King Ahasuerus, Haman — roles and motivations. 2. Reading comprehension with inference questions. 3. Writing prompt: 'Mordecai said Esther was made queen for such a time as this. What do you think YOU were made for?'. 4. Timeline of key events. Memory Verse: Esther 4:14.",
    range: 'Grades 5-6',
  },
  {
    title: 'The Sermon on the Mount: The Beatitudes',
    theme: "The Sermon on the Mount — The Beatitudes (Matthew 5:1-12). Include: 1. Beatitudes matching activity (blessed are the... → for they shall...). 2. Illustrated booklet: draw a picture for each beatitude. 3. Discussion: 'Which beatitude is hardest to live out? Why?'. 4. Compare the Beatitudes to the world's idea of happiness. Memory Verse: Matthew 5:3.",
    range: 'Grades 3-4',
  },
  {
    title: 'The Road to Emmaus: Recognizing Jesus',
    theme: "The Road to Emmaus (Luke 24:13-35). Include: 1. Story retelling with comprehension questions. 2. Map activity tracing the road from Jerusalem to Emmaus (7 miles). 3. Discussion: 'The disciples recognized Jesus when He broke bread. How do YOU recognize Jesus in your daily life?'. 4. Creative writing: 'Write a journal entry as one of the disciples on the road.' Memory Verse: Luke 24:31.",
    range: 'Grades 5-6',
  },
];

export default function GeneratePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [theme, setTheme] = useState('');
  const [gradeRange, setGradeRange] = useState(GRADE_RANGES[0]);
  const [category, setCategory] = useState<string>(PACK_CATEGORIES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  // Tier + usage state
  const [tier, setTier] = useState<TierKey>('free');
  const [usageData, setUsageData] = useState<{ used: number; limit: number | null } | null>(null);
  const [showAllTemplates, setShowAllTemplates] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch('/api/subscription/usage')
      .then((r) => r.json())
      .then((data) => {
        setTier(data.tier ?? 'free');
        setUsageData({ used: data.used ?? 0, limit: data.limit });
      })
      .catch(() => {});
  }, [user]);

  const tierLimits = TIERS[tier].limits;
  const atLimit = usageData !== null && usageData.limit !== null && usageData.used >= usageData.limit;
  const gradeBlocked = !canAccessGrade(tier, gradeRange);
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme || !user) return;

    setIsGenerating(true);
    setError('');
    setProgress('Brainstorming Bible activities...');

    try {
      const res = await fetch('/api/packs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, gradeRange, category }),
      });

      setProgress('Saving your printable pack...');

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Generation failed');
      }

      const { packId } = await res.json();
      router.push(`/pack/${packId}`);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message ?? 'Something went wrong. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5] pt-20 pb-12 px-4 sm:px-6 font-sans">
      <Navbar />
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl border-4 border-stone-100"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-[#3B82F6] p-4 rounded-2xl shadow-lg border-b-4 border-blue-700">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tighter uppercase">
                Creator Workspace
              </h1>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                AI Bible-Academic Integration
              </p>
            </div>
          </div>

            <form onSubmit={handleGenerate} className="space-y-8">
              {/* Quick Templates */}
              <div className="space-y-4">
                <label className="block text-xs font-black text-stone-400 uppercase tracking-[0.2em]">
                  Quick Templates
                </label>
                <div className="grid gap-3">
                  {(showAllTemplates ? PRESET_TEMPLATES : PRESET_TEMPLATES.slice(0, 3)).map((tpl) => (
                    <button
                      key={tpl.title}
                      type="button"
                      onClick={() => {
                        setTheme(tpl.theme);
                        setGradeRange(tpl.range);
                      }}
                      className="text-left p-4 rounded-2xl border-2 border-stone-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-sm font-black text-stone-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                          {tpl.title}
                        </p>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                          {tpl.range}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllTemplates((v) => !v)}
                  className="w-full text-xs font-black text-blue-500 hover:text-blue-700 uppercase tracking-widest py-2 transition-colors"
                >
                  {showAllTemplates
                    ? '↑ Show Less'
                    : `+ Show ${PRESET_TEMPLATES.length - 3} More Templates`}
                </button>
              </div>

              <div className="w-full h-px bg-stone-100" />

              {/* Manual Entry */}
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-[0.2em] mb-4">
                  Manual Entry
                </label>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-black text-stone-700 mb-2">
                      Bible Story or Theme
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jonah and the Big Fish"
                      className="w-full text-lg px-5 py-4 rounded-2xl border-2 border-stone-100 focus:border-blue-400 focus:outline-none transition-colors font-bold text-stone-800"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      disabled={isGenerating}
                      required
                    />
                    <div className="mt-4 flex flex-wrap gap-2">
                      {SUGGESTED_THEMES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTheme(t)}
                          className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest transition-colors ${
                            theme === t
                              ? 'bg-blue-100 text-blue-700 border-blue-200'
                              : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-stone-700 mb-4">
                      Target Grade Range
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {GRADE_RANGES.map((range) => {
                        const locked = user && !canAccessGrade(tier, range);
                        return (
                          <button
                            key={range}
                            type="button"
                            onClick={() => !locked && setGradeRange(range)}
                            className={`py-4 px-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all relative ${
                              locked
                                ? 'border-stone-100 text-stone-300 bg-stone-50 cursor-not-allowed'
                                : gradeRange === range
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-stone-50 text-stone-400 hover:border-stone-200'
                            }`}
                          >
                            {locked && <Lock className="w-3 h-3 absolute top-2 right-2 text-stone-300" />}
                            {range}
                          </button>
                        );
                      })}
                    </div>
                    {gradeBlocked && (
                      <p className="mt-2 text-xs font-bold text-amber-600 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {gradeRange} requires a higher plan.{' '}
                        <Link href="/pricing" className="underline hover:text-amber-800">Upgrade →</Link>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-black text-stone-700 mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-500" /> Pack Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PACK_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`px-4 py-2 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                            category === cat
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-stone-100 text-stone-400 hover:border-stone-200 hover:text-stone-600'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm font-bold text-center bg-red-50 rounded-2xl p-4">
                  {error}
                </p>
              )}

              {/* Usage indicator */}
              {user && usageData && (
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-stone-500 uppercase tracking-widest">
                      {TIERS[tier].name} Plan
                    </span>
                    <span className="text-xs font-black text-stone-600">
                      {usageData.limit === null
                        ? `${usageData.used} packs generated`
                        : `${usageData.used} / ${usageData.limit} packs this month`}
                    </span>
                  </div>
                  {usageData.limit !== null && (
                    <div className="w-full bg-stone-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${atLimit ? 'bg-red-400' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min((usageData.used / usageData.limit) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2">
                {!user ? (
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="w-full bg-stone-900 text-white py-5 rounded-[24px] font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-stone-800 transition-all shadow-xl active:translate-y-1 h-20"
                    >
                      Sign In to Generate <ArrowRight className="w-6 h-6 text-yellow-400" />
                    </button>
                  </SignInButton>
                ) : atLimit ? (
                  <div className="text-center space-y-3">
                    <p className="text-sm font-bold text-stone-600 bg-amber-50 rounded-2xl p-4 border border-amber-100">
                      You've used all {usageData?.limit} pack generation{(usageData?.limit as number) === 1 ? '' : 's'} for this month on the {TIERS[tier].name} plan.
                    </p>
                    <Link
                      href="/pricing"
                      className="w-full bg-blue-600 text-white py-4 rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-xl border-b-4 border-blue-800"
                    >
                      <TrendingUp className="w-5 h-5" /> Upgrade Your Plan
                    </Link>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isGenerating || !theme || gradeBlocked}
                    className="w-full bg-stone-900 text-white py-5 rounded-[24px] font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-stone-800 disabled:opacity-50 transition-all shadow-xl active:translate-y-1 h-20"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                        <span className="animate-pulse">{progress}</span>
                      </>
                    ) : (
                      <>
                        Generate {TIERS[tier].limits.worksheetsPerPack} Worksheets <ArrowRight className="w-6 h-6 text-yellow-400" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>


          <div className="mt-10 pt-10 border-t border-stone-100 flex items-center gap-4 text-stone-300">
            <BookOpen className="w-6 h-6 opacity-30" />
            <p className="text-[10px] uppercase font-black tracking-widest leading-relaxed">
              Every worksheet integrates Scripture (NIV/ESV) with standard
              academic curriculum markers.
            </p>
          </div>
        </motion.div>

        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-8 p-8 bg-blue-600 rounded-[32px] border-4 border-blue-400 text-white shadow-2xl flex items-center gap-6"
            >
              <div className="bg-white/20 p-4 rounded-2xl text-white">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="font-black text-lg tracking-tight uppercase leading-none mb-1">
                  BibleFunLand AI is Crafting...
                </p>
                <p className="text-xs font-bold text-blue-100 opacity-80 uppercase tracking-widest italic">
                  Designing 6 unique, printable worksheet pages &bull; ~30s
                  typical
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
