// filepath: src/app/[locale]/page.tsx
import { getTopicsAction } from '@/presentation/actions/topics/get-topics.action';
import { TopicCard } from '@/presentation/components/features/topics/TopicCard';
import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('app');
  const tDash = await getTranslations('dashboard');

  // Cridem a la Server Action directament (és codi de servidor)
  const response = await getTopicsAction();
  
  const topics = response.success ? response.data : [];

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-slate-900 text-white">
      <div className="z-10 max-w-5xl w-full flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-12">
          {t('name')}
        </h1>

        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-6 text-slate-200">
            {tDash('availableTopics')}
          </h2>

          {!response.success && (
             <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
                {response.error}
             </div>
          )}

          {topics.length === 0 && response.success ? (
            <p className="text-slate-400 italic">No hi ha temes actius en aquest moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}