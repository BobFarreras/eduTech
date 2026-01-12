// filepath: src/app/[locale]/admin/challenges/create/page.tsx
import { getTranslations } from 'next-intl/server';
// ELIMINAT: import { redirect } ... (Netegem imports no usats)

// Clean Architecture Imports
import { SupabaseTopicRepository } from '@/infrastructure/repositories/supabase/topic.repository';
import { GetAllTopicsUseCase } from '@/application/use-cases/topics/get-all-topics.use-case';

// UI Components
// CORRECCIÓ 1: Arreglat el typo en el nom del fitxer (...-form, no ...-from)
import { CreateChallengeForm } from '@/presentation/components/admin/challenges/create-challenge-from';
import { assertAdmin } from '@/presentation/utils/auth-guards';

export default async function CreateChallengePage() {
  // 1. Seguretat
  await assertAdmin();

  // 2. Preparar traduccions
  const t = await getTranslations('Admin.Challenges');
  // CORRECCIÓ 2: Carreguem també les traduccions dels Topics per mostrar noms reals
  const tTopics = await getTranslations('Topics');

  // 3. Composition Root
  const topicRepo = new SupabaseTopicRepository();
  const getAllTopics = new GetAllTopicsUseCase(topicRepo);

  // 4. Fetching
  const topics = await getAllTopics.execute();

  // 5. Mapeig (ViewModel)
  const topicOptions = topics.map(topic => ({
    id: topic.id,
    // CORRECCIÓ 3: L'entitat té 'nameKey', no 'name'. 
    // La traduïm aquí al servidor perquè el Client Component rebi un string llest per pintar.
    name: tTopics(topic.nameKey as any) || topic.nameKey
  }));

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 mt-2">
          {t('subtitle') || "Afegeix nous reptes a la plataforma per a qualsevol tema."}
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <CreateChallengeForm topics={topicOptions} />
      </div>
    </div>
  );
}