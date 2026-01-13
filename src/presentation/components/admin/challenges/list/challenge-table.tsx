// filepath: src/presentation/components/admin/challenges/list/challenge-table.tsx
import Link from 'next/link';
import { deleteChallengeAction } from '@/presentation/actions/admin/challenge.actions';
import { AdminChallengeSummary } from '@/infrastructure/repositories/supabase/supabase-challenge.repository';

interface Props {
  challenges: AdminChallengeSummary[];
}

export function ChallengeTable({ challenges }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800">
            <tr>
              <HeaderCell>Tipus</HeaderCell>
              <HeaderCell>Tema</HeaderCell>
              <HeaderCell align="center">Nivell</HeaderCell>
              <HeaderCell>Creat</HeaderCell>
              <HeaderCell align="right">Accions</HeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {challenges.map((challenge) => (
              <tr key={challenge.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge type={challenge.type} />
                </td>
                <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-slate-400">
                  {challenge.topicSlug}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs font-bold">
                    {challenge.difficultyTier}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500 dark:text-slate-500 whitespace-nowrap">
                  {new Date(challenge.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <ActionsCell id={challenge.id} />
                </td>
              </tr>
            ))}

            {challenges.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-500 dark:text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">📭</span>
                    <p>No s'han trobat reptes amb aquests filtres.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS PER MANTENIR EL CODI NET ---

function HeaderCell({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'center' | 'right' }) {
  return (
    <th className={`px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-${align}`}>
      {children}
    </th>
  );
}

function Badge({ type }: { type: string }) {
  const styles = getTypeColor(type);
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${styles}`}>
      {type}
    </span>
  );
}

function ActionsCell({ id }: { id: string }) {
  return (
    <div className="flex justify-end items-center gap-3">
      <Link
        href={`/sys-ops/challenges/${id}/edit`}
        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium text-xs flex items-center gap-1 hover:underline"
      >
        ✏️ Editar
      </Link>

      <form action={async () => {
        'use server';
        await deleteChallengeAction(id);
      }}>
        <button
          type="submit"
          className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors text-xs font-medium"
          title="Eliminar"
        >
          🗑️
        </button>
      </form>
    </div>
  );
}

// Helper de colors adaptat a Dark Mode
function getTypeColor(type: string) {
  switch (type) {
    case 'QUIZ': 
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900';
    case 'TERMINAL': 
      return 'bg-gray-900 text-green-400 border-gray-700 dark:bg-black dark:text-green-500 dark:border-green-900';
    case 'BINARY_DECISION': 
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900';
    case 'CODE_FIX': 
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900';
    default: 
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
  }
}