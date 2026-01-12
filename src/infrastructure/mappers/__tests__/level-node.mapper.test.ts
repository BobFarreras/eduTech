// filepath: src/infrastructure/mappers/__tests__/level-node.mapper.test.ts
import { describe, it, expect } from 'vitest';
import { LevelNodeMapper } from '../level-node.mapper';
import { TierProgressStats } from '@/core/repositories/topic.repository';
import { ChallengeType } from '@/core/entities/challenges/challenge.entity';

describe('LevelNodeMapper', () => {
  const mockStat: TierProgressStats = {
    tier: 1,
    totalChallenges: 10,
    completedChallenges: 0,
    mostCommonType: 'QUIZ' as ChallengeType
  };

  it('hauria de marcar status LOCKED si no és playable i no completat', () => {
    const dto = LevelNodeMapper.toDTO(mockStat, 5, false); // currentTier lluny, isNextPlayable false
    expect(dto.status).toBe('LOCKED');
  });

  it('hauria de marcar status ACTIVE si isNextPlayable és true', () => {
    const dto = LevelNodeMapper.toDTO(mockStat, 1, true);
    expect(dto.status).toBe('ACTIVE');
  });

 it('hauria de detectar un BOSS al Tier 10 (Junior)', () => {
    // ARRANGE: Creem un stat pel tier 10
    const bossStat = { ...mockStat, tier: 10 }; 
    
    // ACT
    const dto = LevelNodeMapper.toDTO(bossStat, 10, true);
    
    // ASSERT
    expect(dto.isBoss).toBe(true);
    expect(dto.bossTitleKey).toBe("milestones.junior"); // Verifiquem la CLAU, no el text
    expect(dto.bossIconName).toBe("medal");
    expect(dto.bossColorClass).toContain("bg-blue-500");
  });

  it('hauria de detectar un BOSS al Tier 20 (Senior)', () => {
    const bossStat = { ...mockStat, tier: 20 };
    const dto = LevelNodeMapper.toDTO(bossStat, 20, true);
    
    expect(dto.isBoss).toBe(true);
    expect(dto.bossTitleKey).toBe("milestones.senior");
    expect(dto.bossIconName).toBe("trophy");
  });

  it('NO hauria de detectar Boss al Tier 5 (antic boss)', () => {
    const normalStat = { ...mockStat, tier: 5 };
    const dto = LevelNodeMapper.toDTO(normalStat, 5, true);
    expect(dto.isBoss).toBe(false);
  });
});