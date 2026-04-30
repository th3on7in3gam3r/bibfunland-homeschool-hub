'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Quote, X, Plus, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

interface Testimonial {
  id: string;
  userName: string;
  role: string;
  content: string;
  rating: number;
  createdBy: string;
}

const SEED_TESTIMONIALS: Omit<Testimonial, 'createdBy'>[] = [
  {
    id: 'seed-1',
    userName: 'Sarah M.',
    role: 'Homeschool Mom of 3',
    content: "The Noah's Ark pack was a lifesaver! My 6-year-old loved the animal matching math, and I loved that she was learning Scripture at the same time. It's so hard to find high-quality Christian materials that are actually academic.",
    rating: 5,
  },
  {
    id: 'seed-2',
    userName: 'Jessica L.',
    role: 'Co-op Teacher',
    content: "I use these for my weekly homeschool co-op. Being able to generate a full pack for different age groups in seconds has saved me hours of planning. The kids actually ask for the 'Bible Story Worksheets' now!",
    rating: 5,
  },
  {
    id: 'seed-3',
    userName: 'Mark D.',
    role: 'Homeschool Dad',
    content: "Finally, something that isn't just coloring pages. The reading comprehension and writing prompts are solid. We used the 'Fruit of the Spirit' pack last week and it sparked such great conversations at lunch.",
    rating: 5,
  },
];


export function TestimonialsSection() {
  const { user } = useAuth();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => {
        const fetched = data.testimonials ?? [];
        // Show seed testimonials only when DB has none yet
        setTestimonials(fetched.length > 0 ? fetched : (SEED_TESTIMONIALS as Testimonial[]));
      })
      .catch(() => setTestimonials(SEED_TESTIMONIALS as Testimonial[]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: user.displayName ?? 'Anonymous Parent',
          content: newContent,
          rating: newRating,
        }),
      });
      if (!res.ok) throw new Error('Failed to post');
      const { id } = await res.json();
      setTestimonials((prev) => [
        {
          id,
          userName: user.displayName ?? 'Anonymous Parent',
          role: 'Homeschool Parent',
          content: newContent,
          rating: newRating,
          createdBy: user.uid,
        },
        ...prev,
      ]);
      setNewContent('');
      setNewRating(5);
      setIsAdding(false);
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <section className="bg-stone-50 py-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Community Voices</h2>
            <h3 className="text-4xl font-black text-stone-900 tracking-tight">Parent Testimonials</h3>
          </div>
          {user ? (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-500 transition-all flex items-center gap-2 shadow-lg border-b-4 border-blue-800 uppercase tracking-widest"
            >
              <Plus className="w-4 h-4" /> Share Your Story
            </button>
          )}
        </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border-2 border-stone-100 p-8 rounded-[32px] shadow-sm relative group hover:border-blue-200 transition-all"
              >
                <Quote className="absolute top-6 right-8 w-12 h-12 text-stone-50 group-hover:text-blue-50 transition-colors" />
                <div className="flex gap-1 mb-6 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-stone-200'}`} />
                  ))}
                </div>
                <p className="text-stone-700 font-medium leading-relaxed mb-8 relative z-10 italic">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="font-black text-stone-900 uppercase tracking-tight text-sm">{t.userName}</h4>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{t.role}</p>
                  </div>
                  {user?.uid === t.createdBy && (
                    <button onClick={() => handleDelete(t.id)} className="p-2 text-stone-300 hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {testimonials.length === 0 && !isAdding && (
            <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-4 border-dashed border-stone-100">
              <MessageSquare className="w-12 h-12 text-stone-100 mx-auto mb-4" />
              <p className="text-stone-300 font-black uppercase tracking-widest">Be the first to share your story!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Testimonial Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl p-8 sm:p-12 border-4 border-stone-100">
              <button onClick={() => setIsAdding(false)} className="absolute top-8 right-8 p-2 rounded-xl hover:bg-stone-50 text-stone-400 hover:text-stone-900 transition-all">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-3xl font-black text-stone-900 mb-2 tracking-tight">Share Your Experience</h3>
              <p className="text-stone-400 font-bold text-xs uppercase tracking-widest mb-8">How has BibleFunLand helped your family?</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 px-1">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setNewRating(star)}>
                        <Star className={`w-8 h-8 transition-all ${star <= newRating ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-stone-100 hover:text-yellow-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 px-1">Your Story</label>
                  <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} required
                    placeholder="Tell us about the joy of learning with your kids..."
                    className="w-full p-6 bg-stone-50 border-2 border-stone-100 rounded-3xl min-h-[160px] focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-medium text-stone-700 leading-relaxed" />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-4 font-black text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting || !newContent.trim()}
                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-3 shadow-xl border-b-4 border-blue-800 disabled:opacity-50">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post Testimonial'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
