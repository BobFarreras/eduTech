// filepath: src/presentation/utils/auth-guards.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { assertAdmin } from './auth-guards';
import { AuthenticationError, UnauthorizedError } from '@/core/errors/auth.error';

// Mocks
const mockGetUser = vi.fn();
vi.mock('@/infrastructure/utils/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    auth: {
      getUser: mockGetUser
    }
  }))
}));

describe('AuthGuards: assertAdmin', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV, ADMIN_EMAILS: 'admin@test.com,boss@test.com' };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('hauria de llançar AuthenticationError si no hi ha usuari loguejat', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    // Act & Assert
    await expect(assertAdmin()).rejects.toThrow(AuthenticationError);
  });

  it('hauria de llançar UnauthorizedError si el mail no està a la llista', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ 
      data: { user: { email: 'hacker@bad.com' } }, 
      error: null 
    });

    // Act & Assert
    await expect(assertAdmin()).rejects.toThrow(UnauthorizedError);
  });

  it('hauria de retornar l usuari si és un admin vàlid', async () => {
    // Arrange
    const adminUser = { email: 'admin@test.com', id: '123' };
    mockGetUser.mockResolvedValue({ 
      data: { user: adminUser }, 
      error: null 
    });

    // Act
    const result = await assertAdmin();

    // Assert
    expect(result).toEqual(adminUser);
  });
});