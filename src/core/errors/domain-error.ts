// filepath: src/core/errors/domain-error.ts

/**
 * Classe base per a tots els errors de domini.
 * Permet distingir entre errors de programació (bugs) i errors de negoci controlats.
 */
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Necessari per a que instanceof funcioni correctament en TS quan s'extén Error
    Object.setPrototypeOf(this, new.target.prototype);
  }
}