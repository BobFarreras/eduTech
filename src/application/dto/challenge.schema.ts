// filepath: src/application/dto/challenge.schema.ts
import { z } from 'zod';

// --- BUILDING BLOCKS ---

// Acceptem String simple (per a codi o termes tècnics) o Objecte i18n
const LocalizedOrString = z.union([
  z.string(),
  z.object({
    ca: z.string().optional(),
    es: z.string().optional(),
    en: z.string().optional(),
  })
]);

// Forcem i18n complet per a textos narratius (preguntes, explicacions)
const LocalizedTextStrict = z.object({
  ca: z.string().min(1, "Falta CA"),
  es: z.string().min(1, "Falta ES"),
  en: z.string().min(1, "Falta EN"),
});

// --- CONTENT SCHEMAS ---

const BinaryDecisionSchema = z.object({
  isTrue: z.boolean(),
  variant: z.enum(['HOT_OR_NOT', 'TRUE_FALSE', 'YES_NO']).default('TRUE_FALSE'),
  statement: LocalizedTextStrict,
  explanation: LocalizedTextStrict,
});

const QuizSchema = z.object({
  question: LocalizedTextStrict,
  explanation: LocalizedTextStrict,
  options: z.array(z.object({
    id: z.string(),
    text: LocalizedTextStrict
  })),
  correctOptionIndex: z.number()
});

const MatchingSchema = z.object({
  instruction: LocalizedTextStrict,
  pairs: z.array(z.object({
    left: z.object({ id: z.string(), text: LocalizedOrString }),
    right: z.object({ id: z.string(), text: LocalizedOrString })
  }))
});

const CodeFixSchema = z.object({
  description: LocalizedTextStrict,
  initialCode: z.string(),
  solution: z.string(), // La solució és codi únic
  hint: LocalizedTextStrict,
  options: z.array(z.object({
    id: z.string(),
    code: z.string(),
    isCorrect: z.boolean()
  }))
});

const TerminalSchema = z.object({
  instruction: LocalizedTextStrict,
  initialCommand: z.string().optional(),
  validCommands: z.array(z.string()),
  hint: LocalizedTextStrict,
  explanation: LocalizedTextStrict,
  outputParams: z.object({
    success: z.string(),
    error: z.string()
  })
});

const LogicOrderSchema = z.object({
  description: LocalizedTextStrict,
  items: z.array(z.object({
    id: z.string(),
    text: LocalizedTextStrict
  }))
});

const CtfSchema = z.object({
  description: LocalizedTextStrict,
  flag: z.string().min(1, "La Flag és obligatòria"),
  hint: LocalizedTextStrict,
  // Opcional: Podries afegir un enllaç a un fitxer extern si calgués
});

const TheorySchema = z.object({
  title: LocalizedTextStrict,
  markdownContent: LocalizedTextStrict, // Contingut teòric llarg
  timeToRead: z.coerce.number().optional()
});
// --- MASTER SCHEMA ---

export const CreateChallengeSchema = z.object({
  topicId: z.string().uuid(),
  difficultyTier: z.coerce.number().min(1).max(10),
  // 1. ACTUALITZEM L'ENUM AMB TOTS ELS TIPUS
  type: z.enum([
    'BINARY_DECISION', 
    'QUIZ', 
    'CODE_FIX', 
    'MATCHING', 
    'TERMINAL', 
    'LOGIC_ORDER',
    'CTF',    // 👈 NOU
    'THEORY'  // 👈 NOU
  ]),
  
  // Unió discriminada: Zod validarà l'estructura segons el 'type' del pare (si ho féssim amb superRefine)
  // Per simplificar el formulari, usem una unió oberta i validem lògica a UI o backend
  content: z.union([
    BinaryDecisionSchema,
    QuizSchema,
    MatchingSchema,
    CodeFixSchema,
    TerminalSchema,
    LogicOrderSchema,
    CtfSchema,    // 👈 NOU
    TheorySchema  // 👈 NOU
  ])
});

export type CreateChallengeSchemaType = z.infer<typeof CreateChallengeSchema>;

// 👇👇👇 AFEGEIX AIXÒ AL FINAL DEL FITXER 👇👇👇

// Creem l'schema d'Update fent que tot sigui opcional (.partial())
// Això permet enviar només el 'difficultyTier' sense haver d'enviar tot el 'content' de nou, per exemple.
export const UpdateChallengeSchema = CreateChallengeSchema.partial();

export type UpdateChallengeSchemaType = z.infer<typeof UpdateChallengeSchema>;