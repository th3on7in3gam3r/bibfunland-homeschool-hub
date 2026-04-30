import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Wand2, BookOpen, Printer, Sparkles, Shield, 
  Heart, Users, CheckCircle2, ArrowRight, Star 
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'How It Works | Bible-Based Academic Excellence',
  description: 'Discover how BibleFunLand uses AI to help Christian homeschool families create custom worksheet packs in seconds.',
};

const steps = [
  {
    title: 'Choose Your Theme',
    desc: 'Select any Bible story, character, or virtue. From Noah\'s Ark to the Fruit of the Spirit, the possibilities are endless.',
    icon: Star,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    title: 'Select Grade Level',
    desc: 'Our AI tailors content specifically for Preschool through 6th grade, ensuring academic rigor meets biblical truth.',
    icon: Users,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Generate in Seconds',
    desc: 'Claude AI generates original, high-quality worksheets with objectives, bible verses, and parent instructions.',
    icon: Wand2,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Print & Teach',
    desc: 'Download your pack as a clean PDF. Print exactly what you need for your lesson today.',
    icon: Printer,
    color: 'bg-green-100 text-green-600',
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Our Mission
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-stone-900 tracking-tight leading-tight mb-6">
              Empowering Parents to <span className="text-blue-600">Teach Truth</span>
            </h1>
            <p className="text-lg text-stone-600 font-medium leading-relaxed mb-10">
              BibleFunLand was born from a simple desire: to make high-quality, 
              biblically-integrated academic resources accessible to every homeschool family.
            </p>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-yellow-200/30 rounded-full blur-3xl -z-0" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-3xl -z-0" />
      </section>

      {/* Steps Grid */}
      <section className="py-24 bg-white border-y-2 border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-stone-900 uppercase tracking-tight mb-4">How It Works</h2>
            <p className="text-stone-500 font-medium">Simple steps to biblical academic excellence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="relative p-8 bg-stone-50 rounded-[32px] border-2 border-stone-100 group hover:border-blue-200 transition-all">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-white border-2 border-stone-100 rounded-full flex items-center justify-center font-black text-stone-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-all">
                  {i + 1}
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${step.color} shadow-sm group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-stone-900 mb-3 tracking-tight">{step.title}</h3>
                <p className="text-stone-500 text-sm font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AI? */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-600 to-blue-800 rounded-[48px] overflow-hidden shadow-2xl flex items-center justify-center p-12 relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="text-center">
                <Wand2 className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
                <h3 className="text-3xl font-black text-white uppercase tracking-tight">AI with a Heart for Truth</h3>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400 rounded-3xl -z-10 shadow-xl rotate-12" />
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight mb-6 uppercase tracking-tight">
              Why use AI for <span className="text-blue-600">Christian Education?</span>
            </h2>
            <div className="space-y-6">
              {[
                { title: 'Save Hours of Planning', desc: 'No more scouring Pinterest for the perfect worksheet. Tell our AI what you need and get it instantly.' },
                { title: 'Customized for YOUR Child', desc: 'Need a pack focused specifically on David\'s bravery for a 2nd grader? Now you can have it.' },
                { title: 'Biblically Grounded', desc: 'Every generation includes relevant Bible verses and objectives that connect faith with learning.' }
              ].map(item => (
                <div key={item.title} className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-black text-stone-900 uppercase tracking-tight text-sm">{item.title}</h4>
                    <p className="text-stone-500 text-sm font-medium mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link 
                href="/generate"
                className="inline-flex items-center gap-2 bg-[#1E3A8A] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg"
              >
                Start Creating <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Link Section */}
      <section className="py-24 bg-yellow-400 border-y-4 border-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-blue-900 uppercase tracking-tight mb-6 italic">
            Looking for Bible Games?
          </h2>
          <p className="text-xl text-blue-800 font-bold mb-10 leading-relaxed">
            While the Hub handles your printables, our main site features hundreds of 
            free online Bible games, quizzes, and digital activities.
          </p>
          <a 
            href="https://biblefunland.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-blue-900 px-10 py-5 rounded-2xl font-black text-lg uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
          >
            Explore BibleFunLand.com <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ExternalLink(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}
