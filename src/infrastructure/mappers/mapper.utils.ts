// filepath: src/infrastructure/mappers/mapper.utils.ts

export type LocalizedString = Record<string, string>;

/**
 * Tradueix un camp que pot ser string, objecte localitzat o null/unknown.
 */
export function translate(field: unknown, locale: string): string {
  if (typeof field === 'string') return field;
  
  if (!field || typeof field !== 'object') return '';

  // Fem un cast segur perquè sabem que és un objecte, 
  // però accedim amb comprovació de claus
  const localized = field as Record<string, unknown>;
  
  const val = localized[locale] || localized['ca'] || localized['en'] || Object.values(localized)[0];
  
  return typeof val === 'string' ? val : '';
}

/**
 * Parsea el JSON de forma segura retornant 'unknown' en lloc de 'any'.
 * Això obliga a qui ho usi a definir el tipus esperat.
 */
export function parseJsonContent(content: unknown): unknown {
  if (typeof content === 'string') {
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error('Error parsing JSON content', e);
      return {};
    }
  }
  return content || {};
}