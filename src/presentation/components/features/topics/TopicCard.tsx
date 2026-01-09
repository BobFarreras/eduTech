// filepath: src/presentation/components/features/topics/TopicCard.tsx
import { createElement } from 'react';
import { Topic } from '@/core/entities/topic.entity';
import { getTopicIcon } from '@/presentation/utils/icon-mapper';
import { useTranslations, useLocale } from 'next-intl'; // <--- Importem useLocale
import Link from 'next/link';

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  const t = useTranslations(); 
  const locale = useLocale(); // <--- Obtenim l'idioma actual ('ca', 'en', etc.)
  
  const IconComponent = getTopicIcon(topic.iconName);

  return (
    <Link 
      // CORRECCIÓ: Afegim el locale a la ruta
      href={`/${locale}/learn/${topic.slug}`} 
      className="group relative block overflow-hidden rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${topic.colorTheme}`} />
      
      <div className="p-6">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${topic.colorTheme} bg-opacity-20 text-white`}>
          {createElement(IconComponent, { className: "w-6 h-6" })}
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          
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