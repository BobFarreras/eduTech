// filepath: src/presentation/actions/gamification/submit-session.action.ts
'use server';

import { CompleteSessionUseCase, SessionResult } from '@/application/use-cases/gamification/complete-session.use-case';
import { SupabaseUserRepository } from '@/infrastructure/repositories/supabase/user.repository';

// IMPORTANT: Aquest ID ha de coincidir amb el que vam fer a l'INSERT SQL
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

type ActionResponse = 
  | { success: true; data: SessionResult }
  | { success: false; error: string };

export async function submitSessionAction(challengeIds: string[], topicId: string): Promise<ActionResponse> {
  try {
    // Pattern: Composition Root (Instanciem tot l'arbre de dependències aquí)
    const userRepo = new SupabaseUserRepository();
    const useCase = new CompleteSessionUseCase(userRepo);

    const result = await useCase.execute(DEMO_USER_ID, challengeIds, topicId);

    // Revalidar paths si calgués (revalidatePath)
    return { success: true, data: result };
  } catch (error) {
    console.error('Error submitting session:', error);
    return { success: false, error: 'Failed to save progress' };
  }
}