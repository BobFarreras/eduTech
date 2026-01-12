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
      { tier: 8, totalChallenges: 5, completedChallenges: 5, mostCommonType: 'TUTORIAL' }, // Complet
      { tier: 9, totalChallenges: 5, completedChallenges: 2, mostCommonType: 'CODE' },     // En progrés (Active)
      { tier: 10, totalChallenges: 10, completedChallenges: 0, mostCommonType: 'QUIZ' }    // Futur (Locked & BOSS)
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

    // Nivell 10: Bloquejat i és BOSS (segons la nova config)
    expect(levels[2].tier).toBe(10);
    expect(levels[2].status).toBe('LOCKED');
    expect(levels[2].isBoss).toBe(true); // ✅ Ara passarà perquè Tier 10 està al config
    expect(levels[2].bossTitleKey).toBeDefined(); // Opcional: verifiquem que té clau de traducció
    
    // XP Calculation check
    // (5 completats al tier 8 * 10xp) + (2 completats al tier 9 * 10xp) = 50 + 20 = 70
    expect(totalXp).toBe(70); 
  });
});