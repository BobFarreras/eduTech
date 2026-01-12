// filepath: src/app/[locale]/(admin)/sys-ops/challenges/create/page.tsx
import { getTranslations, getLocale } from 'next-intl/server'; // ✅ 1. AFEGIR getLocale
import { assertAdmin } from '@/presentation/utils/auth-guards';
import { SupabaseTopicRepository } from '@/infrastructure/repositories/supabase/topic.repository';
import { GetAllTopicsUseCase } from '@/application/use-cases/topics/get-all-topics.use-case';
import { ChallengeEditor } from '@/presentation/components/admin/challenges/challenge-editor';
import { getLocalizedText } from '@/core/utils/i18n-utils'; // ✅ 2. IMPORTAR UTILITAT

export default async function CreateChallengePage() {
  // 1. Seguretat
  await assertAdmin();

  // 2. Traduccions i Idioma
  const t = await getTranslations('Admin.Challenges');
  const locale = await getLocale(); // ✅ Obtenim l'idioma actual
  // ❌ ELIMINAT: const tTopics = await getTranslations('Topics'); 

  // 3. Composition Root
  const topicRepo = new SupabaseTopicRepository();
  const getAllTopics = new GetAllTopicsUseCase(topicRepo);

  // 4. Fetching
  const topics = await getAllTopics.execute();

  // 5. ViewModel (Molt més net, sense hacks de TypeScript)
  const topicOptions = topics.map(topic => {
    return {
      id: topic.id,
      // ✅ 3. FIX: Traducció dinàmica directa
      name: getLocalizedText(topic.title, locale) 
    };
  });

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('createTitle')}</h1>
        <p className="text-gray-500 mt-2">
          {t.has('subtitle') ? t('subtitle') : "Gestor de contingut avançat per a reptes tecnològics."}
        </p>
      </div>

      <div className="bg-white p-0 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <ChallengeEditor topics={topicOptions} />
      </div>
    </div>
  );
}