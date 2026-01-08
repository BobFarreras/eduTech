// filepath: src/presentation/components/features/topics/TopicCard.tsx
import { createElement } from 'react';
import { Topic } from '@/core/entities/topic.entity';
import { getTopicIcon } from '@/presentation/utils/icon-mapper';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  const t = useTranslations(); 
  
  // Obtenim la referència del component icona (no l'estem creant, només important)
  const IconComponent = getTopicIcon(topic.iconName);

  return (
    <Link 
      href={`/learn/${topic.slug}`}
      className="group relative block overflow-hidden rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${topic.colorTheme}`} />
      
      <div className="p-6">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${topic.colorTheme} bg-opacity-20 text-white`}>
          {/* SOLUCIÓ ERROR RENDER: 
            Usem createElement per evitar que el linter pensi que estem definint un component.
            Alternativa neta: <IconComponent className="..." /> sol funcionar si la variable comença en Majúscula 
            i està definida fora del return, però createElement és infalible aquí.
          */}
          {createElement(IconComponent, { className: "w-6 h-6" })}
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          {/* SOLUCIÓ ERROR ANY:
            next-intl espera una clau literal ('topic.react.title'). 
            Com que ve de la BD, TS no ho pot validar. 
            Fem servir 'as string' i si TS es posa estricte, @ts-ignore és millor que 'any' 
            perquè documenta que és una limitació del tipat estàtic vs dinàmic.
          */}
  
          {t(topic.nameKey)} 
        </h3>
        
        <div className="flex items-center text-sm text-slate-400 group-hover:text-blue-400 transition-colors">
          <span>{t('dashboard.startTopic')}</span>
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}