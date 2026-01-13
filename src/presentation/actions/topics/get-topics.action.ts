// filepath: src/presentation/actions/topics/get-topics.action.ts
'use server';

import { GetActiveTopicsUseCase } from '@/application/use-cases/topics/get-active-topics.use-case';
import { SupabaseTopicRepository } from '@/infrastructure/repositories/supabase/supabase-topic.repository';
import { Topic } from '@/core/entities/topic.entity';

// Definim un tipus de retorn estàndard per a les accions
type ActionResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function getTopicsAction(): Promise<ActionResponse<Topic[]>> {
  try {
    // 1. Instanciem les dependències (Composition Root per request)
    // Nota: Més endavant injectarem el client de Supabase amb cookies aquí.
    const repository = new SupabaseTopicRepository();
    const useCase = new GetActiveTopicsUseCase(repository);

    // 2. Executem el cas d'ús
    const topics = await useCase.execute();

    // 3. Retornem l'èxit
    // Next.js serialitzarà això automàticament
    return { success: true, data: topics };
  } catch (error) {
    console.error('Error fetching topics:', error);
    // 4. Gestió d'errors segura (no enviem stack trace al client)
    return { 
      success: false, 
      error: 'No s\'han pogut carregar els temes. Torna-ho a provar més tard.' 
    };
  }
}