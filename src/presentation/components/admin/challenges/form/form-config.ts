// filepath: src/presentation/components/admin/challenges/form/form-config.ts
import { DefaultValues } from 'react-hook-form';
import { CreateChallengeSchemaType } from '@/application/dto/challenge.schema';

export type ChallengeFormValues = CreateChallengeSchemaType;
export type Lang = 'ca' | 'es' | 'en';

// 1. Definim un estat inicial concret (només per a BINARY_DECISION)
// Això és el que tindrà el formulari quan es carregui.
const DEFAULT_STATE = {
  type: 'BINARY_DECISION', // Aquest string ha de coincidir amb l'enum de Zod
  difficultyTier: 1,
  topicId: '', // String buit inicial
  content: {
    isTrue: false,
    variant: 'TRUE_FALSE',
    statement: { ca: '', es: '', en: '' },
    explanation: { ca: '', es: '', en: '' }
  }
};

// 2. EL FIX DEFINITIU:
// Fem un "Type Assertion" doble.
// Primer a 'unknown' per esborrar la inferència estricta de l'objecte literal.
// Segon a 'DefaultValues<ChallengeFormValues>' perquè useForm s'ho empassi.
export const INITIAL_VALUES = DEFAULT_STATE as unknown as DefaultValues<ChallengeFormValues>;