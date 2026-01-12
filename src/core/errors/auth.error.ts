// filepath: src/core/errors/auth.errors.ts

/**
 * Error base del domini per a problemes d'autenticació/autorització.
 */
export class DomainAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainAuthError';
  }
}

/**
 * Llançat quan l'usuari no està identificat (No hi ha sessió).
 * Equival a un 401 Unauthorized.
 */
export class AuthenticationError extends DomainAuthError {
  constructor(message: string = 'Usuari no autenticat.') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Llançat quan l'usuari està identificat però no té permisos.
 * Equival a un 403 Forbidden.
 */
export class UnauthorizedError extends DomainAuthError {
  constructor(message: string = 'Accés denegat: Permisos insuficients.') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}