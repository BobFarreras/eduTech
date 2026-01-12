// filepath: src/presentation/components/features/game-engine/TheoryView.tsx
'use client';

import { Challenge } from '@/core/entities/challenges/challenge.entity';
import { BookOpen, ChevronRight, Terminal } from 'lucide-react';
import { useLocale } from 'next-intl';

// --- 1. DEFINICIÓ DE TIPUS (DOMAIN TYPES) ---

// Tipus per a textos traduïbles (potser incomplets, per això Partial)
type LocalizedText = Partial<Record<'ca' | 'es' | 'en', string>>;

// Estructura dels diferents tipus de blocs
interface BlockText {
  type: 'text';
  content: LocalizedText;
}

interface BlockList {
  type: 'list';
  items: LocalizedText[];
}

interface BlockCode {
  type: 'code';
  value: string;
  lang?: string;
}

// Unió Discriminada (El camp 'type' decideix la forma)
type TheoryBlock = BlockText | BlockList | BlockCode;

// L'estructura arrel del contingut de Teoria
interface TheoryContent {
  title: LocalizedText;
  blocks: TheoryBlock[];
}

// --- 2. COMPONENT ---

interface TheoryViewProps {
  challenge: Challenge;
  onNext: (isCorrect: boolean) => void;
}

export function TheoryView({ challenge, onNext }: TheoryViewProps) {
  const locale = useLocale() as 'ca' | 'es' | 'en';
  
  // Cast segur: Diem a TS que 'content' compleix la nostra interfície TheoryContent
  const content = challenge.content as unknown as TheoryContent;

  // Helper Type-Safe per treure text
  const getText = (field: LocalizedText | undefined): string => {
    if (!field) return '';
    return field[locale] || field['ca'] || field['es'] || '';
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- CAPÇALERA --- */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
        
        <div className="bg-indigo-600/10 border-b border-indigo-500/20 p-6 flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-lg shadow-lg shadow-indigo-500/20">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Training Module</span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              {getText(content.title)}
            </h1>
          </div>
        </div>

        {/* --- CONTINGUT DELS BLOCS --- */}
        <div className="p-6 md:p-8 space-y-8">
          {/* TypeScript ara sap que 'blocks' és un array de TheoryBlock */}
          {content.blocks?.map((block, idx) => {
            
            // CAS 1: TEXT
            if (block.type === 'text') {
              return (
                <p key={idx} className="text-slate-300 text-lg leading-relaxed">
                  {getText(block.content)}
                </p>
              );
            }

            // CAS 2: LLISTA
            if (block.type === 'list') {
              return (
                <ul key={idx} className="space-y-3 bg-slate-950/30 p-5 rounded-xl border border-slate-800">
                  {block.items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-300">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{getText(item)}</span>
                    </li>
                  ))}
                </ul>
              );
            }

            // CAS 3: CODI
            if (block.type === 'code') {
              return (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-2">
                      <Terminal className="w-3 h-3" />
                      {block.lang || 'text'}
                    </span>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                    </div>
                  </div>
                  <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-indigo-300">
                    <code>{block.value}</code>
                  </pre>
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* --- FOOTER --- */}
        <div className="p-6 bg-slate-900/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => onNext(true)}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 rounded-xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 active:scale-95 shadow-lg shadow-indigo-600/30"
          >
            <span>Entesos, Continuar</span>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </div>
  );
}