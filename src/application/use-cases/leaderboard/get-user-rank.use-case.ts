// filepath: src/application/use-cases/get-user-rank.use-case.ts
import { ILeaderboardRepository } from '../../../core/repositories/leaderboard.repository';
import { LeaderboardEntry } from '../../../core/entities/leaderboard.entity';

export class GetUserRankUseCase {
  constructor(private leaderboardRepository: ILeaderboardRepository) {}

  async execute(userId: string): Promise<LeaderboardEntry | null> {
    if (!userId) throw new Error("User ID is required");
    return this.leaderboardRepository.getUserRank(userId);
  }
}