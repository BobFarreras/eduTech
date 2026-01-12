// filepath: src/presentation/components/admin/challenges/form/matching-editor.tsx
import { useFormContext, Path } from 'react-hook-form';
import { ChallengeFormValues, Lang } from './form-config';

type MatchingFormValues = Extract<ChallengeFormValues, { type: 'MATCHING' }>;

export function MatchingEditor({ activeLang }: { activeLang: Lang }) {
  const { register } = useFormContext<MatchingFormValues>();
  
  const inputClass = "w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      {/* INSTRUCCIÓ */}
      <div>
        <label className="block mb-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Instrucció ({activeLang})</label>
        <textarea
          // FIX: Tipatge estricte
          {...register(`content.instruction.${activeLang}` as Path<MatchingFormValues>)}
          className={inputClass}
          rows={2}
          placeholder="Relaciona cada concepte amb la seva definició..."
        />
      </div>

      {/* PARELLES */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Parelles (Esquerra - Dreta)</label>
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="flex items-center gap-2 bg-gray-50 dark:bg-slate-900/50 p-2 rounded-lg border border-gray-200 dark:border-slate-700">
             <div className="flex flex-col flex-1 gap-1">
                <span className="text-[10px] text-gray-400 font-mono">ITEM A{idx+1}</span>
                <input
                  // FIX: Tipatge estricte per arrays niuats
                  {...register(`content.pairs.${idx}.left.text.${activeLang}` as Path<MatchingFormValues>)} 
                  className={inputClass}
                  placeholder="Concepte..."
                />
             </div>
             <span className="text-gray-400">↔</span>
             <div className="flex flex-col flex-1 gap-1">
                <span className="text-[10px] text-gray-400 font-mono">ITEM B{idx+1}</span>
                <input
                  // FIX: Tipatge estricte
                  {...register(`content.pairs.${idx}.right.text.${activeLang}` as Path<MatchingFormValues>)}
                  className={inputClass}
                  placeholder="Definició..."
                />
             </div>
             {/* IDs ocults necessaris */}
             <input type="hidden" {...register(`content.pairs.${idx}.left.id` as Path<MatchingFormValues>)} value={`l-${idx}`} />
             <input type="hidden" {...register(`content.pairs.${idx}.right.id` as Path<MatchingFormValues>)} value={`r-${idx}`} />
          </div>
        ))}
      </div>
    </div>
  );
}