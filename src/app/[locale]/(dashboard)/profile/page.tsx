// filepath: src/app/(dashboard)/profile/page.tsx
import { createClient } from '@/infrastructure/utils/supabase/server';
import { createProfileService } from '@/application/di/container';
import { ProfileForm } from '@/presentation/components/profile/ProfileForm';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server'; // <--- IMPORT

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  // 1. Paral·lelitzem les peticions per rendiment
  const supabase = await createClient();
  const tPromise = getTranslations('profile'); // <--- Iniciem fetch traduccions
  const userPromise = supabase.auth.getUser();

  const [t, { data: { user } }] = await Promise.all([tPromise, userPromise]);

  if (!user) redirect('/login');

  const { getUserProfile } = createProfileService(supabase);
  const profile = await getUserProfile.execute(user.id);

  if (!profile) {
    return <div className="text-white p-10">Error: No s'ha trobat el perfil.</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-12 pb-24">
       <header className="max-w-4xl mx-auto mb-10 relative">
        <Link 
            href="/dashboard" 
            className="absolute -left-12 top-1 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all hidden md:block"
            title="Tornar al Dashboard"
        >
            <ArrowLeft className="w-6 h-6" />
        </Link>

        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
          {t('title')} {/* <--- Traducció */}
        </h1>
        <p className="text-slate-400">
          {t('subtitle')} {/* <--- Traducció */}
        </p>
      </header>

      <ProfileForm profile={profile} />
    </main>
  );
}