// filepath: src/application/use-cases/auth/logout.use-case.test.ts
import { describe, it, expect, vi } from 'vitest';
import { LogoutUseCase } from './logout.use-case';
import { IAuthService } from '@/core/services/auth.service';

const mockAuthService = {
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(), // <--- Això és el que provarem
  getUser: vi.fn(),
} as unknown as IAuthService;

describe('LogoutUseCase', () => {
  it('should call auth service to sign out', async () => {
    // ARRANGE
    const useCase = new LogoutUseCase(mockAuthService);

    // ACT
    await useCase.execute();

    // ASSERT
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});