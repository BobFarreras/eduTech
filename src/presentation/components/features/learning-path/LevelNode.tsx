// filepath: src/presentation/components/features/learning-path/LevelNode.tsx
'use client';

import Link from 'next/link';
import {
  Check, Lock, Puzzle, Brain,
  ArrowDownUp, SquareTerminal, Wrench, BookOpen,
  Scale
} from 'lucide-react';
import { clsx } from 'clsx';
import { LevelStatus } from '@/application/dto/level-node.dto';
import { ChallengeType } from '@/core/entities/challenges/challenge.entity';
import { BossMarker } from './BossMarker';

interface LevelNodeProps {
  tier: number;
  status: LevelStatus;
  slug: string;
  index: number;
  predominantType?: ChallengeType;
  isCurrentPosition?: boolean;
  isBoss?: boolean;
  bossTitleKey?: string;
  bossIconName?: string;
  bossColorClass?: string;
}

// --- HELPER FUNCTIONS ---

function getGameIcon(type: string) {
  switch (type) {
    case 'THEORY': return <BookOpen className="w-8 h-8" />;
    case 'TERMINAL': return <SquareTerminal className="w-8 h-8" />;
    case 'CODE_FIX': return <Wrench className="w-8 h-8" />;
    case 'MATCHING': return <Puzzle className="w-8 h-8" />;
    case 'BINARY_DECISION': return <Scale className="w-8 h-8" />;
    case 'LOGIC_ORDER': return <ArrowDownUp className="w-8 h-8" />;
    case 'QUIZ':
    default: return <Brain className="w-8 h-8" />;
  }
}

// 🛠️ MILLORA: Ara accepta 'offsetClass' per regular l'altura segons si és Boss o Normal
const StartBadge = ({ offsetClass = "-top-16" }: { offsetClass?: string }) => (
  <div className={clsx(
      "absolute left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-50 pointer-events-none w-max",
      offsetClass // <--- Classe dinàmica per pujar-lo més si cal
  )}>
    <div className="bg-white text-blue-600 px-3 py-1 rounded-lg font-bold text-[10px] shadow-xl mb-0.5 uppercase tracking-wider border-2 border-blue-100">
      START
    </div>
    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-white"></div>
  </div>
);

// --- COMPONENT PRINCIPAL ---

export function LevelNode({
  tier, status, slug, predominantType = 'QUIZ', isCurrentPosition,
  isBoss, bossTitleKey, bossIconName, bossColorClass
}: LevelNodeProps) {

  const isLocked = status === 'LOCKED';
  const isCompleted = status === 'COMPLETED';
  const isTheory = predominantType === 'THEORY';

  // ============================================
  // 🏰 RENDERITZAT DE BOSS
  // ============================================
  if (isBoss) {
    const BossContent = (
      <div className={clsx(
          "relative group flex flex-col items-center justify-center py-4",
          isCurrentPosition ? "z-40" : "z-20"
      )}>
        
        {/* 1. PRIMER pintem el BossMarker */}
        <BossMarker
          titleKey={bossTitleKey}
          iconName={bossIconName}
          colorClass={bossColorClass}
          isLocked={isLocked}
          isCompleted={isCompleted}
        />

        {/* 2. DESPRÉS pintem el Badge (així queda a sobre visualment) */}
        {/* I el pugem més amunt (-top-28) perquè el Boss és gros */}
        {isCurrentPosition && <StartBadge offsetClass="-top-28" />}
      </div>
    );

    return isLocked ? (
      <div className="flex justify-center">{BossContent}</div>
    ) : (
      <div className="flex justify-center">
        <Link href={`/learn/${slug}/play?tier=${tier}`}>{BossContent}</Link>
      </div>
    );
  }

  // ============================================
  // 🟢 RENDERITZAT NORMAL
  // ============================================

  const baseStyles = "relative w-16 h-16 md:w-20 md:h-20 rounded-full flex flex-col items-center justify-center border-b-4 transition-all duration-300 active:border-b-0 active:translate-y-[4px]";

  const statusStyles = {
    LOCKED: "bg-slate-800 border-slate-950 text-slate-500 cursor-not-allowed",
    COMPLETED: "bg-emerald-500 border-emerald-700 text-white shadow-lg shadow-emerald-900/20",
    ACTIVE: isTheory
      ? "bg-purple-600 border-purple-800 text-white shadow-[0_0_40px_rgba(147,51,234,0.4)] ring-4 ring-purple-500/20"
      : "bg-blue-600 border-blue-800 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] ring-4 ring-blue-500/20"
  };

  const NormalContent = (
    <div className={clsx(
        "relative group", 
        isCurrentPosition ? "z-40" : "z-10"
    )}>
      
      {/* Node del Nivell */}
      <div className={clsx(baseStyles, statusStyles[status], "z-10")}>
        <div className={clsx("transition-transform duration-300", status === 'ACTIVE' ? "scale-110" : "group-hover:scale-110", status === 'LOCKED' && "opacity-40 grayscale")}>
          {getGameIcon(predominantType)}
        </div>

        {status === 'COMPLETED' && <div className="absolute -right-2 -top-2 bg-yellow-400 text-yellow-900 rounded-full p-1 border-4 border-slate-950 shadow-sm z-20"><Check className="w-3.5 h-3.5 stroke-3" /></div>}
        {status === 'LOCKED' && <div className="absolute -right-1 -bottom-1 bg-slate-700 text-slate-400 rounded-full p-1.5 border-4 border-slate-950 z-20"><Lock className="w-3 h-3" /></div>}
      </div>

      {/* Etiqueta LVL */}
      <div className={clsx("absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full border text-[10px] font-bold whitespace-nowrap shadow-md", status === 'ACTIVE' ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-900 border-slate-700 text-slate-400")}>
        LVL {tier}
      </div>

      {/* Badge START al final, amb altura estàndard (-top-16) */}
      {isCurrentPosition && <StartBadge offsetClass="-top-16" />}
    </div>
  );

  return isLocked ? (
    <div className="flex justify-center py-4">{NormalContent}</div>
  ) : (
    <div className="flex justify-center py-4">
      <Link href={`/learn/${slug}/play?tier=${tier}`}>{NormalContent}</Link>
    </div>
  );
}