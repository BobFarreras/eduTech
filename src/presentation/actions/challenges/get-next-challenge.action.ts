// filepath: src/presentation/actions/challenges/get-next-challenge.action.ts
'use server';

import { GetNextChallengeUseCase } from '@/application/use-cases/challenges/get-next-challenge.use-case';
import { SupabaseTopicRepository } from '@/infrastructure/repositories/supabase/supabase-topic.repository';
import { SupabaseChallengeRepository } from '@/infrastructure/repositories/supabase/supabase-challenge.repository';
import { Challenge } from '@/core/entities/challenges/challenge.entity';
import { getLocale } from 'next-intl/server';
import { createClient } from '@/infrastructure/utils/supabase/server'; // <--- Necessari per user real

type ActionResponse = 
  | { success: true; data: Challenge[] } 
  | { success: false; error: string };

// 1. AFEGIM EL PARÀMETRE difficulty AMB VALOR PER DEFECTE
export async function getNextChallengeAction(topicSlug: string, difficulty: number = 1): Promise<ActionResponse> {
  console.log(`🚀 [ACTION] Rebuda petició: Slug="${topicSlug}", Tier=${difficulty}`);
  
  try {
    const locale = await getLocale();
    const supabase = await createClient(); 

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.warn('⛔ [ACTION] Usuari no autenticat');
        return { success: false, error: 'Has d\'iniciar sessió per jugar.' };
    }

    const topicRepo = new SupabaseTopicRepository();
    // Afegim log per veure si troba el tema
    const topic = await topicRepo.findBySlug(topicSlug);
    if (!topic) {
        console.error(`❌ [ACTION] Tema no trobat pel slug: ${topicSlug}`);
        return { success: false, error: 'Tema no trobat' };
    }
    console.log(`✅ [ACTION] Tema trobat: ID=${topic.id}`);

    const challengeRepo = new SupabaseChallengeRepository();
    
    // NOTA: Ara cridem directament al repo aquí per saltar-nos el UseCase en el debug, 
    // o bé deixem el UseCase però sabent que el log està dins del repo.
    // Mantenim l'estructura neta cridant al UseCase:
    
    const useCase = new GetNextChallengeUseCase(topicRepo, challengeRepo);
    const challenges = await useCase.execute(topicSlug, user.id, locale, difficulty); 

    console.log(`🏁 [ACTION] Retornant ${challenges.length} reptes al client.`);
    return { success: true, data: challenges };

  } catch (error) {
    console.error('❌ [ACTION] Exception:', error);
    return { 
      success: false, 
      error: 'No s\'ha pogut carregar el repte.' 
    };
  }
}