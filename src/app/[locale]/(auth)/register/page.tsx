// filepath: src/app/[locale]/(auth)/register/page.tsx
import { RegisterForm } from './RegisterForm';
import { getTranslations } from 'next-intl/server';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  
  // namespace 'auth.register' coincideix amb el teu fitxer .ts
  const t = await getTranslations({ locale, namespace: 'auth.register' });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl backdrop-blur-sm w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-slate-400">{t('subtitle')}</p>
      </div>
      <RegisterForm />
    </div>
  );
}