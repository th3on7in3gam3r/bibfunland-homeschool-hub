'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Printer, ArrowLeft, Share2, Scroll, Heart, Loader2, Edit3, Save, X,
  GripVertical, Eye, EyeOff, Check, Plus, Minus, MessageSquareText,
  Quote, Maximize, Sparkles, PlusCircle, FileText, Download,
} from 'lucide-react';
import { PrintableWorksheet } from '@/components/PrintableWorksheet';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/components/AuthProvider';
import { PACK_CATEGORIES } from '@/lib/constants';
import { SignInButton } from '@clerk/nextjs';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Pack {
  id: string;
  title: string;
  overview: string;
  gradeRange: string;
  theme: string;
  category: string;
  isFeatured: boolean;
  createdBy: string;
}

interface Worksheet {
  id: string;
  title: string;
  gradeLevel: string;
  objective: string;
  parentInstructions: string;
  contentMarkup: string;
  bibleVerse: string;
  order: number;
}

// ─── SortableWorksheet ────────────────────────────────────────────────────────

function SortableWorksheet({
  ws, isAuthor, isInteractive, onToggleInteractive,
}: {
  ws: Worksheet;
  isAuthor: boolean;
  isInteractive: boolean;
  onToggleInteractive: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showScripture, setShowScripture] = useState(true);

  useEffect(() => {
    if (!isInteractive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') setZoom((p) => Math.min(p + 0.1, 2));
      else if (e.key === '-' || e.key === '_') setZoom((p) => Math.max(p - 0.1, 0.5));
      else if (e.key === '0') setZoom(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInteractive]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: ws.id, disabled: !isAuthor });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : isInteractive ? 50 : ('auto' as const),
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} role="listitem" className="group/ws">
      {isAuthor && (
        <div
          {...attributes}
          {...listeners}
          role="button"
          aria-label={`Drag to reorder: ${ws.title}`}
          className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 cursor-grab active:cursor-grabbing text-stone-300 hover:text-blue-500 transition-colors print:hidden group"
        >
          <GripVertical className="w-6 h-6" aria-hidden="true" />
        </div>
      )}

      {/* Preview controls */}
      <div className="absolute -right-12 top-0 flex flex-col gap-2 print:hidden">
        <button
          onClick={onToggleInteractive}
          className={`p-3 rounded-2xl border-2 transition-all shadow-sm flex items-center justify-center
            ${isInteractive
              ? 'bg-blue-600 border-blue-700 text-white ring-4 ring-blue-100'
              : 'bg-white border-stone-100 text-stone-400 hover:border-blue-200'}`}
          aria-label={isInteractive ? 'Close preview' : 'Open preview'}
        >
          {isInteractive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>

        {isInteractive && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-2 bg-white p-2 rounded-2xl border-2 border-stone-100 shadow-xl"
          >
            <button onClick={() => setZoom((p) => Math.min(p + 0.1, 2))} className="p-2 hover:bg-blue-50 text-stone-400 hover:text-blue-600 rounded-lg transition-colors" title="Zoom In">
              <Plus className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center gap-1">
              <input
                type="range" min="0.5" max="2" step="0.1" value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="[writing-mode:bt-lr] h-24 appearance-none w-1 bg-stone-100 rounded-full cursor-pointer accent-blue-600"
                style={{ WebkitAppearance: 'slider-vertical' }}
              />
              <button onClick={() => setZoom(1)} className="py-1 text-[8px] font-black text-stone-400 hover:text-blue-600 transition-colors">
                {Math.round(zoom * 100)}%
              </button>
            </div>
            <button onClick={() => setZoom((p) => Math.max(p - 0.1, 0.5))} className="p-2 hover:bg-blue-50 text-stone-400 hover:text-blue-600 rounded-lg transition-colors" title="Zoom Out">
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={() => setZoom(1.2)} className="p-2 hover:bg-blue-50 text-stone-400 hover:text-blue-600 rounded-lg transition-colors" title="Fit to Width">
              <Maximize className="w-4 h-4" />
            </button>
            <div className="h-px bg-stone-100 my-1" />
            <button
              onClick={() => setShowInstructions((p) => !p)}
              className={`p-2 rounded-lg transition-all border ${showInstructions ? 'bg-blue-50 border-blue-100 text-blue-600' : 'text-stone-400 hover:bg-stone-50 border-transparent'}`}
              title={showInstructions ? 'Hide Instructions' : 'Show Instructions'}
            >
              <MessageSquareText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowScripture((p) => !p)}
              className={`p-2 rounded-lg transition-all border ${showScripture ? 'bg-blue-50 border-blue-100 text-blue-600' : 'text-stone-400 hover:bg-stone-50 border-transparent'}`}
              title={showScripture ? 'Hide Bible Verse' : 'Show Bible Verse'}
            >
              <Quote className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

      <div
        className="transition-transform duration-300 ease-out origin-top"
        style={{ transform: isInteractive ? `scale(${zoom})` : 'none' }}
      >
        <PrintableWorksheet
          worksheet={ws}
          isInteractive={isInteractive}
          showInstructions={showInstructions}
          showScripture={showScripture}
        />
      </div>
    </div>
  );
}

