// filepath: src/presentation/components/ui/gamified/ThemeToggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// 1. Component Intern (Lògica pura)
function ThemeToggleBase() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="relative p-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:scale-105 transition-transform active:scale-95 group"
      aria-label="Canviar tema"
    >
      <div className="relative w-6 h-6">
        <Sun className="absolute w-6 h-6 text-orange-400 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute w-6 h-6 text-blue-400 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
    </button>
  );
}

// 2. Placeholder de càrrega (Skeleton)
// Això es mostra mentre el client carrega el tema correcte per evitar salts.
const ToggleSkeleton = () => (
  <div className="w-11 h-11 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 animate-pulse" />
);

// 3. Exportació Dinàmica (La màgia d'arquitecte)
// ssr: false -> Next.js no intentarà renderitzar això al servidor.
// Això elimina l'error d'hidratació i el de setState síncron d'arrel.
export const ThemeToggle = dynamic(() => Promise.resolve(ThemeToggleBase), {
  ssr: false,
  loading: () => <ToggleSkeleton />,
});