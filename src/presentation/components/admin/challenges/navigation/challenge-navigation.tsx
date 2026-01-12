// filepath: src/presentation/components/admin/challenges/navigation/challenge-navigation.tsx
import Link from 'next/link';

interface Props {
  prevId: string | null;
  nextId: string | null;
}

export function ChallengeNavigation({ prevId, nextId }: Props) {
  // Estils comuns per als botons de navegació
  const btnClass = "flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center gap-2">
      {/* BOTÓ TORNAR AL LLISTAT */}
      <Link 
        href="/sys-ops/challenges" 
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-800/50 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors mr-2"
        title="Tornar al llistat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        <span className="hidden sm:inline">Llista</span>
      </Link>

      <div className="h-6 w-px bg-gray-300 dark:bg-slate-700 mx-1"></div>

      {/* PREVIOUS */}
      {prevId ? (
        <Link href={`/sys-ops/challenges/${prevId}/edit`} className={btnClass} title="Repte anterior (més nou)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </Link>
      ) : (
        <button disabled className={btnClass}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
      )}

      {/* NEXT */}
      {nextId ? (
        <Link href={`/sys-ops/challenges/${nextId}/edit`} className={btnClass} title="Repte següent (més antic)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </Link>
      ) : (
        <button disabled className={btnClass}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      )}
    </div>
  );
}