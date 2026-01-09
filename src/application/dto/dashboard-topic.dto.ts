// filepath: src/application/dto/dashboard-topic.dto.ts
import { Topic } from "@/core/entities/topic.entity";

export interface DashboardTopicDTO extends Topic {
  progressPercentage: number; // 0 a 100
  totalXpEarned: number;
  currentLevel: number;
  isLocked: boolean; // Per si volem bloquejar temes avançats
}