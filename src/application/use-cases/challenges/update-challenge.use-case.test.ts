// filepath: src/application/use-cases/challenges/update-challenge.use-case.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateChallengeUseCase } from './update-challenge.use-case';
import { IChallengeRepository } from '@/core/repositories/challenge.repository';
import { UpdateChallengeSchemaType } from '@/application/dto/challenge.schema';

describe('UpdateChallengeUseCase', () => {
  let useCase: UpdateChallengeUseCase;
  let mockChallengeRepo: IChallengeRepository;

  // Dades de prova (Parcials)
  const challengeId = 'existing-uuid';
  const updateInput: UpdateChallengeSchemaType = {
    difficultyTier: 5,
    // Només actualitzem la dificultat, la resta undefined
  };

  beforeEach(() => {
    // 1. Mockejem el Repositori
    mockChallengeRepo = {
      findNextForUser: vi.fn(),
      findByTopicId: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      // Simulem que l'update retorna l'objecte fusionat
      update: vi.fn().mockResolvedValue({
        id: challengeId,
        topicId: 'some-topic',
        difficultyTier: 5, // Valor actualitzat
        type: 'QUIZ',
        content: {}, 
        createdAt: new Date()
      }),
      delete: vi.fn(),
    };

    useCase = new UpdateChallengeUseCase(mockChallengeRepo);
  });

  it('hauria de cridar al repositori amb l\'ID i les dades correctes', async () => {
    // Act
    const result = await useCase.execute(challengeId, updateInput);

    // Assert
    expect(mockChallengeRepo.update).toHaveBeenCalledTimes(1);
    expect(mockChallengeRepo.update).toHaveBeenCalledWith(challengeId, updateInput);
    expect(result.difficultyTier).toBe(5);
  });

  it('hauria de llançar error si el repositori falla (ex: ID no trobat)', async () => {
    // Arrange
    const error = new Error('Challenge not found');
    mockChallengeRepo.update = vi.fn().mockRejectedValue(error);

    // Act & Assert
    await expect(useCase.execute(challengeId, updateInput)).rejects.toThrow('Challenge not found');
  });
});