// filepath: src/presentation/components/admin/challenges/list/challenge-filters.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  topics: { id: string; name: string }[];
}

const CHALLENGE_TYPES = ['QUIZ', 'CODE_FIX', 'TERMINAL', 'BINARY_DECISION', 'MATCHING', 'LOGIC_ORDER'];

export function ChallengeFilters({ topics }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentTopic = searchParams.get('topic') || 'ALL';
  const currentType = searchParams.get('type') || 'ALL'; // <--- NOU

  const handleFilterChange = (key: 'topic' | 'type', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.set('page', '1'); // Reset paginació
    router.push(`?${params.toString()}`);
  };

  // Classe comuna per als selects (Dark Mode)
  const selectClass = "appearance-none pl-3 pr-8 py-2 text-sm font-medium bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer shadow-sm min-w-[160px]";

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* SELECTOR DE TEMES */}
      <div className="relative">
        <select 
          value={currentTopic} 
          onChange={(e) => handleFilterChange('topic', e.target.value)}
          className={selectClass}
        >
          <option value="ALL">Tots els Temes</option>
          {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* SELECTOR DE TIPUS (NOU) */}
      <div className="relative">
        <select 
          value={currentType} 
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className={selectClass}
        >
          <option value="ALL">Tots els Tipus</option>
          {CHALLENGE_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
    </div>
  );
}