'use client';

import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Pencil, Star } from 'lucide-react';

interface WorksheetProps {
  worksheet: {
    title: string;
    gradeLevel: string;
    objective: string;
    parentInstructions: string;
    contentMarkup: string;
    bibleVerse: string;
  };
  isInteractive?: boolean;
  showInstructions?: boolean;
  showScripture?: boolean;
}

export function PrintableWorksheet({ 
  worksheet, 
  isInteractive = false,
  showInstructions = true,
  showScripture = true
}: WorksheetProps) {
  return (
    <article className={`${isInteractive ? 'bg-white' : 'print-section bg-white'} w-full max-w-[8.5in] min-h-[11in] mx-auto p-12 border-2 ${isInteractive ? 'border-blue-400 ring-4 ring-blue-50' : 'border-stone-200'} shadow-xl flex flex-col gap-6 font-sans transition-all`}>
      {/* Interactive Mode Badge */}
      {isInteractive && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg z-10">
          Interactive Preview
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-start border-b-4 border-[#3B82F6] pb-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-blue-600 mb-1">
            {worksheet.title}
          </h1>
          <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-stone-400">
            <span className="bg-stone-100 px-2 py-1 rounded">Grade: {worksheet.gradeLevel}</span>
            <span className="flex items-center gap-1 text-blue-500">
              <BookOpen className="w-3 h-3" aria-hidden="true" /> BibleFunLand Hub
            </span>
          </div>
        </div>
        <div className="text-right text-[10px] max-w-[200px]">
          <p className="font-black text-stone-300 uppercase tracking-widest mb-1">Objective</p>
          <p className="font-bold text-stone-500 leading-tight italic">{worksheet.objective}</p>
        </div>
      </header>

      {/* Parent Zone (Helpful Tips) */}
      {showInstructions && (
        <aside className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-xl text-xs print:hidden" aria-label="Parent Instructions">
          <h3 className="font-black text-yellow-800 flex items-center gap-2 mb-1 uppercase tracking-widest">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" aria-hidden="true" /> Parent Instructions
          </h3>
          <p className="text-yellow-900 font-medium leading-relaxed">{worksheet.parentInstructions}</p>
        </aside>
      )}

      {/* Scripture Line */}
      {showScripture && (
        <blockquote className="text-center font-bold text-lg px-8 py-4 border-2 border-dashed border-blue-100 rounded-2xl bg-blue-50/30 text-blue-800 italic">
          &ldquo;{worksheet.bibleVerse}&rdquo;
        </blockquote>
      )}

      {/* Body Content */}
      <div className="flex-1 whitespace-pre-wrap leading-relaxed text-stone-800 text-base">
        {worksheet.contentMarkup.split('\n').map((line, i) => {
          if (line.startsWith('### ')) {
            return <h2 key={i} className="text-xl font-black text-blue-600 mt-6 mb-3 uppercase tracking-tight">{line.replace('### ', '')}</h2>;
          }
          if (line.includes('[Write') || line.includes('[Color')) {
            const label = line.replace('[', '').replace(']', '');
            
            if (isInteractive) {
              return (
                <div key={i} className="my-6 space-y-2">
                  <label className="text-[9px] font-black text-blue-500 uppercase tracking-widest block">{label}</label>
                  {line.includes('Write') ? (
                    <textarea 
                      placeholder="Type your response here..."
                      className="w-full p-6 bg-blue-50/30 border-2 border-blue-200 rounded-xl min-h-[120px] focus:outline-none focus:border-blue-500 transition-all font-medium text-stone-700"
                    />
                  ) : (
                    <div className="w-full p-12 bg-stone-50 border-2 border-dashed border-stone-200 rounded-xl flex items-center justify-center text-stone-400 font-bold text-sm italic">
                      [ Interactive Coloring Overlay Not Available ]
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div 
                key={i} 
                className="my-6 p-6 bg-stone-50 border-2 border-stone-200 border-dashed rounded-xl min-h-[100px] flex items-end"
                role="img"
                aria-label={`Activity Area: ${label}`}
              >
                <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em]">{label}</span>
              </div>
            );
          }
          if (line.trim() === '') return <div key={i} className="h-4" aria-hidden="true" />;
          return <p key={i} className="mb-3 font-medium text-stone-700 leading-relaxed">{line}</p>;
        })}
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-6 border-t-2 border-stone-100 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-stone-300">
        <p>© BibleFunLand Homeschool Hub &bull; Sola Scriptura</p>
        <p className="flex items-center gap-1">
          <Pencil className="w-3 h-3" aria-hidden="true" /> Diligent Learning
        </p>
      </footer>
    </article>
  );
}
