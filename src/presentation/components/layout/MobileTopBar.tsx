// filepath: src/presentation/components/layout/MobileTopBar.tsx
'use client';

import { UserProfile } from '@/core/entities/user-profile.entity';
import { Zap, Flame } from 'lucide-react';
import { ThemeToggle } from '../ui/gamified/ThemeToggle';

interface MobileTopBarProps {
  userProfile: UserProfile | null;
}

export function MobileTopBar({ userProfile }: MobileTopBarProps) {
  if (!userProfile) return null;

  return (
    <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b-2 border-slate-200 dark:border-slate-800 z-40 px-4 flex items-center justify-between">
      
      {/* Esquerra: Nivell / Curs actual */}
      <div className="flex items-center gap-2">
         {/* Aquí podries posar una bandera de llenguatge com Duolingo */}
         <div className="font-black text-xl text-slate-700 dark:text-slate-200 tracking-tighter">
            eduTech
         </div>
      </div>

      {/* Dreta: Stats i Tema */}
      <div className="flex items-center gap-3">
        
        {/* Racha (Foc) */}
        <div className="flex items-center gap-1">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            <span className="font-bold text-orange-500">0</span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1">
            <Zap className="w-5 h-5 text-blue-500 fill-blue-500" />
            <span className="font-bold text-blue-500">{userProfile.totalXp}</span>
        </div>

        <ThemeToggle />
      </div>
    </div>
  );
}