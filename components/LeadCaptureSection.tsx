'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';

export function LeadCaptureSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage_banner' }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to sign up. Please try again.');
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-[#1E3A8A] rounded-[40px] p-8 sm:p-12 overflow-hidden shadow-2xl border-4 border-white">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl" />

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm">
              <Sparkles className="w-3 h-3" /> Special Offer
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4 tracking-tight uppercase italic">
              Get 3 Free Packs <br className="hidden sm:block" />
              <span className="text-yellow-400">No Credit Card Required</span>
            </h2>
            <p className="text-blue-100 text-lg font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
              Join 1,000+ Christian homeschool families. Get our "Starter Pack" plus 2 custom AI packs of your choice today.
            </p>

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/20 border-2 border-green-500/30 rounded-2xl p-6 flex flex-col items-center gap-3"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                  <p className="text-white font-black uppercase tracking-widest text-sm">Welcome to the family!</p>
                  <p className="text-green-100 text-xs font-medium">Check your inbox for your free starter pack link.</p>
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                >
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      placeholder="Enter your email address..."
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === 'loading'}
                      className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-blue-300 outline-none focus:border-yellow-400 focus:bg-white/20 transition-all font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Claim Free Packs <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {status === 'error' && (
              <p className="text-red-300 text-xs font-bold mt-4 uppercase tracking-widest">{message}</p>
            )}

            <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-8 opacity-60">
              Instant access &bull; Cancel anytime &bull; Privacy guaranteed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
