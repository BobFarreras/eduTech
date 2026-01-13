// filepath: src/presentation/actions/admin/challenge.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { assertAdmin } from '@/presentation/utils/auth-guards';

// DTOs i Schemas
import { CreateChallengeSchema, CreateChallengeSchemaType, UpdateChallengeSchema, UpdateChallengeSchemaType } from '@/application/dto/challenge.schema';

// Core & Application
import { SupabaseChallengeRepository } from '@/infrastructure/repositories/supabase/supabase-challenge.repository';
import { CreateChallengeUseCase } from '@/application/use-cases/challenges/create-challenge.use-case';
import { UpdateChallengeUseCase } from '@/application/use-cases/challenges/update-challenge.use-case';
import { DeleteChallengeUseCase } from '@/application/use-cases/challenges/delete-challenge.use-case';

// Tipus de retorn per a la UI
export type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

/**
 * Server Action per CREAR un repte
 */
export async function createChallengeAction(data: CreateChallengeSchemaType): Promise<ActionState> {
  try {
    // 1. Seguretat: Només admins
    await assertAdmin();

    // 2. Validació Zod (Doble check, per si el client es salta la validació JS)
    const validated = CreateChallengeSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: 'Dades invàlides',
        errors: validated.error.flatten().fieldErrors
      };
    }

    // 3. Injecció de Dependències
    const repo = new SupabaseChallengeRepository();
    const useCase = new CreateChallengeUseCase(repo);

    // 4. Execució
    await useCase.execute(validated.data);

    // 5. Neteja de Cache (perquè aparegui al llistat immediatament)
    revalidatePath('/sys-ops/challenges'); 
    revalidatePath('/learn'); // També refresquem la part pública

    return { success: true, message: 'Repte creat correctament' };

  } catch (error) {
    console.error('Create Challenge Error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error desconegut al crear el repte' 
    };
  }
}

/**
 * Server Action per ACTUALITZAR un repte
 */
export async function updateChallengeAction(id: string, data: UpdateChallengeSchemaType): Promise<ActionState> {
  try {
    await assertAdmin();

    const validated = UpdateChallengeSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: 'Dades invàlides',
        errors: validated.error.flatten().fieldErrors
      };
    }

    const repo = new SupabaseChallengeRepository();
    const useCase = new UpdateChallengeUseCase(repo);

    await useCase.execute(id, validated.data);

    revalidatePath('/sys-ops/challenges');
    revalidatePath('/learn');

    return { success: true, message: 'Repte actualitzat correctament' };

  } catch (error) {
    console.error('Update Challenge Error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al actualitzar' 
    };
  }
}

/**
 * Server Action per ELIMINAR un repte
 */
export async function deleteChallengeAction(id: string): Promise<ActionState> {
  try {
    await assertAdmin();

    if (!id) return { success: false, message: 'ID obligatori' };

    const repo = new SupabaseChallengeRepository();
    const useCase = new DeleteChallengeUseCase(repo);

    await useCase.execute(id);

    revalidatePath('/sys-ops/challenges');
    
    return { success: true, message: 'Repte eliminat' };

  } catch (error) {
    console.error('Delete Challenge Error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al eliminar' 
    };
  }
}