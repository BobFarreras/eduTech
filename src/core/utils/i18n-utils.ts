// src/core/utils/i18n-utils.ts
import { LocalizedText } from '@/core/entities/topic.entity';

export function getLocalizedText(obj: LocalizedText | null, locale: string): string {
  if (!obj) return '';
  // 1. Retorna l'idioma actual
  // 2. Si no existeix, retorna 'ca' (o 'en') com a fallback
  // 3. Si no, retorna string buit
  return obj[locale] || obj['ca'] || obj['en'] || '';
}