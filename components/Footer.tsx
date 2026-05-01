import React from 'react';
import Link from 'next/link';
import { BookOpen, Heart } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/browse', label: 'Library' },
  { href: '/generate', label: 'Create' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/profile', label: 'Profile' },
];


const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
];

export function Footer() {
  return (
    <footer className="bg-[#1E3A8A] print:hidden" aria-label="Site footer">
      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">

          {/* Brand column */}
          <div className="sm:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center text-blue-900 font-black text-sm border-2 border-yellow-300 shadow group-hover:scale-105 transition-transform">
                B
              </div>
              <div>
                <p className="text-white font-black text-sm tracking-tight leading-none">BibleFunLand</p>
                <p className="text-yellow-300 font-bold text-[10px] uppercase tracking-widest">Homeschool Hub</p>
              </div>
            </Link>
            <p className="text-blue-300 text-xs font-medium leading-relaxed max-w-xs">
              AI-powered printable worksheet packs for Christian homeschool families. Bible truth meets academic excellence.
            </p>
            <a
              href="https://biblefunland.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-blue-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Visit Main Site ↗
            </a>
          </div>

          {/* Navigation column */}
          <div>
            <p className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-4">Navigate</p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-blue-200 hover:text-white text-sm font-medium transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features column */}
          <div>
            <p className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-4">Features</p>
            <ul className="space-y-2.5 text-sm font-medium text-blue-200">
              <li>AI Worksheet Generation</li>
              <li>6 Worksheets per Pack</li>
              <li>All Grade Ranges (K–6)</li>
              <li>PDF Print & Download</li>
              <li>Category Filtering</li>
              <li>Pack Expansion Ideas</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-800 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-blue-400 text-[11px] font-bold uppercase tracking-widest text-center sm:text-left">
              &copy; {new Date().getFullYear()} BibleFunLand Homeschool Hub &bull; Biblically Accurate &bull; Parent Approved
            </p>

            <div className="flex items-center gap-5">
              {LEGAL_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-blue-400 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <p className="text-blue-700 text-[10px] font-medium text-center mt-4 flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for Christian homeschool families
          </p>
        </div>
      </div>
    </footer>
  );
}
