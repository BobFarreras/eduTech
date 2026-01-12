// filepath: src/application/dto/challenge.schema.ts
import { z } from 'zod';

// Validació específica per a QUIZ
const QuizContentSchema = z.object({
  question: z.string().min(5, "La pregunta ha de tenir almenys 5 caràcters"),
  options: z.array(z.string()).length(4, "Un Quiz ha de tenir exactament 4 opcions"),
  correctAnswerIndex: z.number().min(0).max(3),
  explanation: z.string().optional()
});

// Validació específica per a CODE_FIX
const CodeFixContentSchema = z.object({
  description: z.string().min(10),
  initialCode: z.string(),
  solutionCode: z.string(),
  hints: z.array(z.string()).optional(),
  testCases: z.array(z.object({
    input: z.string(),
    expectedOutput: z.string(),
    isHidden: z.boolean().default(false)
  })).optional()
});

// Schema Mestre per a la creació/edició
export const CreateChallengeSchema = z.object({
  topicId: z.string().uuid("Topic ID invàlid"),
  difficultyTier: z.coerce.number().min(1).max(10),
  type: z.enum(['QUIZ', 'CODE_FIX', 'MATCHING', 'TERMINAL', 'BINARY_DECISION', 'LOGIC_ORDER']),
  
  // Discriminated Union manual
  content: z.union([
    QuizContentSchema,
    CodeFixContentSchema,
    // CORRECCIÓ: Especifiquem explícitament que les claus són strings i els valors any
    z.record(z.string(), z.any()) 
  ])
});
// Schema per a Actualització: Tot és opcional perquè potser només vols canviar el títol
// .partial() fa que tots els camps de CreateChallengeSchema siguin opcionals automàticament.
export const UpdateChallengeSchema = CreateChallengeSchema.partial();

export type UpdateChallengeSchemaType = z.infer<typeof UpdateChallengeSchema>;
export type CreateChallengeSchemaType = z.infer<typeof CreateChallengeSchema>;