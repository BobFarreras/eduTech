// filepath: src/application/use-cases/profile/update-user-profile.use-case.test.ts
import { describe, it, expect, vi } from 'vitest';
import { UpdateUserProfileUseCase } from './update-user-profile.use-case';
import { IProfileRepository } from '../../../core/repositories/profile.repository';

// MOCK (Simulacre del repositori)
const mockProfileRepo = {
  getById: vi.fn(),
  update: vi.fn(),
} as unknown as IProfileRepository;

describe('UpdateUserProfileUseCase', () => {
  it('hauria d\'actualitzar el perfil si les dades són vàlides', async () => {
    const useCase = new UpdateUserProfileUseCase(mockProfileRepo);
    
    await useCase.execute('user-123', {
      username: 'CoolCoder',
      avatarIcon: '🚀'
    });

    // Verifiquem que s'ha cridar al mètode update del repositori
    expect(mockProfileRepo.update).toHaveBeenCalledWith('user-123', {
      username: 'CoolCoder',
      avatarIcon: '🚀'
    });
  });

  it('hauria de llançar error si el nom és massa curt', async () => {
    const useCase = new UpdateUserProfileUseCase(mockProfileRepo);

    // Intentem posar un nom de 2 lletres
    await expect(useCase.execute('user-123', { username: 'Jo' }))
      .rejects
      .toThrow('El nom d\'usuari ha de tenir entre 3 i 20 caràcters.');
  });

  it('hauria de llançar error si l\'avatar és massa llarg', async () => {
    const useCase = new UpdateUserProfileUseCase(mockProfileRepo);

    // Intentem colar un text llarg en comptes d'un emoji
    await expect(useCase.execute('user-123', { avatarIcon: 'Això no és un emoji' }))
      .rejects
      .toThrow('L\'avatar no és vàlid.');
  });
});