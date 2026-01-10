// filepath: src/presentation/components/features/learning-path/LevelNode.tsx
'use client';

import Link from 'next/link';
import {
  Check, Lock, Puzzle, Brain,
  ArrowDownUp, SquareTerminal, Wrench
} from 'lucide-react';
import { clsx } from 'clsx';
import { LevelStatus } from '@/application/dto/level-node.dto';
import { ChallengeType } from '@/core/entities/challenge.entity';
import { useTranslations } from 'next-intl';

interface LevelNodeProps {
  tier: number;
  status: LevelStatus;
  slug: string;
  index: number;
  predominantType?: ChallengeType;
  isCurrentPosition?: boolean;
}

// ✅ HELPER EXTERN NETEJAR
// Ara aquesta funció NOMÉS retorna el tipus de joc. No es preocupa de l'estat.
function getGameIcon(type: string) {
  switch (type) {
    case 'TERMINAL':
      return <SquareTerminal className="w-8 h-8" />;
    case 'LOGIC_ORDER':
      return <ArrowDownUp className="w-8 h-8" />;
    case 'CODE_FIX':
      return <Wrench className="w-8 h-8" />;
    case 'MATCHING':
      return <Puzzle className="w-8 h-8" />;
    case 'QUIZ':
    default:
      return <Brain className="w-8 h-8" />;
  }
}

export function LevelNode({ tier, status, slug, index, predominantType = 'QUIZ', isCurrentPosition }: LevelNodeProps) {
  // const t = useTranslations('game.level_node');


  // 🎨 CANVIS DE DISSENY:
  // 1. w-16 h-16 (64px) per mòbil -> w-24 h-24 (96px) per escriptori
  // 2. border-b-4 (més subtil en mòbil)
  const baseStyles = "relative w-16 h-16 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center border-b-4 md:border-b-[6px] transition-all duration-300 z-10 active:border-b-0 active:translate-y-[4px]";
  const statusStyles = {
    // LOCKED: Gris fosc, icona apagada
    LOCKED: "bg-slate-800 border-slate-950 text-slate-500 cursor-not-allowed",
    // COMPLETED: Verd maragda
    COMPLETED: "bg-emerald-500 border-emerald-700 text-white shadow-lg shadow-emerald-900/20",
    // ACTIVE: Blau elèctric
    ACTIVE: "bg-blue-600 border-blue-800 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] ring-4 ring-blue-500/20"
  };

  const content = (
    <div className="relative group">

      {/* INDICADOR "START" (Només si és la posició actual) */}
      {isCurrentPosition && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-30 pointer-events-none">
          <div className="bg-white text-blue-600 px-3 py-1 rounded-lg font-bold text-xs shadow-xl mb-1 uppercase tracking-wider border-2 border-blue-100">
            START
          </div>
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-white"></div>
        </div>
      )}

      {/* CERCLE PRINCIPAL */}
      <div className={clsx(baseStyles, statusStyles[status])}>

        {/* ICONA CENTRAL */}
        <div className={clsx(
          "transition-transform duration-300",
          status === 'ACTIVE' ? "scale-110" : "group-hover:scale-110",
          // Si està bloquejat, fem la icona una mica més transparent/grisa
          status === 'LOCKED' && "opacity-40 grayscale"
        )}>
          {/* 🟢 ARA SEMPRE MOSTREM LA ICONA DEL JOC, FINS I TOT BLOQUEJAT */}
          {getGameIcon(predominantType)}
        </div>

        {/* BADGE: COMPLETAT (Check) */}
        {status === 'COMPLETED' && (
          <div className="absolute -right-2 -top-2 bg-yellow-400 text-yellow-900 rounded-full p-1.5 border-4 border-slate-950 shadow-sm z-20 animate-in zoom-in">
            <Check className="w-4 h-4 stroke-[4]" />
          </div>
        )}

        {/* BADGE: BLOQUEJAT (Cadenat petit) */}
        {status === 'LOCKED' && (
          <div className="absolute -right-1 -bottom-1 bg-slate-700 text-slate-400 rounded-full p-1.5 border-4 border-slate-950 z-20">
            <Lock className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* TEXT NIVELL (A sota) */}
      <div className={clsx(
        "absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full border text-[10px] font-bold whitespace-nowrap shadow-md transition-colors",
        status === 'ACTIVE' ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-900 border-slate-700 text-slate-400"
      )}>
        NIVELL {tier}
      </div>
    </div>
  );

  // Si està bloquejat, no posem Link
  if (status === 'LOCKED') {
    return <div className="flex justify-center py-4">{content}</div>;
  }

  // Si està actiu o completat, és clicable
  return (
    <div className="flex justify-center py-4">
      <Link href={`/learn/${slug}/play?tier=${tier}`} aria-label={`Nivell ${tier}`}>
        {content}
      </Link>
    </div>
  );
}