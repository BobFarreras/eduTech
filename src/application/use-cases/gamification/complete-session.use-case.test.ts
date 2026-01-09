// filepath: src/application/use-cases/gamification/complete-session.use-case.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CompleteSessionUseCase } from './complete-session.use-case';
import { IUserRepository, UserProfile } from '@/core/repositories/user.repository';

// Mock del Repositori
const mockUserRepo = {
  findById: vi.fn(),
  saveProgress: vi.fn(),
  updateXp: vi.fn(),
} as unknown as IUserRepository;

describe('CompleteSessionUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate XP, save progress and level up user', async () => {
    // ARRANGE (Preparem l'escenari)
    const userId = 'user-123';
    const challengeIds = ['c1', 'c2', 'c3']; // 3 reptes fets
    const topicId = 'topic-react';
    
    // Simulem un usuari que té 90 XP (i pujarà de nivell aviat)
    const mockUser: UserProfile = { 
      id: userId, 
      totalXp: 90, 
      level: 1 
    };

    vi.mocked(mockUserRepo.findById).mockResolvedValue(mockUser);

    const useCase = new CompleteSessionUseCase(mockUserRepo);

    // ACT (Executem)
    const result = await useCase.execute(userId, challengeIds, topicId);

    // ASSERT (Verifiquem)
    
    // 1. Ha de guanyar 30 XP (3 reptes * 10 XP)
    expect(result.xpEarned).toBe(30);
    
    // 2. XP Total: 90 + 30 = 120
    expect(result.newTotalXp).toBe(120);
    
    // 3. Com que supera els 100 XP, ha de ser Nivell 2
    expect(result.newLevel).toBe(2); 
    expect(result.leveledUp).toBe(true);

    // 4. Verifiquem que s'ha cridat al repositori per guardar
    expect(mockUserRepo.saveProgress).toHaveBeenCalledWith(userId, challengeIds, topicId, 10);
    expect(mockUserRepo.updateXp).toHaveBeenCalledWith(userId, 120, 2);
  });
});