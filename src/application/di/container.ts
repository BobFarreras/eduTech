// filepath: src/application/di/container.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseLeaderboardRepository } from '@/infrastructure/repositories/supabase/supabase-leaderboard.repository';
import { GetGlobalLeaderboardUseCase } from '@/application/use-cases/leaderboard/get-gloabl-leaderboard.use-case';
import { GetUserRankUseCase } from '@/application/use-cases/leaderboard/get-user-rank.use-case'; // <--- Assegura't de tenir 
import { SupabaseProfileRepository } from '@/infrastructure/repositories/supabase/supabase-profile.repository';
import { GetUserProfileUseCase } from '@/application/use-cases/profile/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from '@/application/use-cases/profile/update-user-profile.use-case';

/**
 * Factory per instanciar el UseCase amb les seves dependències.
 * Això ens permet canviar el repositori fàcilment en el futur.
 */
export function createLeaderboardService(client: SupabaseClient) {
  const repository = new SupabaseLeaderboardRepository(client);
  
  return {
    getGlobalLeaderboard: new GetGlobalLeaderboardUseCase(repository),
    getUserRank: new GetUserRankUseCase(repository)
  };
}

export function createProfileService(client: SupabaseClient) {
  const repository = new SupabaseProfileRepository(client);
  
  return {
    getUserProfile: new GetUserProfileUseCase(repository),
    updateUserProfile: new UpdateUserProfileUseCase(repository),
  };
}