// ─── PackPage ─────────────────────────────────────────────────────────────────

const GRADE_RANGES = ['Preschool-K', 'Grades 1-2', 'Grades 3-4', 'Grades 5-6'];

export default function PackPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [pack, setPack] = useState<Pack | null>(null);
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editOverview, setEditOverview] = useState('');
  const [editGradeRange, setEditGradeRange] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // UI state
  const [activeInteractiveId, setActiveInteractiveId] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedWorksheets, setSelectedWorksheets] = useState<Set<string>>(new Set());

  // AI ideas state
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [addingIdeaId, setAddingIdeaId] = useState<number | null>(null);

  // Favorites state
  const [isFavorited, setIsFavorited] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Load pack + worksheets
  useEffect(() => {
    if (!id) return;
    fetch(`/api/packs/${id}`)
      .then((r) => {
        if (!r.ok) { router.push('/'); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setPack(data.pack);
        setEditTitle(data.pack.title);
        setEditOverview(data.pack.overview);
        setEditGradeRange(data.pack.gradeRange);
        setEditCategory(data.pack.category ?? 'Bible Story');
        setWorksheets(data.worksheets);
        setSelectedWorksheets(new Set(data.worksheets.map((w: Worksheet) => w.id)));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load pack:', err);
        setLoading(false);
      });

    // Load favorite status if signed in
    if (user) {
      fetch(`/api/packs/${id}/favorite`)
        .then((r) => r.json())
        .then((data) => setIsFavorited(data.isFavorited ?? false))
        .catch(() => {});
    }
  }, [id, router, user]);

  const handlePrint = () => setIsPreviewOpen(true);

  const finalizeAndPrint = () => {
    setIsPreviewOpen(false);
    setTimeout(() => window.print(), 300);
  };

  const toggleWorksheetSelection = (wsId: string) => {
    const next = new Set(selectedWorksheets);
    next.has(wsId) ? next.delete(wsId) : next.add(wsId);
    setSelectedWorksheets(next);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user || !id) return;
    setIsTogglingFavorite(true);
    try {
      const res = await fetch(`/api/packs/${id}/favorite`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to toggle favorite');
      const data = await res.json();
      setIsFavorited(data.isFavorited);
    } catch (err) {
      console.error('Favorite toggle error:', err);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!id || !pack) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/packs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, overview: editOverview, gradeRange: editGradeRange, category: editCategory }),
      });
      if (!res.ok) throw new Error('Save failed');
      setPack({ ...pack, title: editTitle, overview: editOverview, gradeRange: editGradeRange, category: editCategory });
      setIsEditing(false);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = worksheets.findIndex((ws) => ws.id === active.id);
    const newIndex = worksheets.findIndex((ws) => ws.id === over.id);
    const newOrder = arrayMove(worksheets, oldIndex, newIndex);
    setWorksheets(newOrder);

    try {
      await fetch(`/api/packs/${id}/worksheets/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: newOrder.map((ws, idx) => ({ id: ws.id, order: idx })),
        }),
      });
    } catch (err) {
      console.error('Reorder failed:', err);
    }
  };

  const generateAIWorksheetIdeas = async () => {
    if (!pack) return;
    setIsGeneratingIdeas(true);
    setAiSuggestions([]);
    try {
      const res = await fetch(`/api/packs/${id}/ideas`, { method: 'POST' });
      if (!res.ok) throw new Error('Ideas generation failed');
      const data = await res.json();
      setAiSuggestions(data.ideas ?? []);
    } catch (err) {
      console.error('AI ideas error:', err);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const createPackFromIdea = async (idea: any, index: number) => {
    setAddingIdeaId(index);
    try {
      const res = await fetch('/api/packs/from-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: idea.title,
          gradeLevel: idea.gradeLevel,
          category: pack?.category ?? 'Bible Story',
        }),
      });
      if (!res.ok) throw new Error('Pack creation failed');
      const { packId } = await res.json();
      // Remove the idea card and navigate to the new pack
      setAiSuggestions((prev) => prev.filter((_, i) => i !== index));
      router.push(`/pack/${packId}`);
    } catch (err) {
      console.error('Create pack from idea error:', err);
    } finally {
      setAddingIdeaId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF5]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} className="text-blue-500">
          <Loader2 className="w-12 h-12" />
        </motion.div>
      </div>
    );
  }

  if (!pack) return null;

  const isAuthor = user?.uid === pack.createdBy;

  return (
    <div className="min-h-screen bg-[#FAFAF5] font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-6 pb-12 px-4 sm:px-6">
        {/* Back button */}
        <div className="mb-6 print:hidden">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-stone-500 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Library
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 flex flex-col space-y-6 print:hidden" aria-label="Pack details and controls">
          <div className="bg-white border-4 border-stone-100 p-8 rounded-[32px] shadow-sm relative">
            {isAuthor && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                aria-label={isEditing ? 'Cancel editing' : 'Edit pack details'}
                className="absolute top-6 right-6 p-2 rounded-xl bg-stone-50 text-stone-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              </button>
            )}

            {isEditing ? (
              <div className="space-y-4 pt-4">
                <div>
                  <label htmlFor="pack-title" className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Title</label>
                  <input id="pack-title" type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-stone-100 focus:border-blue-400 focus:outline-none font-bold text-sm" />
                </div>
                <div>
                  <label htmlFor="grade-range" className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Grade Range</label>
                  <select id="grade-range" value={editGradeRange} onChange={(e) => setEditGradeRange(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-stone-100 focus:border-blue-400 focus:outline-none font-bold text-sm bg-white">
                    {GRADE_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="pack-overview" className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Overview</label>
                  <textarea id="pack-overview" value={editOverview} onChange={(e) => setEditOverview(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-stone-100 focus:border-blue-400 focus:outline-none font-medium text-xs leading-relaxed min-h-[120px]" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {PACK_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setEditCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg border-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                          editCategory === cat
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-stone-100 text-stone-400 hover:border-stone-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={handleSaveEdit} disabled={isSaving}
                  className="w-full py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-[10px] font-black text-blue-600 uppercase mb-3 tracking-[0.2em]">Worksheet Pack</h2>
                <h3 className="text-2xl font-black leading-tight text-stone-900 tracking-tighter uppercase">{pack.title}</h3>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-lg uppercase tracking-widest">{pack.gradeRange}</span>
                  {pack.category && (
                    <span className="text-[9px] font-black bg-purple-50 text-purple-600 px-3 py-1 rounded-lg uppercase tracking-widest border border-purple-100">{pack.category}</span>
                  )}
                  <span className="text-[9px] font-black bg-stone-50 text-stone-400 px-3 py-1 rounded-lg uppercase tracking-widest">NIV/ESV</span>
                </div>
                <div className="mt-8 p-5 bg-blue-50/50 rounded-2xl text-xs font-medium text-blue-900 leading-relaxed border-l-4 border-blue-500">
                  {pack.overview}
                </div>
              </>
            )}
          </div>

          <div className="bg-yellow-100 border-4 border-yellow-200 p-8 rounded-[32px]">
            <h4 className="text-[10px] font-black text-yellow-800 uppercase mb-6 tracking-[0.2em]">Educator Insights</h4>
            <ul className="text-[11px] space-y-6 font-bold text-yellow-900/80">
              <li className="flex gap-4">
                <div className="w-8 h-8 bg-white/50 rounded-xl flex items-center justify-center shrink-0">📖</div>
                <span>Discuss biblical themes together after completion.</span>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 bg-white/50 rounded-xl flex items-center justify-center shrink-0">🎨</div>
                <span>Integration points: Math, Literacy, and Scriptural context.</span>
              </li>
            </ul>
          </div>

          {user ? (
            <>
              <button onClick={handlePrint}
                className="w-full py-5 bg-blue-600 text-white font-black text-lg rounded-[24px] border-b-8 border-blue-800 hover:bg-blue-500 uppercase tracking-widest shadow-xl transition-all active:translate-y-2 active:border-b-0 h-20 flex items-center justify-center gap-3">
                <Printer className="w-6 h-6" /> Download Pack as PDF
              </button>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest text-center px-4">
                Select "Save as PDF" in the print destination to download the full pack.
              </p>
            </>
          ) : (
            <div className="bg-stone-900 rounded-[24px] p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
                <Printer className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-black text-sm uppercase tracking-widest mb-1">
                  Sign in to Download
                </p>
                <p className="text-stone-400 text-xs font-medium leading-relaxed">
                  Free account required to print or save as PDF.
                </p>
              </div>
              <SignInButton mode="modal">
                <button className="w-full py-3 bg-yellow-400 text-blue-900 font-black text-sm uppercase tracking-widest rounded-xl hover:bg-yellow-300 transition-all shadow-lg">
                  Sign In — It's Free
                </button>
              </SignInButton>
            </div>
          )}
        </aside>

        {/* Worksheets */}
        <section className="flex-1 flex flex-col gap-12 print:p-0" aria-label="Worksheet list">
          <div className="flex justify-between items-center mb-4 print:hidden">
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
              Printable Sheets ({worksheets.length})
            </h3>
            <div className="flex gap-3 relative">
              <button onClick={handleShare}
                className="p-3 bg-white border-2 border-stone-100 rounded-2xl hover:border-blue-200 transition-all shadow-sm group"
                aria-label="Share this pack">
                {showCopied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5 text-stone-400 group-hover:text-blue-500" />}
                {showCopied && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest whitespace-nowrap animate-bounce shadow-xl">
                    Link Copied!
                  </span>
                )}
              </button>
              <button
                onClick={handleToggleFavorite}
                disabled={!user || isTogglingFavorite}
                className={`p-3 rounded-2xl border-2 transition-all shadow-sm ${
                  isFavorited
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white border-stone-100 hover:border-red-200 text-stone-400 hover:text-red-400'
                } disabled:opacity-40`}
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-5 h-5 transition-all ${isFavorited ? 'fill-red-500' : ''}`} />
              </button>
            </div>
          </div>

          <div className="space-y-16 print:space-y-0" role="list">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={worksheets.map((ws) => ws.id)} strategy={verticalListSortingStrategy}>
                {worksheets.map((ws, index) => (
                  <motion.div
                    key={ws.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`print:break-after-page print:m-0 print:p-0 ${!selectedWorksheets.has(ws.id) ? 'print:hidden' : ''}`}
                  >
                    {/* Gate: show first worksheet free, blur the rest for guests */}
                    {!user && index > 0 ? (
                      <div className="relative">
                        <div className="blur-sm pointer-events-none select-none opacity-60">
                          <SortableWorksheet
                            ws={ws}
                            isAuthor={false}
                            isInteractive={false}
                            onToggleInteractive={() => {}}
                          />
                        </div>
                        {index === 1 && (
                          <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="bg-white rounded-[28px] shadow-2xl border-4 border-stone-100 p-8 text-center max-w-sm mx-4">
                              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Printer className="w-7 h-7 text-blue-500" />
                              </div>
                              <h3 className="text-xl font-black text-stone-900 uppercase tracking-tight mb-2">
                                Sign In to View All Worksheets
                              </h3>
                              <p className="text-stone-400 text-sm font-medium leading-relaxed mb-6">
                                Create a free account to access all {worksheets.length} worksheets and download this pack as PDF.
                              </p>
                              <SignInButton mode="modal">
                                <button className="w-full py-3 bg-blue-600 text-white font-black text-sm uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all shadow-lg border-b-4 border-blue-800">
                                  Sign In — It's Free
                                </button>
                              </SignInButton>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <SortableWorksheet
                      ws={ws}
                      isAuthor={isAuthor}
                      isInteractive={activeInteractiveId === ws.id}
                      onToggleInteractive={() =>
                        setActiveInteractiveId(activeInteractiveId === ws.id ? null : ws.id)
                      }
                    />
                    )}
                  </motion.div>
                ))}
              </SortableContext>
            </DndContext>
          </div>

          {/* AI Ideas — author only */}
          {isAuthor && (
            <div className="mt-20 pt-20 border-t-8 border-stone-100 print:hidden">
              <div className="bg-white border-4 border-dashed border-stone-200 rounded-[40px] p-12 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tight mb-3">Expand Your Library</h3>
                <p className="text-stone-400 font-bold text-sm max-w-md mx-auto leading-relaxed mb-8">
                  Let AI suggest 3 new pack ideas based on this pack's theme. Each idea generates a full 6-worksheet pack added to your library.
                </p>
                <button onClick={generateAIWorksheetIdeas} disabled={isGeneratingIdeas}
                  className="px-8 py-4 bg-blue-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mx-auto">
                  {isGeneratingIdeas
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> Gathering Inspiration...</>
                    : <><PlusCircle className="w-5 h-5" /> Generate Ideas</>}
                </button>

                {aiSuggestions.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    {aiSuggestions.map((idea, idx) => (
                      <div key={idx} className="bg-stone-50 p-6 rounded-3xl border-2 border-stone-100 flex flex-col group hover:border-blue-200 transition-all">
                        <h4 className="font-black text-stone-900 mb-2 leading-tight uppercase text-lg">{idea.title}</h4>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">{idea.gradeLevel}</p>
                        <div className="space-y-4 mb-6 flex-1">
                          <div>
                            <h5 className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Learning Objective</h5>
                            <p className="text-xs text-stone-600 font-medium leading-relaxed italic line-clamp-3">{idea.objective}</p>
                          </div>
                          <div>
                            <h5 className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Key Scripture</h5>
                            <p className="text-[11px] text-blue-800 font-bold leading-tight">&ldquo;{idea.bibleVerse}&rdquo;</p>
                          </div>
                        </div>
                        <button onClick={() => createPackFromIdea(idea, idx)} disabled={addingIdeaId === idx}
                          className="w-full py-3 bg-blue-600 border-2 border-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-sm">
                          {addingIdeaId === idx
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Pack...</>
                            : <><Plus className="w-4 h-4" /> Create New Pack</>}
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </section>
        </div>
      </main>

      <Footer />

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-12 print:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
              onClick={() => setIsPreviewOpen(false)} />

            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-full border-4 border-stone-100">

              {/* Modal Header */}
              <div className="px-8 py-6 bg-stone-50 border-b-2 border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-stone-900 uppercase tracking-tight">PDF Print Preview</h2>
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">
                      {selectedWorksheets.size} of {worksheets.length} Sheets Selected
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsPreviewOpen(false)} className="p-3 hover:bg-stone-200 rounded-2xl transition-colors text-stone-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-12 bg-stone-100/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                  {worksheets.map((ws, idx) => (
                    <div key={ws.id} className="space-y-4">
                      <motion.button onClick={() => toggleWorksheetSelection(ws.id)}
                        whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}
                        className={`relative w-full aspect-[8.5/11] bg-white rounded-[32px] shadow-xl border-4 transition-all overflow-hidden text-left group
                          ${selectedWorksheets.has(ws.id)
                            ? 'border-blue-500 ring-8 ring-blue-100 opacity-100'
                            : 'border-stone-200 opacity-40 grayscale hover:grayscale-0 hover:opacity-70'}`}>
                        <div className="absolute inset-0 origin-top-left scale-[0.25] pointer-events-none" style={{ width: '400%', height: '400%' }}>
                          <PrintableWorksheet worksheet={ws} showInstructions={false} showScripture={true} />
                        </div>
                        <div className={`absolute inset-0 transition-colors pointer-events-none ${selectedWorksheets.has(ws.id) ? 'bg-blue-500/5' : 'bg-transparent'}`} />
                        <div className={`absolute top-6 right-6 w-10 h-10 rounded-2xl border-4 flex items-center justify-center transition-all z-20
                          ${selectedWorksheets.has(ws.id) ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-white border-stone-200 text-stone-200 rotate-12'}`}>
                          {selectedWorksheets.has(ws.id) ? <Check className="w-6 h-6 stroke-[4]" /> : <Plus className="w-6 h-6 stroke-[4]" />}
                        </div>
                      </motion.button>
                      <div className="text-center">
                        <h4 className="text-sm font-black text-stone-700 line-clamp-1 uppercase tracking-tight">{ws.title}</h4>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Worksheet {idx + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedWorksheets.size === 0 && (
                  <div className="flex flex-col items-center justify-center py-24 text-stone-400">
                    <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-6">
                      <FileText className="w-12 h-12 opacity-20" />
                    </div>
                    <p className="font-black uppercase tracking-widest text-sm">No Sheets Selected for PDF</p>
                    <button onClick={() => setSelectedWorksheets(new Set(worksheets.map((w) => w.id)))}
                      className="mt-4 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">
                      Select All Sheets
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 bg-white border-t-2 border-stone-100 flex items-center justify-between">
                <button onClick={() => setSelectedWorksheets(new Set(worksheets.map((w) => w.id)))}
                  className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                  Select All Sheets
                </button>
                <div className="flex gap-4">
                  <button onClick={() => setIsPreviewOpen(false)}
                    className="px-6 py-4 bg-stone-100 text-stone-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-stone-200 transition-all">
                    Cancel
                  </button>
                  <button onClick={finalizeAndPrint} disabled={selectedWorksheets.size === 0}
                    className="px-8 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                    <Download className="w-4 h-4" /> Generate & Print PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
