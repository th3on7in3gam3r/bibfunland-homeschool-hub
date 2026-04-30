import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Heart, BookOpen, Sparkles, Users, ArrowRight, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About BibleFunLand Homeschool Hub',
  description: 'Learn how BibleFunLand Homeschool Hub helps Christian homeschool families create AI-powered Bible worksheet packs for ages 3–12. Our mission, story, and values.',
  openGraph: {
    title: 'About BibleFunLand Homeschool Hub',
    description: 'AI-powered printable worksheet packs for Christian homeschool families. Bible truth meets academic excellence for ages 3–12.',
    type: 'website',
  },
};

const VALUES = [
  {
    icon: BookOpen,
    color: 'bg-blue-50 text-blue-600',
    title: 'Biblically Faithful',
    desc: 'Every worksheet is grounded in Scripture. We use NIV and ESV translations and verify every verse reference before it reaches your printer.',
  },
  {
    icon: Sparkles,
    color: 'bg-yellow-50 text-yellow-600',
    title: 'Academically Rigorous',
    desc: 'Our AI integrates real curriculum standards — phonics, math operations, reading comprehension, and writing — into every Bible story pack.',
  },
  {
    icon: Heart,
    color: 'bg-rose-50 text-rose-600',
    title: 'Parent-First Design',
    desc: 'We build for busy homeschool parents. Every feature is designed to save you time, not add complexity. Generate a full pack in under 30 seconds.',
  },
  {
    icon: Users,
    color: 'bg-green-50 text-green-600',
    title: 'Community-Driven',
    desc: 'Packs created by our community are shared in the library. Every educator who generates a pack makes the resource richer for everyone.',
  },
];

const HOW_IT_WORKS = [
  'You choose a Bible story or theme and a grade range.',
  'Claude AI (Anthropic) generates 6 unique worksheets in ~30 seconds.',
  'Each worksheet integrates Scripture with Math, Reading, Writing, or Art.',
  'You preview, select the sheets you want, and save as PDF.',
  'Print and teach — your kids learn God\'s Word through hands-on activities.',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />

      {/* Hero */}
      <div className="bg-[#1E3A8A] pt-20 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-yellow-400 rounded-full px-4 py-1.5 text-blue-900 font-black text-xs uppercase tracking-widest mb-5 border-2 border-yellow-300">
            <Heart className="w-3.5 h-3.5 fill-blue-900" /> Our Story
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            About BibleFunLand<br />Homeschool Hub
          </h1>
          <p className="text-blue-200 text-base font-medium max-w-xl mx-auto leading-relaxed">
            We believe academic excellence and spiritual depth go hand in hand. BibleFunLand was built to make that belief practical — one printable worksheet at a time.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-20">

        {/* Mission */}
        <section className="grid sm:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Our Mission</p>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mb-4">
              Faith and Academics, Together
            </h2>
            <p className="text-stone-600 font-medium leading-relaxed mb-4">
              BibleFunLand Homeschool Hub was born from a simple frustration: finding worksheet resources that were both academically solid <em>and</em> genuinely Christ-centered was hard. Most were one or the other.
            </p>
            <p className="text-stone-600 font-medium leading-relaxed">
              We built this platform so Christian homeschool parents could generate complete, print-ready worksheet packs in seconds — packs where the math problems use Noah's animals, the reading passages come from the Psalms, and the memory verse is woven into every page.
            </p>
          </div>
          <div className="aspect-square bg-[#1E3A8A] rounded-[32px] flex items-center justify-center p-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-yellow-300">
                <span className="text-blue-900 font-black text-3xl">B</span>
              </div>
              <p className="text-white font-black text-lg uppercase tracking-tight">BibleFunLand</p>
              <p className="text-yellow-300 font-bold text-xs uppercase tracking-widest">Homeschool Hub</p>
              <p className="text-blue-300 text-xs font-medium mt-3 max-w-[180px] mx-auto leading-relaxed">
                Part of the BibleFunLand family of Christian education tools
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section>
          <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mb-8">
            From Idea to Printable in 5 Steps
          </h2>
          <div className="space-y-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-2xl p-5 border-2 border-stone-100">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                  {i + 1}
                </div>
                <p className="text-stone-700 font-medium text-sm leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section>
          <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Our Values</p>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mb-8">
            What We Stand For
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {VALUES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border-2 border-stone-100">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-black text-stone-900 text-sm uppercase tracking-tight mb-2">{title}</h3>
                <p className="text-stone-500 text-sm font-medium leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BibleFunLand connection */}
        <section className="bg-[#1E3A8A] rounded-[28px] p-10">
          <p className="text-blue-300 font-black text-xs uppercase tracking-widest mb-3">Part of a Bigger Family</p>
          <h2 className="text-2xl font-black text-white tracking-tight mb-4">
            Connected to BibleFunLand.com
          </h2>
          <p className="text-blue-200 text-sm font-medium leading-relaxed mb-6 max-w-lg">
            The Homeschool Hub is part of the BibleFunLand ecosystem — a growing collection of faith-based educational tools for Christian families. Visit the main site for interactive Bible games, memory verse activities, and more resources for your children.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://biblefunland.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all"
            >
              <BookOpen className="w-4 h-4" /> Visit BibleFunLand.com
            </a>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all border border-white/20"
            >
              <Sparkles className="w-4 h-4" /> Start Creating Free
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <h2 className="text-2xl font-black text-stone-900 tracking-tight mb-3">
            Ready to Transform Your Homeschool?
          </h2>
          <p className="text-stone-500 font-medium mb-6 max-w-md mx-auto">
            Join hundreds of Christian families already using BibleFunLand to bring Scripture to life in their classrooms.
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 transition-all"
          >
            Create Your First Pack Free <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  );
}
