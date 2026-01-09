// filepath: src/presentation/actions/challenges/get-next-challenge.action.ts
'use server';

import { GetNextChallengeUseCase } from '@/application/use-cases/challenges/get-next-challenge.use-case';
import { SupabaseTopicRepository } from '@/infrastructure/repositories/supabase/topic.repository';
import { SupabaseChallengeRepository } from '@/infrastructure/repositories/supabase/challenge.repository';
import { Challenge } from '@/core/entities/challenge.entity';

// CORRECCIÓ AQUÍ: data és Challenge[] (Array)
type ActionResponse = 
  | { success: true; data: Challenge[] } 
  | { success: false; error: string };

export async function getNextChallengeAction(topicSlug: string): Promise<ActionResponse> {
  try {
    const topicRepo = new SupabaseTopicRepository();
    const challengeRepo = new SupabaseChallengeRepository();
    const useCase = new GetNextChallengeUseCase(topicRepo, challengeRepo);

    const userId = 'demo-user-id'; 
    const challenges = await useCase.execute(topicSlug, userId); // Això ara retorna array

    return { success: true, data: challenges };
  } catch (error) {
    console.error('Error getting challenge:', error);
    return { 
      success: false, 
      error: 'No s\'ha pogut carregar el repte.' 
    };
  }
}