// filepath: src/i18n.ts
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  // Validació sense 'any':
  // Convertim routing.locales a llista d'strings genèrics per comprovar
  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    notFound(); // Ara sí que l'executem si la validació falla
  }

  return {
    // Aquí ja estem segurs que 'locale' és vàlid, podem fer el cast segur a Locale
    locale: locale as Locale,
    messages: (await import(`../messages/${locale}.ts`)).default
  };
});