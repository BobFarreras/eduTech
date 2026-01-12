// filepath: src/application/use-cases/challenges/create-challenge.use-case.ts
import { IChallengeRepository, CreateChallengeInput } from '@/core/repositories/challenge.repository';
import { Challenge } from '@/core/entities/challenges/challenge.entity';
import { CreateChallengeSchemaType } from '@/application/dto/challenge.schema';

export class CreateChallengeUseCase {
  constructor(private readonly challengeRepository: IChallengeRepository) {}

  /**
   * Executa la creació d'un nou repte.
   * Assumeix que les dades ja han passat la validació Zod a la capa superior.
   */
  async execute(input: CreateChallengeSchemaType): Promise<Challenge> {
    // ⚠️ CRITICAL: Type Assertion
    // El Zod Schema permet 'Record<string, any>' per a tipus futurs (fallback),
    // però el Domini és estricte (ChallengeContent).
    // Fem el cast aquí perquè estem entrant a la capa de Domini.
    // En el futur, quan definim tots els Zod Schemas (Terminal, Matching...), podrem treure el cast.
    
    const domainInput = input as unknown as CreateChallengeInput;

    return await this.challengeRepository.create(domainInput);
  }
}