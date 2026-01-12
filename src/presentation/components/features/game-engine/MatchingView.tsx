// filepath: src/presentation/components/features/game-engine/MatchingView.tsx
'use client';

import { useState, useMemo } from 'react';
import { Challenge, MatchingContent } from '@/core/entities/challenges/index';
import { Check, ArrowRight, Puzzle } from 'lucide-react';
import { clsx } from 'clsx';
import { GameSessionLayout } from './layout/GameSessionLayout';
import { GameHeader } from './layout/GameHeader';
import { useTranslations } from 'next-intl';

// --- UTILS (Es podrien moure a src/core/utils/random.ts) ---
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

function seededShuffle<T>(array: T[] | undefined | null, seedString: string): T[] {
  if (!array || !Array.isArray(array)) return [];
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
  const t = useTranslations('game');
  const content = challenge.content as MatchingContent;

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [errorPair, setErrorPair] = useState<{ left: string, right: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const rightOptions = useMemo(() => {
    if (!content || !content.pairs) return [];
    return seededShuffle(content.pairs, challenge.id);
  }, [content, challenge.id]);

  if (!content?.pairs || content.pairs.length === 0) {
    return <div className="text-center p-10 text-red-400">Error: No matching pairs found.</div>;
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

  // --- FOOTER ---
  const Footer = isCompleted ? (
    <div className="w-full p-4 animate-in slide-in-from-bottom-2">
      <button
        onClick={() => onNext(true)}
        className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 active:scale-95 transition-all"
      >
        {/* Traducció: "Continuar" */}
        {t('arena.continue_btn')} <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  ) : <div className="h-4" />;

  return (
    <GameSessionLayout header={<GameHeader />} footer={Footer}>
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center pt-4 pb-8">

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-full mb-2 border border-purple-500/20">
            <Puzzle className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-lg font-bold text-white leading-tight">
            {content.instruction}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-12 w-full">

          {/* COLUMNA ESQUERRA */}
          <div className="flex flex-col gap-3">
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
                    "p-4 rounded-xl border-2 text-left transition-all duration-300 relative select-none text-sm md:text-base",
                    isMatched ? "bg-green-500/10 border-green-500 text-green-400 opacity-50" :
                      isError ? "bg-red-500/10 border-red-500 text-red-400 shake-animation" :
                        isSelected ? "bg-blue-600/20 border-blue-500 text-blue-200 scale-105 shadow-lg z-10" :
                          "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-700"
                  )}
                >
                  {pair.left.text}
                  {isMatched && <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" />}
                </button>
              );
            })}
          </div>

          {/* COLUMNA DRETA */}
          <div className="flex flex-col gap-3">
            {rightOptions.map((pair) => {
              const originalPair = content.pairs.find(p => p.right.id === pair.right.id);
              const isMatched = originalPair && matchedPairs.has(originalPair.left.id);
              const isError = errorPair?.right === pair.right.id;

              return (
                <button
                  key={pair.right.id}
                  onClick={() => handleRightClick(pair.right.id)}
                  disabled={isMatched || !selectedLeft}
                  className={clsx(
                    "p-4 rounded-xl border-2 text-left transition-all duration-300 relative select-none text-sm md:text-base",
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

      </div>
    </GameSessionLayout>
  );
}