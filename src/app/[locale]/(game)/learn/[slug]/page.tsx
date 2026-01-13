// filepath: src/app/[locale]/(game)/learn/[slug]/page.tsx
import { createClient } from '@/infrastructure/utils/supabase/server';
import { GetTopicPathUseCase } from '@/application/use-cases/topics/get-topic-path.use-case';
import { SupabaseTopicRepository } from '@/infrastructure/repositories/supabase/supabase-topic.repository';
import { ArrowLeft } from 'lucide-react';
import { redirect } from 'next/navigation';
// ❌ ELIMINAT: import { getTranslations } from 'next-intl/server'; (ja no cal per al títol)
import { Link } from '@/navigation'; 
import { LearningPathOrchestrator } from '@/presentation/components/features/learning-path/LearningPathOrchestrator';
import { getLocalizedText } from '@/core/utils/i18n-utils'; // ✅ 1. IMPORTAR UTILITAT

interface TopicPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function TopicMapPage({ params }: TopicPageProps) {
  // ✅ 2. EXTREIEM EL LOCALE DELS PARAMS
  const { slug, locale } = await params;
  
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const topicRepo = new SupabaseTopicRepository();
  const topic = await topicRepo.findBySlug(slug);
  
  if (!topic) return <div className="text-white text-center pt-20">Tema no trobat (404)</div>;

  const pathUseCase = new GetTopicPathUseCase(topicRepo);
  const { levels, totalXp } = await pathUseCase.execute(user.id, topic.id);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center relative overflow-hidden">
      
      {/* HEADER */}
      <header className="sticky top-0 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-3 md:p-4 flex items-center justify-between z-50 shadow-2xl">
         <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
         </Link>
         
         {/* ✅ 3. FIX: Títol dinàmic des de la BD */}
         <h1 className="font-bold text-white text-base md:text-xl tracking-tight">
            {getLocalizedText(topic.title, locale)}
         </h1>
         
         <div className="text-xs md:text-sm font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            {totalXp} XP
         </div>
      </header>

      {/* RUTA */}
      <div className="w-full flex-1 relative">
         <LearningPathOrchestrator levels={levels} slug={slug} />
      </div>
    </div>
  );
}