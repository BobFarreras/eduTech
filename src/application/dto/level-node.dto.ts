// filepath: src/application/dto/level-node.dto.ts
import { ChallengeType } from '@/core/entities/challenges/challenge.entity';

export type LevelStatus = 'LOCKED' | 'ACTIVE' | 'COMPLETED';

export interface LevelNodeDTO {
  tier: number;
  status: LevelStatus;
  label: string;
  
  // Stats
  totalChallenges: number;
  completedChallenges: number;
  
  // Visuals
  isCurrentPosition: boolean;
  predominantType: ChallengeType;
  
  // --- BOSS & MILESTONES ---
  isBoss: boolean;
  bossTitleKey?: string; // 👈 Canviat a Key
  bossColorClass?: string;
  bossIconName?: string; // 👈 Nou camp per la icona
}