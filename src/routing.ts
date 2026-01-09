// filepath: src/routing.ts
import { defineRouting } from 'next-intl/routing';

// NOVA IMPLEMENTACIÓ v4
export const routing = defineRouting({
  // Una llista de tots els locales suportats
  locales: ['ca', 'es', 'en'],
  
  // Si no es troba cap locale, es fa servir aquest
  defaultLocale: 'ca',

  // Opcional: Prefixar sempre el locale o no (as-needed és net per al default)
  localePrefix: 'always' 
});

// Exportem tipus per a usar-los al codi
export type Locale = (typeof routing.locales)[number];