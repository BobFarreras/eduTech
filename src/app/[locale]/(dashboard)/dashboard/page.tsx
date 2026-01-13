// filepath: src/app/(dashboard)/page.tsx
import { createClient } from '@/infrastructure/utils/supabase/server';
import { SupabaseTopicRepository } from '@/infrastructure/repositories/supabase/supabase-topic.repository';
import { GetUserDashboardUseCase } from '@/application/use-cases/dashboard/get-user-dashboard.use-case';
import { TopicCard } from '@/presentation/components/features/dashboard/TopicCard';
import { getLocalizedText } from '@/core/utils/i18n-utils';
import { redirect } from 'next/navigation';

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const topicRepo = new SupabaseTopicRepository();
  const useCase = new GetUserDashboardUseCase(topicRepo);
  // ✅ FIX: Ara només passem el userId.
  const topics = await useCase.execute(user.id);

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 p-2 md:p-6 pb-12">

      {/* CAPÇALERA MINIMALISTA (Tipus Netflix/App Store) */}
      <div className="max-w-6xl mx-auto mb-8 mt-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block" />
          Missions Disponibles
        </h2>
        <p className="text-slate-500 text-sm mt-1 ml-3.5">
          Tria una tecnologia per continuar el teu entrenament.
        </p>
      </div>

      {/* GRID NET I COMPACTE */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            translatedTitle={getLocalizedText(topic.title, locale)}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}