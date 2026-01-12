// filepath: src/core/entities/topic.entity.ts
// Definim una interfície reutilitzable per a textos multi-idioma
export interface LocalizedText {
  ca: string;
  es: string;
  en: string;
  [key: string]: string; // Per si afegeixes més idiomes futur
}
/**
 * Representa una categoria o àrea d'aprenentatge dins del sistema.
 * Aquesta entitat és agnòstica a la base de dades.
 */
export interface Topic {
  id: string;              // UUID
  slug: string;            // URL friendly ID (ex: 'react-basics')
  // nameKey: string; ❌ ELIMINAT
  title: LocalizedText; // ✅ NOU: Guardem els 3 idiomes
  description: LocalizedText; // ✅ NOU
  iconName: string;        // Identificador de la icona (ex: 'brand-react')
  colorTheme: string;      // Classe CSS o Hex (ex: 'bg-blue-500')
  parentTopicId?: string;  // Opcional: Per a jerarquies
  isActive: boolean;       // Per a soft-deletes i control de visibilitat
  // Metadades d'auditoria (opcionals al domini pur, però útils)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tipus per a la creació d'un nou tema (sense ID ni dates)
 */
export type CreateTopicInput = Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>;