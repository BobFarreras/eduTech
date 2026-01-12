// ✅ ARA (CORRECTE - Apuntant al teu fitxer v4):
import { Link } from '@/navigation';   // <-- AQUEST ÉS EL CANVI CLAU
import { redirect } from 'next/navigation'; // El redirect aquí pot ser el natiu pq ja tenim el locale als params

import { createClient } from '@/infrastructure/utils/supabase/server';
import { ArrowRight, Code2, Terminal } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

interface LandingPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LandingPage({ params }: LandingPageProps) {
  // 1. OBTENIR LOCALE I TRADUCCIONS
  const { locale } = await params;
  const t = await getTranslations('landing');
  const supabase = await createClient();

  // 2. SI JA TÉ SESSIÓ -> CAP AL DASHBOARD (AMB LOCALE CORRECTE!)
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-white overflow-hidden relative">
      


      {/* Fons Decoratiu */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-125 bg-blue-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Contingut */}
      <div className="z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center max-w-4xl mx-auto pt-20">
        
        {/* Badge */}
        <div className="mb-8 px-4 py-1.5 rounded-full border border-slate-700 bg-slate-900/50 backdrop-blur-sm text-sm text-slate-300 font-medium inline-flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           {t('badge')}
        </div>

        {/* Títol Hero */}
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
           {t('title_prefix')} <br/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
             {t('title_highlight')}
           </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-700">
           {t('description')}
        </p>

        {/* Botons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-16 duration-700">
           <Link 
             href="/login" 
             className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
           >
             {t('cta_primary')} <ArrowRight className="w-5 h-5" />
           </Link>
           <Link 
             href="/about" 
             className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700"
           >
             {t('cta_secondary')}
           </Link>
        </div>

        {/* Icones Flotants (Decoració) */}
        <div className="absolute top-1/4 left-10 md:left-20 opacity-20 rotate-[-12deg] animate-pulse pointer-events-none">
            <Code2 className="w-24 h-24" />
        </div>
        <div className="absolute bottom-1/4 right-10 md:right-20 opacity-20 rotate-[12deg] animate-pulse pointer-events-none">
            <Terminal className="w-24 h-24" />
        </div>
      </div>
    </main>
  );
}