// filepath: src/core/repositories/topic.repository.ts
import { Topic, CreateTopicInput } from '../entities/topic.entity';
import { ChallengeType } from '../entities/challenges/challenge.entity';
import { DashboardTopicDTO } from '@/application/dto/dashboard-topic.dto'; // <--- Importa això
// 1. ✅ DEFINIM EL TIPUS EXPLICIT (Ja no és anònim)
export interface MapConfig {
  isBoss: boolean;
  bossTitle?: string;
  bossIcon?: string;
  bossColor?: string;
}
export interface TierProgressStats {
  tier: number;
  totalChallenges: number;
  completedChallenges: number;
  mostCommonType: ChallengeType;
  // 2. ✅ L'USEM AQUÍ
  mapConfig?: MapConfig | null;
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
  getUserDashboard(userId: string): Promise<DashboardTopicDTO[]>;
  
}