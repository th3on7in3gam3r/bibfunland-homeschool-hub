'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Star, Loader2, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Pack {
  id: string;
  title: string;
  gradeRange: string;
  isFeatured: boolean;
  createdBy: string;
  createdAt: string;
}

export default function AdminPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/packs')
      .then(r => r.json())
      .then(data => {
        if (data.packs) setPacks(data.packs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleFeatured = async (id: string, current: boolean) => {
    setTogglingId(id);
    try {
      await fetch('/api/admin/packs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isFeatured: !current })
      });
      setPacks(prev => prev.map(p => p.id === id ? { ...p, isFeatured: !current } : p));
    } catch (e) {
      console.error(e);
    } finally {
      setTogglingId(null);
    }
  };

  const filteredPacks = packs.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />
      <main className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-stone-900 uppercase tracking-tight">Admin Dashboard</h1>
            <p className="text-stone-500 font-medium">Manage all worksheet packs across the platform.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search packs..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border-2 border-stone-100 rounded-xl focus:border-blue-400 outline-none text-sm font-medium"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-stone-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50 border-b-2 border-stone-100">
                    <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Pack Details</th>
                    <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest text-center">Featured</th>
                    <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Created</th>
                    <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filteredPacks.map(pack => (
                    <tr key={pack.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-stone-900">{pack.title}</div>
                        <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{pack.gradeRange}</div>
                        <div className="text-[10px] text-stone-400 font-mono mt-1">{pack.id}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => toggleFeatured(pack.id, pack.isFeatured)}
                          disabled={togglingId === pack.id}
                          className={`p-2 rounded-xl border-2 transition-all ${
                            pack.isFeatured 
                              ? 'bg-yellow-50 border-yellow-200 text-yellow-600 shadow-sm' 
                              : 'bg-white border-stone-100 text-stone-300 hover:border-yellow-100 hover:text-yellow-400'
                          }`}
                        >
                          {togglingId === pack.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Star className={`w-5 h-5 ${pack.isFeatured ? 'fill-yellow-400' : ''}`} />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-stone-600">{new Date(pack.createdAt).toLocaleDateString()}</div>
                        <div className="text-[10px] text-stone-400 truncate w-24" title={pack.createdBy}>BY: {pack.createdBy.slice(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/pack/${pack.id}`}
                          className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredPacks.length === 0 && (
              <div className="py-20 text-center text-stone-400 font-bold uppercase tracking-widest text-sm">
                No packs found.
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
