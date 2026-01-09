// filepath: src/core/entities/challenge.entity.ts

export type ChallengeType = 'QUIZ' | 'CODE_FIX' | 'TERMINAL';

// 1. Definim l'estructura d'una opció
export interface ChallengeOption {
  id: string;
  text: string;
}

// 2. Actualitzem el QuizContent
export interface QuizContent {
  question: string;
  explanation: string;
  options: ChallengeOption[]; // <--- ABANS ERA string[], ARA ÉS EL NOSTRE OBJECTE
  correctOptionIndex: number;
}

// (Altres tipus poden quedar igual o adaptar-se)
export interface CodeFixContent {
  description: string;
  initialCode: string;
  solution: string;
  tests: { input: string; output: string }[];
}

// Union Type per al contingut
export type ChallengeContent = QuizContent | CodeFixContent; // | TerminalContent...

export interface Challenge {
  id: string;
  topicId: string;
  difficultyTier: number;
  type: ChallengeType;
  content: ChallengeContent;
  createdAt: Date;
}