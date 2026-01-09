// filepath: src/core/entities/challenge.entity.ts

/**
 * Tipus de reptes suportats pel motor.
 * Coincideix amb l'ENUM de la base de dades.
 */
export type ChallengeType = 'QUIZ' | 'CODE_FIX' | 'TERMINAL' | 'DRAG_DROP';

/**
 * Estructura base per al contingut d'un Quiz.
 */
export interface QuizContent {
  question: string;
  options: string[];
  correctOptionIndex: number; // 0, 1, 2...
  explanation: string;
}

/**
 * Estructura base per a un repte de Codi.
 */
export interface CodeFixContent {
  description: string;
  initialCode: string;
  solutionPattern: string; // Regex o string exacte per validar
  hints: string[];
}

// Unió discriminada per tipar el contingut segons el tipus de repte
export type ChallengeContent = QuizContent | CodeFixContent; 

export interface Challenge {
  id: string;
  topicId: string;
  difficultyTier: number; // 1-10
  type: ChallengeType;
  content: ChallengeContent; // Aquí està la màgia: Tipat fort, no JSON genèric
  createdAt: Date;
}