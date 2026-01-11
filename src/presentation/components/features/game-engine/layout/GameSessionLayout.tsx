// filepath: src/presentation/components/features/game-engine/layout/GameSessionLayout.tsx
'use client';

import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface GameSessionLayoutProps {
  header: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  className?: string;
}

export function GameSessionLayout({ header, children, footer, className }: GameSessionLayoutProps) {
  return (
    // Usem 'dvh' (dynamic viewport height) per mòbils.
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0a] h-dvh w-screen overflow-hidden text-slate-200">
      
      {/* 1. HEADER (Fix a dalt) */}
      <header className="shrink-0 px-4 py-3 bg-[#0a0a0a]/90 backdrop-blur-md z-20 border-b border-white/5">
        {header}
      </header>

      {/* 2. ZONA DE JOC (Flexible i Centrada) */}
      <main className="flex-1 w-full relative overflow-hidden flex flex-col">
        {/* Aquest div intern és el que fa la màgia del centrat.
            - overflow-y-auto: Permet scroll si el contingut és molt alt (com CodeFix).
            - flex items-center justify-center: Centra continguts petits (com Quiz).
        */}
        <div className={clsx(
            "flex-1 w-full h-full overflow-y-auto overflow-x-hidden",
            "flex flex-col items-center", // Centrat Horitzontal
            // Centrat Vertical 'intel·ligent': 
            // Si hi ha scroll, es queda a dalt. Si no, es centra.
            "justify-center py-4 px-4 md:px-0" 
        )}>
           {/* Wrapper per limitar l'amplada màxima */}
           <div className={clsx("w-full max-w-3xl animate-in zoom-in-95 duration-300", className)}>
              {children}
           </div>
        </div>
      </main>

      {/* 3. FOOTER (Fix a baix) */}
      {/* 'pb-safe' és crucial per als iPhones moderns (la barra negra de baix) */}
      <footer className="shrink-0 w-full bg-[#0a0a0a]/90 backdrop-blur-md z-20 border-t border-white/5 pb-safe">
        <div className="max-w-3xl mx-auto px-4 py-4">
           {footer}
        </div>
      </footer>

    </div>
  );
}