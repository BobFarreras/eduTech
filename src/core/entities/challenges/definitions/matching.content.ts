// filepath: src/core/entities/challenges/definitions/matching.content.ts
import { ChallengeOption } from './shared';

export interface MatchingContent {
  instruction: string;
  pairs: { 
    left: ChallengeOption; 
    right: ChallengeOption 
  }[];
}