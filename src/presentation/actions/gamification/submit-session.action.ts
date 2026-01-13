// filepath: src/presentation/actions/gamification/submit-session.action.ts
'use server';

import { CompleteSessionUseCase, SessionResult } from '@/application/use-cases/gamification/complete-session.use-case';
import { SupabaseUserRepository } from '@/infrastructure/repositories/supabase/supabase-user.repository';
import { createClient } from '@/infrastructure/utils/supabase/server'; // <--- Nou import

type ActionResponse = 
  | { success: true; data: SessionResult }
  | { success: false; error: string };

export async function submitSessionAction(challengeIds: string[], topicId: string): Promise<ActionResponse> {
  try {
    // 1. Obtenim l'usuari real de la sessió
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized: Please login first' };
    }

    // 2. Ja tenim l'ID real!
    const userId = user.id;

    // 3. Executem el cas d'ús
    const userRepo = new SupabaseUserRepository();
    const useCase = new CompleteSessionUseCase(userRepo);

    const result = await useCase.execute(userId, challengeIds, topicId);

    return { success: true, data: result };
  } catch (error) {
    console.error('Error submitting session:', error);
    return { success: false, error: 'Failed to save progress' };
  }
}