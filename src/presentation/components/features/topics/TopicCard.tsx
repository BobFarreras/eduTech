'use client';

import { useLocale } from 'next-intl';
import { Topic } from '@/core/entities/topic.entity';
import { getLocalizedText } from '@/core/utils/i18n-utils';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react'; // 👈 Importem el tipus

export function TopicCard({ topic }: { topic: Topic }) {
  const locale = useLocale();
  
  // ✅ FIX: Fem un cast segur a un Record<string, LucideIcon>
  // Això diu: "Tracta l'objecte Icons com un diccionari de icones"
  const iconList = Icons as unknown as Record<string, LucideIcon>;
  const IconComponent = iconList[topic.iconName] || Icons.Box;

  return (
    <div className={`p-6 rounded-xl border ${topic.isActive ? 'border-slate-200' : 'border-slate-800 opacity-50'}`}>
      <div className={`${topic.colorTheme} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        <IconComponent className="text-white w-6 h-6" />
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
        {getLocalizedText(topic.title, locale)}
      </h3>

      <p className="text-sm text-slate-500">
        {getLocalizedText(topic.description, locale)}
      </p>
    </div>
  );
}