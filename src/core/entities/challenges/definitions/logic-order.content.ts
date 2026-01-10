// filepath: src/core/entities/challenges/definitions/logic-order.content.ts
import { ChallengeOption } from './shared';

export interface LogicOrderContent {
  description: string;    
  items: ChallengeOption[]; // Els items que arribaran DESORDENATS al client
}