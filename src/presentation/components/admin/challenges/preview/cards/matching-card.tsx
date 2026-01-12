import { Lang } from '../../form/form-config';

interface MatchingData {
  instruction?: Record<string, string>;
  pairs?: Array<{ left: { text: Record<string, string> }; right: { text: Record<string, string> } }>;
}

export function MatchingCardPreview({ content, lang }: { content: MatchingData, lang: Lang }) {
  const instruction = content?.instruction?.[lang] || "Relaciona els conceptes...";
  const pairs = content?.pairs || [];

  return (
    <div className="space-y-4 animate-in zoom-in-95 duration-300 mt-4">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm">{instruction}</h3>
      </div>

      <div className="flex justify-between gap-2 relative">
         {/* COLUMNA ESQUERRA */}
         <div className="flex flex-col gap-3 w-1/2">
            {pairs.map((p, i) => (
               p?.left?.text?.[lang] && (
                 <div key={i} className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 p-3 rounded-lg text-xs font-medium text-indigo-700 dark:text-indigo-300 shadow-sm relative h-12 flex items-center">
                    {p.left.text[lang]}
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-400 rounded-full border-2 border-white dark:border-slate-900"></div>
                 </div>
               )
            ))}
         </div>

         {/* COLUMNA DRETA (Desordenada visualment per efecte) */}
         <div className="flex flex-col gap-3 w-1/2">
            {pairs.map((p, i) => (
               p?.right?.text?.[lang] && (
                 <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-3 rounded-lg text-xs text-gray-600 dark:text-gray-300 shadow-sm h-12 flex items-center justify-end relative">
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-300 dark:bg-slate-600 rounded-full border-2 border-white dark:border-slate-900"></div>
                    {p.right.text[lang]}
                 </div>
               )
            ))}
         </div>
      </div>
    </div>
  );
}