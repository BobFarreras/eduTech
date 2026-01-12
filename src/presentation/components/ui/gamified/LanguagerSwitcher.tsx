'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const languages = [
  { code: 'ca', label: 'Català', flag: '🐱' }, // Emoji provisional
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (newLocale: string) => {
    // Substituïm el locale actual pel nou a la URL
    // Ex: /ca/login -> /en/login
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-700 bg-slate-800 hover:bg-slate-700 font-bold text-slate-400 transition-colors"
      >
        <Globe className="w-5 h-5" />
        <span className="uppercase">{locale}</span>
      </button>

      {/* Dropdown Gamificat */}
      {isOpen && (
        <div className="absolute top-14 right-0 bg-slate-800 border-2 border-slate-700 rounded-xl shadow-xl p-2 w-48 flex flex-col gap-2 z-50 animate-in fade-in zoom-in-95">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={clsx(
                "flex items-center gap-3 p-3 rounded-lg font-bold transition-all border-b-4 active:border-b-0 active:translate-y-1",
                locale === lang.code 
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/50" 
                  : "hover:bg-slate-700 text-slate-300 border-transparent hover:border-slate-600"
              )}
            >
              <span className="text-xl">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}