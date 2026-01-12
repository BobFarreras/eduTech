// filepath: src/core/repositories/topic.repository.ts
import { Topic, CreateTopicInput } from '../entities/topic.entity';
import { ChallengeType } from '../entities/challenges/challenge.entity';

export interface TierProgressStats {
  tier: number;
  totalChallenges: number;
  completedChallenges: number;
  mostCommonType: ChallengeType;
}

export interface ITopicRepository {
  findAllActive(): Promise<Topic[]>;
  findAll(): Promise<Topic[]>; // Aquest és el que fallava
  findById(id: string): Promise<Topic | null>;
  findBySlug(slug: string): Promise<Topic | null>;
  create(topic: CreateTopicInput): Promise<Topic>;
  update(id: string, topic: Partial<CreateTopicInput>): Promise<Topic>;
  getTopicProgressSummary(topicId: string, userId: string): Promise<TierProgressStats[]>;
  delete(id: string): Promise<void>;
}