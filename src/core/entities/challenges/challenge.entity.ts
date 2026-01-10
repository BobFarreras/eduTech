// filepath: src/core/entities/challenges/challenge.entity.ts
import { QuizContent } from './definitions/quiz.content';
import { CodeFixContent } from './definitions/code-fix.content';
import { MatchingContent } from './definitions/matching.content';
import { TerminalContent } from './definitions/terminal.content';
import { LogicOrderContent } from './definitions/logic-order.content';

// 1. Tipus de Repte (Enum strings)
export type ChallengeType = 
  | 'QUIZ' 
  | 'CODE_FIX' 
  | 'MATCHING' 
  | 'TERMINAL' 
  | 'LOGIC_ORDER';

// 2. Unió Discriminada (Polimorfisme)
export type ChallengeContent = 
  | QuizContent 
  | CodeFixContent 
  | MatchingContent
  | TerminalContent 
  | LogicOrderContent;

// 3. Entitat de Domini
export interface Challenge {
  id: string;
  topicId: string;
  difficultyTier: number;
  type: ChallengeType;
  content: ChallengeContent;
  createdAt: Date;
}