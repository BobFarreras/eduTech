// filepath: src/app/[locale]/(game)/learn/[slug]/page.tsx
import { createClient } from '@/infrastructure/utils/supabase/server';
import { GetTopicPathUseCase } from '@/application/use-cases/topics/get-topic-path.use-case';
import { SupabaseTopicRepository } from '@/infrastructure/repositories/supabase/topic.repository';
import { LevelNode } from '@/presentation/components/features/learning-path/LevelNode';
import { ArrowLeft } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation'; 

interface TopicPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function TopicMapPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const t = await getTranslations(); 
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 1. Instanciem el Repo
  const topicRepo = new SupabaseTopicRepository();
  const topic = await topicRepo.findBySlug(slug);
  
  if (!topic) {
    return <div className="text-white text-center pt-20">Tema no trobat 404</div>;
  }

  // 2. CORRECCIÓ CRÍTICA: Passem 'topicRepo' al constructor
  const pathUseCase = new GetTopicPathUseCase(topicRepo);
  
  // 3. CORRECCIÓ: Ja no passem 'supabase' a l'execute
  const { levels, totalXp } = await pathUseCase.execute(user.id, topic.id);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center pb-20 relative overflow-hidden">
      
      {/* HEADER FLOTANT */}
      <header className="sticky top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between">
         <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
         </Link>
         
         <h1 className="font-bold text-white text-lg tracking-tight">
            {t(topic.nameKey)}
         </h1>
         
         <div className="text-sm font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
            {totalXp} / {levels.length > 0 ? '?' : 0} 
            {/* Petit canvi visual, pots posar el que vulguis aquí */}
         </div>
      </header>

      {/* FONS CAMÍ (SVG LINE) */}
      <div className="absolute top-0 w-full h-full flex justify-center pointer-events-none opacity-20">
         <svg className="h-full" width="200" height="100%">
            <line x1="100" y1="0" x2="100" y2="100%" stroke="currentColor" strokeWidth="10" className="text-slate-800" strokeDasharray="20,10" />
         </svg>
      </div>

      {/* LLISTA DE NIVELLS (CAMÍ) */}
      <div className="flex flex-col gap-8 mt-12 w-full max-w-md px-4 relative">
          {levels.map((level, index) => (
             <LevelNode 
                key={level.tier} 
                tier={level.tier} 
                status={level.status} 
                slug={slug}
                index={index}
             />
          ))}
          
          <div className="flex justify-center mt-8 opacity-50">
             <div className="w-32 h-32 border-4 border-dashed border-slate-800 rounded-full flex items-center justify-center text-slate-700 font-black text-2xl">
                BOSS
             </div>
          </div>
      </div>
    </div>
  );
}