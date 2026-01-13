// filepath: src/application/use-cases/get-global-leaderboard.use-case.test.ts
import { describe, it, expect } from 'vitest';
import { GetGlobalLeaderboardUseCase } from './get-gloabl-leaderboard.use-case'; // Encara no existeix
import { ILeaderboardRepository } from '../../../core/repositories/leaderboard.repository';
import { LeaderboardEntry } from '../../../core/entities/leaderboard.entity';

// 1. MOCK: Creem un "Repositori Fals" per enganyar el Use Case
// Això ens permet provar la lògica sense tocar la BD real.
class MockLeaderboardRepository implements ILeaderboardRepository {
  async getTopGlobal(limit: number): Promise<LeaderboardEntry[]> {
    const mockData: LeaderboardEntry[] = [
      { userId: 'u1', username: 'ProUser', xp: 5000, level: 5, rank: 1, isCurrentUser: false },
      { userId: 'u2', username: 'Newbie', xp: 100, level: 1, rank: 2, isCurrentUser: true },
    ];
    return mockData.slice(0, limit);
  }

  async getUserRank(userId: string): Promise<LeaderboardEntry | null> {
    return null; // No el necessitem per aquest test
  }
}

// 2. TEST SUITE
describe('GetGlobalLeaderboardUseCase', () => {
  it('hauria de retornar una llista d\'usuaris ordenada', async () => {
    // ARRANGE (Preparar)
    const mockRepo = new MockLeaderboardRepository();
    const useCase = new GetGlobalLeaderboardUseCase(mockRepo);

    // ACT (Executar)
    const result = await useCase.execute(10);

    // ASSERT (Verificar)
    expect(result).toHaveLength(2);
    expect(result[0].username).toBe('ProUser');
    expect(result[0].xp).toBe(5000);
  });

  it('hauria de limitar els resultats segons el paràmetre', async () => {
    const mockRepo = new MockLeaderboardRepository();
    const useCase = new GetGlobalLeaderboardUseCase(mockRepo);

    const result = await useCase.execute(1); // Demanem només 1

    expect(result).toHaveLength(1);
  });
});