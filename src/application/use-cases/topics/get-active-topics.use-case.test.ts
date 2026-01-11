// filepath: src/application/use-cases/topics/get-active-topics.use-case.test.ts
import { describe, it, expect, vi } from 'vitest';
import { GetActiveTopicsUseCase } from './get-active-topics.use-case';
import { ITopicRepository } from '@/core/repositories/topic.repository';
import { Topic } from '@/core/entities/topic.entity';

// 1. Creem un Mock del Repositori
const mockTopicRepo = {
  findAllActive: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  findBySlug: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
} as unknown as ITopicRepository;

describe('GetActiveTopicsUseCase', () => {
  it('should return a list of active topics', async () => {
    // ARRANGE (Preparar)
    const mockTopics: Topic[] = [
      { 
        id: '123', 
        slug: 'react', 
        nameKey: 'topic.react', 
        iconName: 'react', 
        colorTheme: 'blue', 
        isActive: true, 
        createdAt: new Date(), 
        updatedAt: new Date() ,
        description: 'Test Description'
        
      }
    ];
    
    // Configurem el mock per retornar les dades falses
    vi.mocked(mockTopicRepo.findAllActive).mockResolvedValue(mockTopics);

    const useCase = new GetActiveTopicsUseCase(mockTopicRepo);

    // ACT (Executar)
    const result = await useCase.execute();

    // ASSERT (Verificar)
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('react');
    expect(mockTopicRepo.findAllActive).toHaveBeenCalledTimes(1);
  });

  it('should return empty list if no topics found', async () => {
    vi.mocked(mockTopicRepo.findAllActive).mockResolvedValue([]);
    const useCase = new GetActiveTopicsUseCase(mockTopicRepo);
    
    const result = await useCase.execute();
    
    expect(result).toEqual([]);
  });
});