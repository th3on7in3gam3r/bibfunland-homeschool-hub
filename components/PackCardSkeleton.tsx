import React from 'react';

export function PackCardSkeleton() {
  return (
    <div className="relative bg-white border-2 border-stone-100 rounded-[28px] p-6 shadow-sm flex flex-col h-[320px] animate-pulse">
      <div className="absolute -top-3 left-6 w-20 h-5 bg-stone-100 rounded-full" />
      
      <div className="flex items-start justify-between mb-4 mt-2">
        <div className="bg-stone-50 w-12 h-12 rounded-xl" />
        <div className="w-16 h-5 bg-stone-50 rounded-lg" />
      </div>

      <div className="w-3/4 h-6 bg-stone-100 rounded-md mb-2" />
      <div className="w-full h-4 bg-stone-50 rounded-md mb-1" />
      <div className="w-2/3 h-4 bg-stone-50 rounded-md mb-4" />

      <div className="mt-auto pt-4 border-t border-stone-50 flex items-center justify-between">
        <div className="w-20 h-3 bg-stone-50 rounded-md" />
        <div className="w-12 h-4 bg-stone-100 rounded-md" />
      </div>
    </div>
  );
}
