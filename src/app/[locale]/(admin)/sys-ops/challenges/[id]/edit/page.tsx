// filepath: src/app/[locale]/(admin)/sys-ops/challenges/[id]/edit/page.tsx
import { notFound } from 'next/navigation';
import { assertAdmin } from '@/presentation/utils/auth-guards';
import { SupabaseChallengeRepository } from '@/infrastructure/repositories/supabase/supabase-challenge.repository';
import { SupabaseTopicRepository } from '@/infrastructure/repositories/supabase/supabase-topic.repository';
import { ChallengeEditor } from '@/presentation/components/admin/challenges/challenge-editor';
import { ChallengeFormValues } from '@/presentation/components/admin/challenges/form/form-config';
// Importem el nou component de navegació
import { ChallengeNavigation } from '@/presentation/components/admin/challenges/navigation/challenge-navigation';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditChallengePage({ params }: EditPageProps) {
  // 1. Seguretat
  await assertAdmin();
  
  // 2. Setup
  const { id } = await params;
  const challengeRepo = new SupabaseChallengeRepository();
  const topicRepo = new SupabaseTopicRepository();

  // 3. Fetching Paral·lel (Optimitzat)
  // Ara necessitem: El Repte, Els Topics (pel select) i saber qui són els veïns.
  
  // Primer obtenim el repte per tenir la data de creació
  const challenge = await challengeRepo.findById(id);
  
  if (!challenge) {
    notFound();
  }

  // Ara busquem la resta en paral·lel
  const [topics, navigation] = await Promise.all([
    topicRepo.findAll(),
    // Busquem anterior/següent basant-nos en la data d'aquest repte
    challengeRepo.findAdjacentChallenges(challenge.id, challenge.createdAt.toISOString())
  ]);

  // 4. Preparació de Dades
  const topicOptions = topics.map(t => ({ id: t.id, name: t.slug }));

  const initialFormValues = {
    topicId: challenge.topicId,
    difficultyTier: challenge.difficultyTier,
    type: challenge.type,
    content: challenge.content,
  } as unknown as ChallengeFormValues;

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* HEADER DE LA PÀGINA (Amb Navegació) */}
      <div className="mb-6 flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-gray-400">#</span>
            Editar Repte
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-mono mt-1 flex items-center gap-2">
            ID: {id.split('-')[0]}... 
            <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
              {challenge.type}
            </span>
          </p>
        </div>

        {/* COMPONENT DE NAVEGACIÓ NOU */}
        <ChallengeNavigation prevId={navigation.prevId} nextId={navigation.nextId} />
      </div>

      {/* EDITOR */}
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
        <ChallengeEditor 
          topics={topicOptions} 
          initialData={initialFormValues} 
          challengeId={id} 
        />
      </div>
    </div>
  );
}