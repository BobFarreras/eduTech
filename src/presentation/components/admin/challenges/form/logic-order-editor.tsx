// filepath: src/presentation/components/admin/challenges/form/logic-order-editor.tsx
import { useFormContext, Path } from 'react-hook-form';
import { ChallengeFormValues, Lang } from './form-config';

type LogicFormValues = Extract<ChallengeFormValues, { type: 'LOGIC_ORDER' }>;

export function LogicOrderEditor({ activeLang }: { activeLang: Lang }) {
  const { register } = useFormContext<LogicFormValues>();
  const inputClass = "w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white";

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
      {/* DESCRIPCIÓ */}
      <div>
        <label className="block mb-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Enunciat ({activeLang})</label>
        <textarea
          // FIX: Tipatge estricte
          {...register(`content.description.${activeLang}` as Path<LogicFormValues>)}
          className={inputClass}
          rows={2}
          placeholder="Ordena els passos del cicle de vida de React..."
        />
      </div>

      {/* ITEMS ORDENATS */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
           Passos (Escriu-los en l'ordre CORRECTE)
        </label>
        
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="flex gap-2 items-center">
             <div className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-slate-700 rounded text-xs font-bold text-gray-500">
               {idx + 1}
             </div>
             <input
               // FIX: Tipatge estricte
               {...register(`content.items.${idx}.text.${activeLang}` as Path<LogicFormValues>)}
               className={inputClass}
               placeholder={`Pas ${idx + 1}...`}
             />
             {/* FIX: ID ocult */}
             <input type="hidden" {...register(`content.items.${idx}.id` as Path<LogicFormValues>)} value={`step-${idx}`} />
          </div>
        ))}
        <p className="text-[10px] text-gray-400 flex items-center gap-1">
           ℹ️ Al preview es mostraran barrejats.
        </p>
      </div>
    </div>
  );
}