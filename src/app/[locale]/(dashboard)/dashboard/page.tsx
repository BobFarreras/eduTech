// filepath: src/app/(dashboard)/page.tsx
import { createClient } from '@/infrastructure/utils/supabase/server';
import { SupabaseTopicRepository } from '@/infrastructure/repositories/supabase/topic.repository';
import { GetUserDashboardUseCase } from '@/application/use-cases/dashboard/get-user-dashboard.use-case';
import { TopicCard } from '@/presentation/components/features/dashboard/TopicCard';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getLocalizedText } from '@/core/utils/i18n-utils';
import Link from 'next/link'; // <--- IMPORT
import { Trophy } from 'lucide-react'; // <--- IMPORT

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  const t = await getTranslations();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const topicRepo = new SupabaseTopicRepository();
  const useCase = new GetUserDashboardUseCase(topicRepo);
  const topics = await useCase.execute(user.id, locale, supabase);

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
      {/* CAPÇALERA AMB LINK AL LEADERBOARD */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
            {t('dashboard.welcome_title')}, <span className="text-blue-500">{user.email?.split('@')[0]}</span>! 👋
          </h1>
          <p className="text-slate-400 text-lg">
            {t('dashboard.subtitle')}
          </p>
        </div>
        
        {/* BOTÓ LEADERBOARD */}
        <Link 
          href="/leaderboard"
          className="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg hover:shadow-yellow-500/20 active:scale-95"
        >
          <Trophy className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>Veure Rànquing</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            translatedTitle={getLocalizedText(topic.title, locale)}
            locale={locale}
          />
        ))}
      </div>

      {topics.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500">No s'han trobat temes actius.</p>
        </div>
      )}
    </div>
  );
}