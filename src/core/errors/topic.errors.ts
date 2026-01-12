// filepath: src/core/errors/topic.errors.ts
import { DomainError } from './domain-error';

export class TopicNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`El tema amb identificador '${identifier}' no s'ha trobat.`);
  }
}

export class TopicAlreadyExistsError extends DomainError {
  constructor(slug: string) {
    super(`Ja existeix un tema amb l'slug '${slug}'.`);
  }
}