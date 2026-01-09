'use client';

import { useState, useMemo } from 'react';
import { Challenge, MatchingContent } from '@/core/entities/challenge.entity';
import { Check, ArrowRight, Puzzle } from 'lucide-react';
import { clsx } from 'clsx';

// --- UTILS ---

function pseudoRandom(seed: number) {
  let t = seed += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

function cyrb53(str: string, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

// ✅ CORRECCIÓ 1: Protecció contra arrays nuls o indefinits
function seededShuffle<T>(array: T[] | undefined | null, seedString: string): T[] {
  if (!array || !Array.isArray(array)) {
      console.warn("seededShuffle rebut un array invàlid:", array);
      return []; 
  }
  const copy = [...array];
  let seed = cyrb53(seedString);

  for (let i = copy.length - 1; i > 0; i--) {
    const randomFloat = pseudoRandom(seed++);
    const j = Math.floor(randomFloat * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// --- COMPONENT ---

interface MatchingViewProps {
  challenge: Challenge;
  onNext: (isCorrect: boolean) => void;
}

export function MatchingView({ challenge, onNext }: MatchingViewProps) {
  const content = challenge.content as MatchingContent;
  
  // ESTAT UI
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [errorPair, setErrorPair] = useState<{left: string, right: string} | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // ✅ CORRECCIÓ 2: Protecció dins del useMemo
  const rightOptions = useMemo(() => {
    // Si no hi ha contingut o no hi ha pairs, retornem buit per evitar l'error
    if (!content || !content.pairs) return [];
    
    return seededShuffle(content.pairs, challenge.id);
  }, [content, challenge.id]);

  // Si no hi ha parelles carregades, mostrem un error o loader en lloc de petar
  if (!content?.pairs || content.pairs.length === 0) {
      return <div className="text-center p-10 text-red-400">Error: No s'han trobat parelles per relacionar.</div>;
  }

  const handleLeftClick = (id: string) => {
    if (matchedPairs.has(id)) return; 
    setSelectedLeft(id);
    setErrorPair(null);
  };

  const handleRightClick = (rightId: string) => {
    if (!selectedLeft) return; 

    const pair = content.pairs.find(p => p.left.id === selectedLeft);

    if (pair && pair.right.id === rightId) {
      const newMatches = new Set(matchedPairs);
      newMatches.add(selectedLeft);
      setMatchedPairs(newMatches);
      setSelectedLeft(null);

      if (newMatches.size === content.pairs.length) {
        setIsCompleted(true);
      }
    } else {
      setErrorPair({ left: selectedLeft, right: rightId });
      setTimeout(() => {
        setErrorPair(null);
        setSelectedLeft(null);
      }, 800);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="text-center mb-8">
         <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-full mb-4">
            <Puzzle className="w-8 h-8 text-purple-400" />
         </div>
         <h2 className="text-xl md:text-2xl font-bold text-white">
            {content.instruction}
         </h2>
         <p className="text-slate-400 mt-2 text-sm">Selecciona un element de cada columna per relacionar-los.</p>
      </div>

      <div className="grid grid-cols-2 gap-8 md:gap-12 relative">
         
         {/* COLUMNA ESQUERRA */}
         <div className="flex flex-col gap-4">
            {content.pairs.map((pair) => {
               const isMatched = matchedPairs.has(pair.left.id);
               const isSelected = selectedLeft === pair.left.id;
               const isError = errorPair?.left === pair.left.id;

               return (
                  <button
                    key={pair.left.id}
                    onClick={() => handleLeftClick(pair.left.id)}
                    disabled={isMatched}
                    className={clsx(
                       "p-4 rounded-xl border-2 text-left transition-all duration-300 relative select-none",
                       isMatched ? "bg-green-500/10 border-green-500 text-green-400 opacity-50" :
                       isError ? "bg-red-500/10 border-red-500 text-red-400 shake-animation" :
                       isSelected ? "bg-blue-600/20 border-blue-500 text-blue-200 scale-105 shadow-lg shadow-blue-500/20" :
                       "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-700"
                    )}
                  >
                     {pair.left.text}
                     {isMatched && <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" />}
                  </button>
               );
            })}
         </div>

         {/* COLUMNA DRETA */}
         <div className="flex flex-col gap-4">
            {rightOptions.map((pair) => {
               const originalPair = content.pairs.find(p => p.right.id === pair.right.id);
               // Safe navigation operator ?. per evitar crash si originalPair no es troba
               const isMatched = originalPair && matchedPairs.has(originalPair.left.id);
               const isError = errorPair?.right === pair.right.id;

               return (
                  <button
                    key={pair.right.id}
                    onClick={() => handleRightClick(pair.right.id)}
                    disabled={isMatched || !selectedLeft}
                    className={clsx(
                       "p-4 rounded-xl border-2 text-left transition-all duration-300 relative select-none",
                       isMatched ? "bg-green-500/10 border-green-500 text-green-400 opacity-50" :
                       isError ? "bg-red-500/10 border-red-500 text-red-400 shake-animation" :
                       selectedLeft && !isMatched ? "bg-slate-800 border-slate-600 cursor-pointer hover:border-purple-400 hover:bg-slate-700" :
                       "bg-slate-800 border-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                    )}
                  >
                     {pair.right.text}
                  </button>
               );
            })}
         </div>
      </div>

      {isCompleted && (
         <div className="mt-8 flex justify-center animate-in zoom-in duration-300">
            <button
               onClick={() => onNext(true)}
               className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
            >
               NIVELL SUPERAT <ArrowRight className="w-5 h-5" />
            </button>
         </div>
      )}

    </div>
  );
}