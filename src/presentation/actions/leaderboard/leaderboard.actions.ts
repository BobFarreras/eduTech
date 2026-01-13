// filepath: src/presentation/actions/leaderboard.actions.ts
'use server';

import { createClient } from '@/infrastructure/utils/supabase/server';
import { createLeaderboardService } from '@/application/di/container';
import { z } from 'zod';

const leaderboardSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
});

export async function getLeaderboardAction(input: z.infer<typeof leaderboardSchema>) {
  try {
    const { limit, offset } = leaderboardSchema.parse(input);

    // CORRECCIÓ: Afegim 'await'
    const supabase = await createClient();
    
    const { getGlobalLeaderboard } = createLeaderboardService(supabase);

    const data = await getGlobalLeaderboard.execute(limit, offset);

    return { success: true, data };
  } catch (error) {
    console.error('Error in getLeaderboardAction:', error);
    return { success: false, error: 'Failed to load leaderboard' };
  }
}