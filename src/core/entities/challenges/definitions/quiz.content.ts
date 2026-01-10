// filepath: src/core/entities/challenges/definitions/quiz.content.ts
import { ChallengeOption } from './shared';

export interface QuizContent {
  question: string;
  explanation: string;
  options: ChallengeOption[]; 
  correctOptionIndex: number;
}