// filepath: src/core/errors/user-not-found.error.ts
export class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`User with ID ${userId} could not be found.`);
    this.name = 'UserNotFoundError';
  }
}