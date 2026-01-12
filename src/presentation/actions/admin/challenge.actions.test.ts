// filepath: src/presentation/actions/admin/challenge.actions.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createChallengeAction, deleteChallengeAction } from './challenge.actions';
import { CreateChallengeSchemaType } from '@/application/dto/challenge.schema';

// 1. HOISTING: Creem els spies ABANS que s'executin els mocks
// Això garanteix que les referències existeixin quan Vitest faci el "hoist" dels vi.mock
const mocks = vi.hoisted(() => ({
  executeCreate: vi.fn(),
  executeDelete: vi.fn(),
  assertAdmin: vi.fn(),
  revalidatePath: vi.fn(),
}));

// 2. Mockejem el guardià d'auth
vi.mock('@/presentation/utils/auth-guards', () => ({
  assertAdmin: mocks.assertAdmin
}));

// 3. Mockejem els Use Cases (Capa Application)
// FIX CRÍTIC: Usem 'function' estàndard perquè pugui ser cridada amb 'new'
vi.mock('@/application/use-cases/challenges/create-challenge.use-case', () => ({
  CreateChallengeUseCase: vi.fn().mockImplementation(function () {
    return { execute: mocks.executeCreate };
  })
}));

vi.mock('@/application/use-cases/challenges/delete-challenge.use-case', () => ({
  DeleteChallengeUseCase: vi.fn().mockImplementation(function () {
    return { execute: mocks.executeDelete };
  })
}));

// 4. Mockejem la Infraestructura
vi.mock('@/infrastructure/repositories/supabase/challenge.repository', () => ({
  SupabaseChallengeRepository: vi.fn()
}));

// 5. Mockejem Next.js cache
vi.mock('next/cache', () => ({
  revalidatePath: mocks.revalidatePath
}));

describe('Server Actions: Challenge Admin', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createChallengeAction', () => {
    it('hauria de retornar error si les dades Zod són invàlides', async () => {
      // Passem dades invàlides controlades
      const invalidInput = { 
        topicId: 'bad-uuid', 
        difficultyTier: 99 
      } as unknown as CreateChallengeSchemaType;

      const result = await createChallengeAction(invalidInput);

      expect(result.success).toBe(false);
      expect(result.message).toBeDefined(); 
      expect(mocks.executeCreate).not.toHaveBeenCalled();
    });

    it('hauria de cridar al UseCase i retornar success si tot és correcte', async () => {
      const validInput: CreateChallengeSchemaType = {
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        difficultyTier: 1,
        type: 'QUIZ',
        content: {
          question: 'Test Q',
          options: ['A', 'B', 'C', 'D'],
          correctAnswerIndex: 0
        }
      };

      // Configurem el comportament per aquest test
      mocks.executeCreate.mockResolvedValue({ id: 'new-id', ...validInput });

      const result = await createChallengeAction(validInput);

      expect(result.success).toBe(true);
      expect(mocks.executeCreate).toHaveBeenCalledWith(expect.objectContaining({
        topicId: validInput.topicId,
        type: 'QUIZ'
      }));
      // Verifiquem que revalida el path (important per UX)
      expect(mocks.revalidatePath).toHaveBeenCalled(); 
    });
  });

  describe('deleteChallengeAction', () => {
    it('hauria de gestionar errors si el UseCase falla', async () => {
      const errorMessage = 'DB Error';
      mocks.executeDelete.mockRejectedValue(new Error(errorMessage));

      const result = await deleteChallengeAction('some-id');

      expect(result.success).toBe(false);
      expect(result.message).toBe(errorMessage);
    });
    
    it('hauria de funcionar correctament quan s\'elimina', async () => {
        mocks.executeDelete.mockResolvedValue(void 0);

        const result = await deleteChallengeAction('valid-id');

        expect(result.success).toBe(true);
        expect(mocks.executeDelete).toHaveBeenCalledWith('valid-id');
        expect(mocks.revalidatePath).toHaveBeenCalled();
    });
  });
});