// filepath: src/presentation/actions/challenges/get-next-challenge.action.ts
'use server';

import { GetNextChallengeUseCase } from '@/application/use-cases/challenges/get-next-challenge.use-case';
import { SupabaseTopicRepository } from '@/infrastructure/repositories/supabase/topic.repository';
import { SupabaseChallengeRepository } from '@/infrastructure/repositories/supabase/challenge.repository';
import { Challenge } from '@/core/entities/challenge.entity';
import { getLocale } from 'next-intl/server'; // <--- IMPORTANT

type ActionResponse = 
  | { success: true; data: Challenge[] } 
  | { success: false; error: string };

export async function getNextChallengeAction(topicSlug: string): Promise<ActionResponse> {
  try {
    const locale = await getLocale(); // Obtenim idioma actual
    
    const topicRepo = new SupabaseTopicRepository();
    const challengeRepo = new SupabaseChallengeRepository();
    const useCase = new GetNextChallengeUseCase(topicRepo, challengeRepo);

    // TODO: Obtenir l'ID real de l'usuari amb supabase.auth.getUser()
    const userId = 'demo-user-id'; 

    // Passem el locale al Use Case
    const challenges = await useCase.execute(topicSlug, userId, locale); 

    return { success: true, data: challenges };
  } catch (error) {
    console.error('Error getting challenge:', error);
    return { 
      success: false, 
      error: 'No s\'ha pogut carregar el repte.' 
    };
  }
}