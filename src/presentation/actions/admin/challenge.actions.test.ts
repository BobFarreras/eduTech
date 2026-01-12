// filepath: src/presentation/actions/admin/challenge.actions.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createChallengeAction, deleteChallengeAction } from './challenge.actions';
import { CreateChallengeSchemaType } from '@/application/dto/challenge.schema';

// 1. HOISTING
const mocks = vi.hoisted(() => ({
  executeCreate: vi.fn(),
  executeDelete: vi.fn(),
  assertAdmin: vi.fn(),
  revalidatePath: vi.fn(),
}));

// 2. Mocks
vi.mock('@/presentation/utils/auth-guards', () => ({
  assertAdmin: mocks.assertAdmin
}));

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

vi.mock('@/infrastructure/repositories/supabase/challenge.repository', () => ({
  SupabaseChallengeRepository: vi.fn()
}));

vi.mock('next/cache', () => ({
  revalidatePath: mocks.revalidatePath
}));

describe('Server Actions: Challenge Admin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createChallengeAction', () => {
    it('hauria de retornar error si les dades Zod són invàlides', async () => {
      const invalidInput = { 
        topicId: 'bad-uuid', // UUID invàlid
        difficultyTier: 99 
      } as unknown as CreateChallengeSchemaType;

      const result = await createChallengeAction(invalidInput);

      expect(result.success).toBe(false);
      expect(result.message).toBeDefined(); 
      expect(mocks.executeCreate).not.toHaveBeenCalled();
    });

    it('hauria de cridar al UseCase i retornar success si tot és correcte', async () => {
      // FIX: Dades correctes segons l'esquema multilingüe
      const validInput: CreateChallengeSchemaType = {
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        difficultyTier: 1,
        type: 'QUIZ',
        content: {
          question: { ca: 'Pregunta', es: 'Pregunta', en: 'Question' },
          explanation: { ca: 'Exp', es: 'Exp', en: 'Exp' },
          options: [
            { id: '1', text: { ca: 'A', es: 'A', en: 'A' } },
            { id: '2', text: { ca: 'B', es: 'B', en: 'B' } },
            { id: '3', text: { ca: 'C', es: 'C', en: 'C' } },
            { id: '4', text: { ca: 'D', es: 'D', en: 'D' } }
          ],
          correctOptionIndex: 0
        }
      };

      mocks.executeCreate.mockResolvedValue({ id: 'new-id', ...validInput });

      const result = await createChallengeAction(validInput);

      expect(result.success).toBe(true);
      expect(mocks.executeCreate).toHaveBeenCalled();
    });
  });

  describe('deleteChallengeAction', () => {
    it('hauria de gestionar errors si el UseCase falla', async () => {
      mocks.executeDelete.mockRejectedValue(new Error('DB Error'));
      const result = await deleteChallengeAction('some-id');
      expect(result.success).toBe(false);
    });
  });
});