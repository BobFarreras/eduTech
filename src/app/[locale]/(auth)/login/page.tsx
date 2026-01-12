// filepath: src/app/[locale]/(auth)/login/page.tsx
import { LoginForm } from './LoginForm';
import { getTranslations } from 'next-intl/server'; // <--- Import de servidor

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: Props) {
  // 1. Esperem els paràmetres (Next.js 15 requires await)
  const { locale } = await params;
  
  // 2. Carreguem les traduccions al servidor
  const t = await getTranslations({ locale, namespace: 'auth.login' });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl backdrop-blur-sm w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-slate-400">{t('subtitle')}</p>
      </div>

      <LoginForm />
    </div>
  );
}