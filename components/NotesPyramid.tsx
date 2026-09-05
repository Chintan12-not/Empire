'use client';

import React from 'react';
import { Sparkles, Flame, Shield } from 'lucide-react';
import { FragranceNotes } from '@/types/product';

interface NotesPyramidProps {
  notes: FragranceNotes;
  isCompact?: boolean;
}

export default function NotesPyramid({ notes, isCompact = false }: NotesPyramidProps) {
  const levels = [
    {
      title: 'Top Notes',
      time: '0 - 15 Mins',
      desc: notes.top,
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-500/5',
    },
    {
      title: 'Heart Notes',
      time: '15 - 60 Mins',
      desc: notes.heart,
      icon: <Flame className="w-4 h-4 text-rose-400" />,
      color: 'border-rose-500/30 bg-rose-500/5',
    },
    {
      title: 'Base Notes',
      time: '1 - 8+ Hours',
      desc: notes.base,
      icon: <Shield className="w-4 h-4 text-gold-500" />,
      color: 'border-gold-500/30 bg-gold-500/5',
    },
  ];

  if (isCompact) {
    return (
      <div className="space-y-2">
        {levels.map((level, idx) => (
          <div key={idx} className={`p-2.5 rounded-lg border ${level.color} flex items-start gap-2.5`}>
            <div className="mt-0.5">{level.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-serif">{level.title}</span>
                <span className="text-[10px] text-gray-400 font-mono">({level.time})</span>
              </div>
              <p className="text-xs text-gray-300 font-light mt-0.5">{level.desc}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {levels.map((level, idx) => (
        <div
          key={idx}
          className={`p-5 rounded-xl border ${level.color} backdrop-blur-md flex flex-col justify-between hover:scale-[1.02] transition-transform`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-charcoal-900 border border-gray-800">{level.icon}</div>
              <div>
                <h4 className="font-serif text-sm font-bold text-white tracking-wide">{level.title}</h4>
                <span className="text-[10px] text-gray-400 font-mono">{level.time}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-300 font-light leading-relaxed">{level.desc}</p>
        </div>
      ))}
    </div>
  );
}
