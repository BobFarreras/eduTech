// 1. IMPORTEM I RE-EXPORTEM (Barrel Pattern)
// Això permet fer: import { TerminalContent } from './challenge.entity'
export * from './definitions/quiz.content';
export * from './definitions/code-fix.content';
export * from './definitions/matching.content';
export * from './definitions/terminal.content'; // ✅ Això soluciona el teu error
export * from './definitions/logic-order.content';
export * from './definitions/binary.content';
export * from './definitions/theory.content';
export * from './definitions/ctf.content';

// Importem localment per definir el tipus de la unió
import { QuizContent } from './definitions/quiz.content';
import { CodeFixContent } from './definitions/code-fix.content';
import { MatchingContent } from './definitions/matching.content';
import { TerminalContent } from './definitions/terminal.content';
import { LogicOrderContent } from './definitions/logic-order.content';
import { BinaryContent } from './definitions/binary.content';
import { TheoryContent } from './definitions/theory.content';
import { CtfContent } from './definitions/ctf.content';

export type ChallengeType = 
  | 'THEORY' 
  | 'QUIZ' 
  | 'CODE_FIX' 
  | 'MATCHING' 
  | 'TERMINAL' 
  | 'BINARY_DECISION'
  | 'CTF'
  | 'LOGIC_ORDER';

export type ChallengeContent = 
  | QuizContent 
  | CodeFixContent 
  | MatchingContent
  | TerminalContent 
  | LogicOrderContent
  | BinaryContent
  | TheoryContent
  | CtfContent;

export interface Challenge {
  id: string;
  topicId: string;
  difficultyTier: number;
  type: ChallengeType;
  content: ChallengeContent;
  createdAt: Date;
}