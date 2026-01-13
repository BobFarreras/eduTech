// filepath: src/application/di/container.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseLeaderboardRepository } from '@/infrastructure/repositories/supabase/supabase-leaderboard.repository';
import { GetGlobalLeaderboardUseCase } from '@/application/use-cases/leaderboard/get-gloabl-leaderboard.use-case';
import { GetUserRankUseCase } from '@/application/use-cases/leaderboard/get-user-rank.use-case'; // <--- Assegura't de tenir l'import
/**
 * Factory per instanciar el UseCase amb les seves dependències.
 * Això ens permet canviar el repositori fàcilment en el futur.
 */
export function createLeaderboardService(client: SupabaseClient) {
  const repository = new SupabaseLeaderboardRepository(client);
  
  const getGlobalLeaderboard = new GetGlobalLeaderboardUseCase(repository);
  const getUserRank = new GetUserRankUseCase(repository);

  // AQUI ERA L'ERROR: Ens faltava afegir getUserRank al return
  return {
    getGlobalLeaderboard,
    getUserRank 
  };
}