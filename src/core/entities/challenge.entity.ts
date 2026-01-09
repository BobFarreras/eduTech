// filepath: src/core/entities/challenge.entity.ts

// 1. Definim tots els tipus de joc que suportarà el sistema
export type ChallengeType = 'QUIZ' | 'CODE_FIX' | 'MATCHING' | 'TERMINAL';

// --- COMPONENTS REUTILITZABLES ---

export interface ChallengeOption {
  id: string;
  text: string;
}

// --- CONTINGUTS ESPECÍFICS PER A CADA JOC ---

// A. Tipus Test (El que ja tens)
export interface QuizContent {
  question: string;
  explanation: string;
  options: ChallengeOption[]; 
  correctOptionIndex: number;
}
export interface CodeFixOption {
  id: string;
  code: string;     // El text que es mostrarà a la carta (ex: "useState")
  isCorrect: boolean;
}
// B. Tipus "Arregla el Codi" (El teu, molt potent)
export interface CodeFixContent {
  description: string;
  initialCode: string;
  solution: string; // La solució correcta (per validar o mostrar)
  hint: string; // 👈 Cambiat de 'hints?: string[]' a 'hint: string'
  tests: { input: string; output: string }[]; // Casos de prova per validar l'execució
  options: CodeFixOption[]; // Les 3 opcions
}

// C. Tipus "Relacionar Conceptes" (Nou requisit: sinònims, conceptes)
export interface MatchingContent {
  instruction: string; // Ex: "Relaciona cada hook amb la seva funció"
  pairs: { 
    left: ChallengeOption; 
    right: ChallengeOption 
  }[];
}

// --- UNION TYPE (POLIMORFISME) ---
// Això permet que TypeScript sàpiga automàticament quins camps tens
// si comproves el 'type'.
export type ChallengeContent = 
  | QuizContent 
  | CodeFixContent 
  | MatchingContent;
  // | TerminalContent (Futur)

// --- ENTITAT PRINCIPAL ---
export interface Challenge {
  id: string;
  topicId: string;
  difficultyTier: number;
  type: ChallengeType;       // El discriminador
  content: ChallengeContent; // Contingut dinàmic
  createdAt: Date;
}