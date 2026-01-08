// filepath: src/i18n.ts
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Definim els idiomes suportats i el tipus
export const locales = ['ca', 'es', 'en'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // Aconseguim el locale de la petició
  const locale = await requestLocale;

  // Validació estricta
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    // AQUI ESTÀ EL CANVI: Importem el fitxer .ts directament
    messages: (await import(`../messages/${locale}.ts`)).default
  };
});