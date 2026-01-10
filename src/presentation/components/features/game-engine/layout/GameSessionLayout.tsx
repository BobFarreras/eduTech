// filepath: src/presentation/components/features/game-engine/layout/GameSessionLayout.tsx
'use client';

import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface GameSessionLayoutProps {
  header: ReactNode;
  children: ReactNode; // La zona de joc
  footer: ReactNode;   // El botó de verificar
  className?: string;
}

export function GameSessionLayout({ header, children, footer, className }: GameSessionLayoutProps) {
  return (
    // CONTENIDOR MESTRE: Fixat a la pantalla, sense scroll global.
    // 'fixed inset-0' garanteix que ocupa tota la pantalla i tapa la UI de sota.
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 h-dvh w-screen overflow-hidden">
      
      {/* 1. HEADER (Fix) */}
      <header className="shrink-0 px-4 py-3 bg-slate-950/95 backdrop-blur z-20 border-b border-white/5">
        {header}
      </header>

      {/* 2. ZONA DE JOC (Flexible) */}
      {/* 'flex-1' l'obliga a ocupar tot l'espai disponible.
          'min-h-0' és vital per permetre scroll intern en fills flex.
          'relative' crea un context per a posicionaments absoluts interns. */}
      <main className={clsx("flex-1 min-h-0 relative w-full max-w-3xl mx-auto", className)}>
        {/* Wrapper intern per centrar i donar padding sense trencar el scroll */}
        <div className="h-full w-full flex flex-col px-4 py-2 overflow-hidden">
           {children}
        </div>
      </main>

      {/* 3. FOOTER (Fix i Segur) */}
      {/* 'pb-safe' (si tens la utilitat de Tailwind configurada) o un padding generós */}
      <footer className="shrink-0 px-4 pt-3 pb-6 bg-slate-950/95 backdrop-blur z-20 border-t border-white/5 w-full max-w-3xl mx-auto">
        {footer}
      </footer>

    </div>
  );
}