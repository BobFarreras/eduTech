// filepath: src/application/dto/level-node.dto.ts

import { ChallengeType } from '@/core/entities/challenges/challenge.entity';
export type LevelStatus = 'LOCKED' | 'ACTIVE' | 'COMPLETED';
export interface LevelNodeDTO {
  tier: number;
  status: LevelStatus;
  totalXp: number;
  label: string;
  // Nous camps visuals
  isCurrentPosition: boolean;
  predominantType: ChallengeType; 
}