'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { SignInButton } from '@clerk/nextjs';
import { LogOut, UserCircle, BookOpen, Wand2, Menu, X, ExternalLink, Sparkles, Shield, LayoutGrid, Info } from 'lucide-react';

const navLinks = [
  { href: '/browse', label: 'Library', icon: BookOpen },
  { href: '/generate', label: 'Create', icon: Wand2 },
  { href: '/pricing', label: 'Pricing', icon: Sparkles },
  { href: '/about', label: 'About', icon: Info },
];


export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 print:hidden">
        {/* Main bar */}
        <div className="bg-[#1E3A8A] border-b border-blue-900/60 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-blue-900 font-black text-sm border-2 border-yellow-300 shadow-sm group-hover:scale-105 transition-transform">
                B
              </div>
              <span className="text-white font-black text-base tracking-tight hidden sm:block">
                BibleFunLand
                <span className="text-yellow-300 font-medium text-xs ml-1.5 tracking-widest uppercase">
                  Homeschool
                </span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      active
                        ? 'bg-white/15 text-white'
                        : 'text-blue-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </Link>
                );
              })}
              {user?.uid === 'user_3D2mTRz6ayzEetjSXk9xF94sC5u' && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    pathname === '/admin'
                      ? 'bg-red-500/20 text-red-100 border border-red-500/30'
                      : 'text-red-300 hover:text-white hover:bg-red-500/10'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}

            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Main site link — desktop only */}
              <a
                href="https://biblefunland.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1 text-blue-300 hover:text-white text-xs font-medium transition-colors px-2 py-1 rounded hover:bg-white/10"
              >
                <ExternalLink className="w-3 h-3" />
                Main Site
              </a>

              {/* Divider */}
              <div className="hidden lg:block w-px h-5 bg-blue-700 mx-1" />

              {user ? (
                <div className="flex items-center gap-1">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName ?? ''}
                        className="w-6 h-6 rounded-full border border-blue-400 object-cover"
                      />
                    ) : (
                      <UserCircle className="w-5 h-5 text-blue-300 group-hover:text-white transition-colors" />
                    )}
                    <span className="text-sm font-semibold text-blue-100 group-hover:text-white transition-colors hidden sm:block">
                      {user.displayName?.split(' ')[0]}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-lg text-blue-300 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-4 py-1.5 rounded-lg font-bold text-sm transition-all shadow-sm hover:shadow-md">
                    Sign In
                  </button>
                </SignInButton>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors ml-1"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-[#1E3A8A] border-b border-blue-900/60 shadow-xl">
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      active
                        ? 'bg-white/15 text-white'
                        : 'text-blue-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                );
              })}
              {user?.uid === 'user_3D2mTRz6ayzEetjSXk9xF94sC5u' && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    pathname === '/admin'
                      ? 'bg-red-500/20 text-red-100'
                      : 'text-red-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )}

              <a
                href="https://biblefunland.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Main Site
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer so content doesn't hide under fixed nav */}
      <div className="h-14 print:hidden" />
    </>
  );
}
