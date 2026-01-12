// filepath: src/presentation/components/features/learning-path/LearningPathOrchestrator.tsx
'use client';

import { LevelNodeDTO } from '@/application/dto/level-node.dto';
import { VerticalPath } from './VerticalPath';
import { HorizontalPath } from './HorizontalPath';

interface OrchestratorProps {
  levels: LevelNodeDTO[];
  slug: string;
}

export function LearningPathOrchestrator({ levels, slug }: OrchestratorProps) {
  return (
    <>
      {/* VERSIÓ MÒBIL: Visible fins a md, després s'amaga */}
      <div className="block md:hidden w-full pb-32">
        <VerticalPath levels={levels} slug={slug} />
      </div>

      {/* VERSIÓ ESCRIPTORI: Oculta fins a md, després es mostra */}
      <div className="hidden md:block w-full h-full min-h-[80vh]">
        <HorizontalPath levels={levels} slug={slug} />
      </div>
    </>
  );
}