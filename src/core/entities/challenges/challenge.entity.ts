// filepath: src/core/entities/challenges/challenge.entity.ts
import { QuizContent } from './definitions/quiz.content';
import { CodeFixContent } from './definitions/code-fix.content';
import { MatchingContent } from './definitions/matching.content';
import { TerminalContent } from './definitions/terminal.content';
import { LogicOrderContent } from './definitions/logic-order.content';
import { BinaryContent } from './definitions/binary.content';
// 1. IMPORTEM EL NOU TIPUS
import { TheoryContent } from './definitions/theory.content';
import { CtfContent } from './definitions/ctf.content'; // 👈 IMPORTAR
export type ChallengeType = 
  | 'THEORY' // Assegura't que està aquí
  | 'QUIZ' 
  | 'CODE_FIX' 
  | 'MATCHING' 
  | 'TERMINAL' 
  | 'BINARY_DECISION'
  | 'CTF' // 👈 AFEGIR
  | 'LOGIC_ORDER';

export type ChallengeContent = 
  | QuizContent 
  | CodeFixContent 
  | MatchingContent
  | TerminalContent 
  | LogicOrderContent
  | BinaryContent
  | TheoryContent // 2. L'AFEGIM AQUI
  | CtfContent; // 👈 AFEGIR

export interface Challenge {
  id: string;
  topicId: string;
  difficultyTier: number;
  type: ChallengeType;
  content: ChallengeContent;
  createdAt: Date;
}