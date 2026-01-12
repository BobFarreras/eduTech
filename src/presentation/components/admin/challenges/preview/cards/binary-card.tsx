import { Lang } from '../../form/form-config';


// --- TIPUS DE DADES PER AL PREVIEW (EVITEM ANY) ---
interface BinaryData {
  statement?: Record<string, string>;
  variant?: 'TRUE_FALSE' | 'HOT_OR_NOT';
  explanation?: Record<string, string>;
}

// 2. BINARY DECISION
export function BinaryCardPreview({ content, lang }: { content: BinaryData, lang: Lang }) {
  const statement = content?.statement?.[lang] || "";
  const variant = content?.variant || 'TRUE_FALSE';
  const isHot = variant === 'HOT_OR_NOT';

  return (
    <div className="space-y-6 mt-8 animate-in zoom-in-95 duration-300">
      <div className="flex justify-center">
        <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-xl mb-4 ${isHot
            ? 'bg-linear-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40'
            : 'bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40'
          }`}>
          {isHot ? '🌶️' : '🧠'}
        </div>
      </div>

      <div className="text-center px-2">
        <h3 className="text-xl font-black text-slate-800 dark:text-white leading-tight drop-shadow-sm">
          {statement || "Escriu alguna cosa..."}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="aspect-square rounded-2xl bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center gap-2 shadow-sm hover:border-green-500 dark:hover:border-green-500 transition-all cursor-pointer group">
          <span className="text-3xl group-hover:scale-110 transition-transform">{isHot ? '🔥' : '✅'}</span>
          <span className="text-xs font-bold text-gray-400 group-hover:text-green-500">{isHot ? 'HOT' : 'TRUE'}</span>
        </div>
        <div className="aspect-square rounded-2xl bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center gap-2 shadow-sm hover:border-red-500 dark:hover:border-red-500 transition-all cursor-pointer group">
          <span className="text-3xl group-hover:scale-110 transition-transform">{isHot ? '❄️' : '❌'}</span>
          <span className="text-xs font-bold text-gray-400 group-hover:text-red-500">{isHot ? 'NOT' : 'FALSE'}</span>
        </div>
      </div>
    </div>
  );
}
