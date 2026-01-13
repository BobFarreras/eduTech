// filepath: src/presentation/components/profile/EmojiSelector.tsx
'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl'; // <--- IMPORT

const EMOJI_LIST = [
  '🤖', '🚀', '💻', '🐱', '⚡', '🧠', '🔮', '🎓', 
  '🔥', '👾', '🦄', '🐲', '🎩', '🛡️', '⚔️', '🌌',
  '👽', '👨‍💻', '👩‍💻', '🕹️', '💾', '📡', '🔭', '🧬',
  '🦠', '🧪', '⚙️', '🔧', '🧱', '🏗️', '📱', '⌚',
  '🔋', '💡', '🔦', '🔌', '📡', '🛰️', '🪐', '🌍'
];

const ITEMS_PER_PAGE = 12;

interface Props {
  currentAvatar: string;
}

export function EmojiSelector({ currentAvatar }: Props) {
  const t = useTranslations('profile.form'); // <--- HOOK
  const [page, setPage] = useState(0);
  
  const totalPages = Math.ceil(EMOJI_LIST.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const currentEmojis = EMOJI_LIST.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const nextPage = () => setPage((p) => (p + 1) % totalPages);
  const prevPage = () => setPage((p) => (p - 1 + totalPages) % totalPages);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-400">
        {t('avatar_label')} {/* <--- ÚS DE LA CLAU */}
      </label>
      
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-2 flex items-center gap-2">
        <button type="button" onClick={prevPage} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 grid grid-cols-4 gap-2">
          {currentEmojis.map((emoji) => (
            <label key={emoji} className="cursor-pointer relative group aspect-square">
              <input 
                type="radio" 
                name="avatarIcon" 
                value={emoji} 
                defaultChecked={currentAvatar === emoji}
                className="peer sr-only"
              />
              <div className="w-full h-full flex items-center justify-center text-2xl bg-slate-800/50 rounded-xl border-2 border-transparent transition-all hover:bg-slate-700 hover:scale-105 peer-checked:border-blue-500 peer-checked:bg-blue-500/20 peer-checked:shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                {emoji}
              </div>
            </label>
          ))}
        </div>

        <button type="button" onClick={nextPage} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex justify-center gap-1.5">
        {Array.from({ length: totalPages }).map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === page ? 'w-4 bg-blue-500' : 'w-1.5 bg-slate-800'}`} />
        ))}
      </div>
    </div>
  );
}