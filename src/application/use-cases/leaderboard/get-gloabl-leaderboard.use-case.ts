// filepath: src/application/use-cases/get-global-leaderboard.use-case.ts
import { ILeaderboardRepository } from '../../../core/repositories/leaderboard.repository';
import { LeaderboardEntry } from '../../../core/entities/leaderboard.entity';

export class GetGlobalLeaderboardUseCase {
  // Injectem la interfície, NO la implementació concreta de Supabase
  constructor(private leaderboardRepository: ILeaderboardRepository) {}

  /**
   * Executa la lògica per obtenir el rànquing.
   * Apliquem regles de negoci aquí (ex: validacions de límits).
   */
  async execute(limit: number = 10, offset: number = 0): Promise<LeaderboardEntry[]> {
    // 1. Validació (Guard Clause)
    if (limit < 1 || limit > 100) {
      throw new Error("El límit ha d'estar entre 1 i 100.");
    }

    // 2. Delegar al repositori
    return this.leaderboardRepository.getTopGlobal(limit, offset);
  }
}