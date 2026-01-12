// filepath: src/application/use-cases/challenges/create-challenge.use-case.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateChallengeUseCase } from './create-challenge.use-case';
import { IChallengeRepository } from '@/core/repositories/challenge.repository';
import { CreateChallengeSchemaType } from '@/application/dto/challenge.schema';

describe('CreateChallengeUseCase', () => {
  let useCase: CreateChallengeUseCase;
  let mockChallengeRepo: IChallengeRepository;

  // Dades de prova vàlides
  const validInput: CreateChallengeSchemaType = {
    topicId: '123e4567-e89b-12d3-a456-426614174000',
    difficultyTier: 1,
    type: 'QUIZ',
    content: {
      question: 'Què és React?',
      options: ['Una llibreria', 'Un framework', 'Un idioma', 'Un servidor'],
      correctAnswerIndex: 0,
      explanation: 'React és una llibreria de JS.'
    }
  };

  beforeEach(() => {
    // 1. Mockejem el Repositori (simulacre)
    mockChallengeRepo = {
      findNextForUser: vi.fn(),
      findByTopicId: vi.fn(),
      findById: vi.fn(),
      create: vi.fn().mockResolvedValue({
        id: 'new-id',
        createdAt: new Date(),
        ...validInput
      }),
      update: vi.fn(),
      delete: vi.fn(),
    };

    // 2. Instanciem el Cas d'Ús injectant el mock
    useCase = new CreateChallengeUseCase(mockChallengeRepo);
  });

  it('hauria de cridar al repositori amb les dades correctes', async () => {
    // Act
    const result = await useCase.execute(validInput);

    // Assert
    expect(mockChallengeRepo.create).toHaveBeenCalledTimes(1);
    expect(mockChallengeRepo.create).toHaveBeenCalledWith(validInput);
    expect(result.id).toBe('new-id');
  });

  it('hauria de propagar errors si el repositori falla', async () => {
    // Arrange
    const error = new Error('Database connection failed');
    mockChallengeRepo.create = vi.fn().mockRejectedValue(error);

    // Act & Assert
    await expect(useCase.execute(validInput)).rejects.toThrow('Database connection failed');
  });
});