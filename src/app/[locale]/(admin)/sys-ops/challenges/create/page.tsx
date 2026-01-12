// filepath: src/app/[locale]/(admin)/sys-ops/challenges/create/page.tsx
import { getTranslations } from 'next-intl/server';
import { assertAdmin } from '@/presentation/utils/auth-guards';
import { SupabaseTopicRepository } from '@/infrastructure/repositories/supabase/topic.repository';
import { GetAllTopicsUseCase } from '@/application/use-cases/topics/get-all-topics.use-case';
import { ChallengeEditor } from '@/presentation/components/admin/challenges/challenge-editor';

export default async function CreateChallengePage() {
  // 1. Seguretat
  await assertAdmin();

  // 2. Traduccions
  const t = await getTranslations('Admin.Challenges');
  const tTopics = await getTranslations('Topics'); 

  // 3. Composition Root
  const topicRepo = new SupabaseTopicRepository();
  const getAllTopics = new GetAllTopicsUseCase(topicRepo);

  // 4. Fetching
  const topics = await getAllTopics.execute();

  // 5. ViewModel (Sense 'any')
  // Definim el tipus de les claus acceptades per la funció de traducció
  type TopicKey = Parameters<typeof tTopics>[0];

  const topicOptions = topics.map(topic => {
    // Validació de tipus en temps d'execució (opcional però recomanada)
    // Forcem el tipus a TopicKey perquè sabem que la BD conté claus vàlides
    const translatedName = tTopics.has(topic.nameKey as TopicKey) 
      ? tTopics(topic.nameKey as TopicKey) 
      : topic.nameKey;

    return {
      id: topic.id,
      name: translatedName
    };
  });

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('createTitle')}</h1>
        <p className="text-gray-500 mt-2">
          {/* Fallback segur si la traducció no existeix */}
          {t.has('subtitle') ? t('subtitle') : "Gestor de contingut avançat per a reptes tecnològics."}
        </p>
      </div>

      <div className="bg-white p-0 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <ChallengeEditor topics={topicOptions} />
      </div>
    </div>
  );
}