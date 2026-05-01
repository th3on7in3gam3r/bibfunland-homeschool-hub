'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  PlusCircle, Scroll, Book, Printer, Heart,
  Star, Sparkles, Wand2, BookOpen, Download,
  ArrowRight, Users, FileText, Gamepad2,
} from 'lucide-react';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { PackCardSkeleton } from '@/components/PackCardSkeleton';
import { LeadCaptureSection } from '@/components/LeadCaptureSection';
import { useAuth } from '@/components/AuthProvider';
import type { Pack } from '@/lib/types';

export default function Home() {
  const { user } = useAuth();
  const [featuredPacks, setFeaturedPacks] = useState<Pack[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    fetch('/api/packs?featured=true&limit=6')
      .then((r) => r.json())
      .then((data) => {
        setFeaturedPacks(data.packs ?? []);
        setDataLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load featured packs:', err);
        setDataLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative bg-[#1E3A8A] py-20 md:py-32 px-6 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-8 left-8 w-64 h-64 rounded-full bg-white" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-yellow-400" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-[40px] border-white" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-yellow-400 rounded-full px-4 py-1.5 text-blue-900 font-black text-xs uppercase tracking-widest mb-6 border-2 border-yellow-300 shadow-lg"
          >
            <Star className="w-3.5 h-3.5 fill-blue-900" /> AI-Powered Christian Homeschooling
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-5 leading-[1.05] tracking-tighter"
          >
            Faith-Filled Worksheets
            <br />
            <span className="text-yellow-300">in Seconds.</span>
          </motion.h1>



          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Stop spending hours planning. Our Advanced AI generates customized Bible + Academic activity packs for your busy homeschool days.
          </motion.p>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/generate"
              className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-2xl font-black text-base hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 shadow-xl border-b-4 border-yellow-600 active:translate-y-1 active:border-b-0 uppercase tracking-widest"
            >
              <Wand2 className="w-5 h-5" /> Generate Your Pack
            </Link>
            <Link
              href="/pack/1f96b90e-d875-4ded-bf82-d973d518bc33"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 border-2 border-white/20 uppercase tracking-widest"
            >
              <Download className="w-5 h-5" /> Free Noah's Ark Pack
            </Link>

            <Link
              href="/browse"
              className="bg-transparent hover:bg-white/5 text-blue-100 px-8 py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <BookOpen className="w-5 h-5" /> Browse Library
            </Link>

          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-14 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {[
              { icon: FileText, value: '~30 seconds', label: 'Pack ready to print' },
              { icon: Users, value: '3–12', label: 'Ages served' },
              { icon: Book, value: '100%', label: 'Scripture-grounded' },
            ].map(({ icon: Icon, value, label }) => (

              <div key={label} className="text-center">
                <Icon className="w-5 h-5 text-yellow-300 mx-auto mb-1" />
                <p className="text-xl font-black text-white">{value}</p>
                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest leading-tight">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="bg-white py-20 px-6 border-b border-stone-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Simple & Fast</p>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              From idea to printable in 3 steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Wand2,
                color: 'bg-blue-50 text-blue-600',
                title: 'Choose a Theme',
                desc: 'Pick a Bible story or topic — Noah\'s Ark, the Fruit of the Spirit, the Nativity, or type your own.',
              },
              {
                step: '02',
                icon: Sparkles,
                color: 'bg-yellow-50 text-yellow-600',
                title: 'Our AI Generates Your Pack',
                desc: 'Our AI instantly creates 6 unique worksheets — sequencing, math, reading, writing, and more — in about 30 seconds.',

              },
              {
                step: '03',
                icon: Download,
                color: 'bg-green-50 text-green-600',
                title: 'Print & Teach',
                desc: 'Preview, select the sheets you want, and save as PDF. Ready for your homeschool table.',
              },
            ].map(({ step, icon: Icon, color, title, desc }) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-[80px] font-black text-stone-50 leading-none absolute -top-4 -left-2 select-none">
                  {step}
                </div>
                <div className="relative z-10 pt-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight mb-2">{title}</h3>
                  <p className="text-sm text-stone-500 font-medium leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 transition-all"
            >
              <PlusCircle className="w-5 h-5" /> Start Creating — It's Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── BibleFunLand Games Cross-link ────────────────── */}
      <section className="bg-gradient-to-r from-yellow-50 to-amber-50 border-y-2 border-yellow-100 py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shrink-0 border-2 border-yellow-300 shadow-sm">
              <Gamepad2 className="w-6 h-6 text-blue-900" />
            </div>
            <div>
              <p className="font-black text-stone-900 text-sm uppercase tracking-tight">
                Also on BibleFunLand.com
              </p>
              <p className="text-stone-500 text-xs font-medium">
                Interactive Bible games, memory verse challenges & more for kids
              </p>
            </div>
          </div>
          <a
            href="https://biblefunland.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all shadow-sm border-b-2 border-yellow-600 shrink-0"
          >
            Play Bible Games <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* ── Featured Packs ───────────────────────────────── */}
      {(dataLoading || featuredPacks.length > 0) && (
        <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3 border border-yellow-200">
                <Sparkles className="w-3 h-3" /> Start Here
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">Popular This Week</h2>

            </div>
            <Link
              href="/browse"
              className="flex items-center gap-1.5 text-blue-600 font-black text-sm uppercase tracking-widest hover:gap-3 transition-all"
            >
              Browse All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataLoading ? (
              [...Array(6)].map((_, i) => <PackCardSkeleton key={i} />)
            ) : (
              featuredPacks.map((pack, index) => (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07 }}
                  whileHover={{ y: -4 }}
                >
                  <Link href={`/pack/${pack.id}`} className="block h-full">
                    <div className="relative bg-white border-2 border-stone-100 hover:border-yellow-300 rounded-[28px] p-6 shadow-sm hover:shadow-xl transition-all flex flex-col h-full group">
                      {/* Featured badge */}
                      <div className="absolute -top-3 left-6 inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-white shadow">
                        <Star className="w-2.5 h-2.5 fill-yellow-900" /> Featured
                      </div>

                      <div className="flex items-start justify-between mb-4 mt-2">
                        <div className="bg-yellow-50 w-12 h-12 rounded-xl flex items-center justify-center text-yellow-600 group-hover:bg-yellow-400 group-hover:text-white transition-colors">
                          <Scroll className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                          {pack.gradeRange}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-stone-900 leading-tight tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                        {pack.title}
                      </h3>
                      <p className="text-stone-400 text-xs font-medium line-clamp-2 leading-relaxed flex-1">
                        {pack.overview}
                      </p>

                      <div className="mt-5 pt-4 border-t border-stone-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {pack.category && (
                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                              {pack.category}
                            </span>
                          )}
                          {pack.favoriteCount > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                              <Heart className="w-3 h-3 text-red-400 fill-red-400" /> {pack.favoriteCount}
                            </span>
                          )}
                        </div>
                        <span className="ml-auto flex items-center gap-1 text-blue-500 font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                          Open <Printer className="w-3.5 h-3.5" />
                        </span>
                      </div>

                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ── About ────────────────────────────────────────── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] bg-stone-100 rounded-[32px] overflow-hidden border-4 border-white shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=2072&auto=format&fit=crop"
                  alt="Father and son learning together at home"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-yellow-400 rounded-2xl border-4 border-white px-5 py-3 shadow-xl">
                <p className="text-blue-900 font-black text-xs uppercase tracking-widest leading-tight text-center">
                  Faith &<br />Academics
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 pt-6 lg:pt-0"
            >
              <div>
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Our Heart & Soul</p>
                <h2 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight tracking-tight mb-4">
                  About BibleFunLand
                </h2>
                <p className="text-stone-600 font-medium leading-relaxed">
                  BibleFunLand Homeschool Hub was born from a desire to make Christian homeschooling more vibrant and joyful. We believe academic excellence and spiritual depth go hand in hand.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                  <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-3">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-stone-900 text-sm uppercase tracking-widest mb-1">Our Mission</h3>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed">
                    Help Christian families integrate faith and academics through printable resources that make the Word come alive.
                  </p>
                </div>

                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-3">
                    <Star className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-stone-900 text-sm uppercase tracking-widest mb-1">Our Vision</h3>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed">
                    Empower parents to create joyful learning environments where children grow in wisdom and favor with God.
                  </p>
                </div>
              </div>

              <Link
                href="/browse"
                className="inline-flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-widest hover:gap-4 transition-all"
              >
                Explore the Library <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── Lead Capture for Logged-out Users ───────────── */}
      {!user && <LeadCaptureSection />}

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile Button */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%]">
        <Link 
          href="/browse"
          className="flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-2xl font-bold shadow-2xl animate-bounce-subtle"
        >
          <BookOpen className="w-5 h-5" />
          Browse Our Growing Library

        </Link>
      </div>
    </div>
  );
}
