// filepath: src/app/[locale]/(admin)/sys-ops/challenges/page.tsx
import Link from 'next/link';

import { assertAdmin } from '@/presentation/utils/auth-guards';
import { SupabaseChallengeRepository } from '@/infrastructure/repositories/supabase/challenge.repository';
import { SupabaseTopicRepository } from '@/infrastructure/repositories/supabase/topic.repository';

// Components UI Modulars
import { ChallengeFilters } from '@/presentation/components/admin/challenges/list/challenge-filters';
import { ChallengeTable } from '@/presentation/components/admin/challenges/list/challenge-table'; 
import { AdminPagination } from '@/presentation/components/ui/admin-pagination';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function AdminChallengesList({ searchParams }: PageProps) {
  await assertAdmin();

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const topicFilter = params.topic as string || 'ALL';
  const typeFilter = params.type as string || 'ALL'; // <--- NOU

  const challengeRepo = new SupabaseChallengeRepository();
  const topicRepo = new SupabaseTopicRepository();

  const [paginatedResult, topics] = await Promise.all([
    // Passem el nou filtre al repo
    challengeRepo.findAllPaginated(page, 10, topicFilter, typeFilter),
    topicRepo.findAll()
  ]);

  const { data: challenges, totalPages, total } = paginatedResult;
  const topicOptions = topics.map(t => ({ id: t.id, name: t.slug }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 px-4 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* HEADER UNIFICAT (Títol + Filtres + Accions) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
          
          {/* Esquerra: Títol i Comptador */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              Gestió de Reptes
              <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-xs font-mono border border-gray-200 dark:border-slate-700">
                {total}
              </span>
            </h1>
          </div>

          {/* Dreta: Toolbar (Filtres i Botó) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
             {/* ELS FILTRES ARA VIUEN AQUÍ */}
             <ChallengeFilters topics={topicOptions} />
             
             <div className="w-px h-8 bg-gray-200 dark:bg-slate-800 hidden sm:block"></div>

             <Link 
              href="/sys-ops/challenges/create" 
              className="bg-black dark:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Nou Repte
            </Link>
          </div>
        </div>

        {/* TAULA + PAGINACIÓ (Integrats visualment) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
           <ChallengeTable challenges={challenges} />
           <AdminPagination currentPage={page} totalPages={totalPages} />
        </div>
        
      </div>
    </div>
  );
}