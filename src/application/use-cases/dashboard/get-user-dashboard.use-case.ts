// filepath: src/application/use-cases/dashboard/get-user-dashboard.use-case.ts
import { ITopicRepository } from "@/core/repositories/topic.repository";
import { DashboardTopicDTO } from "@/application/dto/dashboard-topic.dto";
import { SupabaseClient } from "@supabase/supabase-js"; 

// Nota: Normalment injectariem un IUserProgressRepository, 
// però per agilitzar la demo farem la consulta de progrés aquí o passarem el client.
// Per Clean Arch estricta, hauries de crear IUserProgressRepository.

export class GetUserDashboardUseCase {
  constructor(private topicRepository: ITopicRepository) {}

  async execute(userId: string, locale: string, supabaseClient: SupabaseClient): Promise<DashboardTopicDTO[]> {
    // 1. Obtenir tots els temes actius (traduïts)
    // Assumim que el teu repo ja suporta locale, si no, usa el que tinguis
    const topics = await this.topicRepository.findAllActive(); 

    // 2. Obtenir el progrés de l'usuari (Raw query a Supabase per velocitat)
    const { data: progressData } = await supabaseClient
        .from('user_progress')
        .select('topic_id, xp_earned')
        .eq('user_id', userId);

    // 3. Fusionar dades (Mapping)
    return topics.map(topic => {
        // Calculem XP total per aquest tema
        const topicProgress = progressData?.filter(p => p.topic_id === topic.id) || [];
        const totalXp = topicProgress.reduce((sum, p) => sum + (p.xp_earned || 0), 0);
        
        // Càlcul simplificat de percentatge (Ex: 1000 XP = 100%)
        // Més endavant ho farem comptant reptes totals vs reptes fets
        const percentage = Math.min(100, (totalXp / 500) * 100); 

        return {
            ...topic,
            progressPercentage: Math.round(percentage),
            totalXpEarned: totalXp,
            currentLevel: Math.floor(totalXp / 100) + 1,
            isLocked: false // Lògica futura de bloqueig
        };
    });
  }
}