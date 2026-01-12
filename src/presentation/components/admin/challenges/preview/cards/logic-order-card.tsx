import { Lang } from '../../form/form-config';

interface LogicData {
  description?: Record<string, string>;
  items?: Array<{ id: string; text: Record<string, string> }>;
}

export function LogicOrderCardPreview({ content, lang }: { content: LogicData, lang: Lang }) {
  const desc = content?.description?.[lang] || "Ordena la seqüència...";
  const items = content?.items || [];

  return (
    <div className="space-y-4 animate-in zoom-in-95 duration-300 mt-4">
      <h3 className="text-center font-bold text-slate-700 dark:text-white text-sm">{desc}</h3>

      <div className="space-y-2 relative">
         {/* LÍNIA CONNECTORA */}
         <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-slate-700 -z-10"></div>

         {items.map((item, i) => (
            item?.text?.[lang] && (
              <div key={i} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-transform">
                 <div className="bg-gray-100 dark:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-gray-500 dark:text-gray-300 shrink-0 z-10">
                    {i + 1}
                 </div>
                 <span className="text-sm text-gray-700 dark:text-gray-200">{item.text[lang]}</span>
                 <div className="ml-auto text-gray-300 dark:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                 </div>
              </div>
            )
         ))}
      </div>
    </div>
  );
}