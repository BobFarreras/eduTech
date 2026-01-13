// filepath: src/application/use-cases/dashboard/get-user-dashboard.use-case.ts
import { ITopicRepository } from "@/core/repositories/topic.repository";
import { DashboardTopicDTO } from "@/application/dto/dashboard-topic.dto";

export class GetUserDashboardUseCase {
  constructor(private topicRepository: ITopicRepository) {}

  // ✅ FIX: Hem eliminat 'locale' i 'supabaseClient' dels paràmetres
  async execute(userId: string): Promise<DashboardTopicDTO[]> {
    return await this.topicRepository.getUserDashboard(userId);
  }
}