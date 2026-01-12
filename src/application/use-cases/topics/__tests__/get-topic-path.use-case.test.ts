// filepath: src/application/use-cases/topics/__tests__/get-topic-path.use-case.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetTopicPathUseCase } from '../get-topic-path.use-case';
import { ITopicRepository } from '@/core/repositories/topic.repository';

// Mock del Repositori
const mockTopicRepo = {
  getTopicProgressSummary: vi.fn(),
} as unknown as ITopicRepository;

describe('GetTopicPathUseCase', () => {
  let useCase: GetTopicPathUseCase;

  beforeEach(() => {
    useCase = new GetTopicPathUseCase(mockTopicRepo);
    vi.clearAllMocks();
  });

  it('hauria de generar una llista de nivells i detectar el BOSS al Tier 10', async () => {
    // ARRANGE: Simulem una seqüència a punt d'arribar al primer Boss (Tier 10)
    mockTopicRepo.getTopicProgressSummary = vi.fn().mockResolvedValue([
      { tier: 8, totalChallenges: 5, completedChallenges: 5, mostCommonType: 'TUTORIAL', mapConfig: null },
      { tier: 9, totalChallenges: 5, completedChallenges: 2, mostCommonType: 'CODE', mapConfig: null },
      
      // ✅ FIX: Afegim mapConfig al Tier 10
      { 
        tier: 10, 
        totalChallenges: 10, 
        completedChallenges: 0, 
        mostCommonType: 'QUIZ',
        mapConfig: {
           isBoss: true,
           bossTitle: "milestones.junior",
           bossIcon: "medal",
           bossColor: "bg-blue-500"
        }
      } 
    ]);

    // ACT
    const { levels, totalXp } = await useCase.execute('user-123', 'topic-abc');

    // ASSERT
    expect(levels).toHaveLength(3);
    
    // Nivell 8: Completat
    expect(levels[0].tier).toBe(8);
    expect(levels[0].status).toBe('COMPLETED');

    // Nivell 9: Actiu (Current Position)
    expect(levels[1].tier).toBe(9);
    expect(levels[1].status).toBe('ACTIVE');
    expect(levels[1].isCurrentPosition).toBe(true);

    // Nivell 10: Bloquejat i és BOSS (ara sí!)
    expect(levels[2].tier).toBe(10);
    expect(levels[2].status).toBe('LOCKED');
    expect(levels[2].isBoss).toBe(true); 
    expect(levels[2].bossTitleKey).toBeDefined();
    
    // XP Calculation check
    expect(totalXp).toBe(70); 
  });
});