// filepath: src/presentation/components/admin/challenges/form/terminal-editor.tsx
import { useFormContext, Path } from 'react-hook-form';
import { ChallengeFormValues, Lang } from './form-config';

type TerminalFormValues = Extract<ChallengeFormValues, { type: 'TERMINAL' }>;

export function TerminalEditor({ activeLang }: { activeLang: Lang }) {
  const { register } = useFormContext<TerminalFormValues>();
  const inputClass = "w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white font-mono";

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
      {/* INSTRUCCIÓ */}
      <div>
        <label className="block mb-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Objectiu ({activeLang})</label>
        <textarea
          // FIX: Tipatge estricte
          {...register(`content.instruction.${activeLang}` as Path<TerminalFormValues>)}
          className={inputClass.replace('font-mono', '')}
          rows={2}
          placeholder="Navega al directori /var/www..."
        />
      </div>

      {/* COMMANDES VÀLIDES */}
      <div>
        <label className="block mb-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Commandes Acceptades</label>
        <div className="space-y-2">
           {[0, 1].map(i => (
             <input 
               key={i}
               // FIX: Tipatge estricte per array de strings
               {...register(`content.validCommands.${i}` as Path<TerminalFormValues>)}
               className={inputClass}
               placeholder={i === 0 ? "cd /var/www" : "Alternativa (opcional)..."}
             />
           ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-1">Commandes exactes que validen el repte.</p>
      </div>

      {/* FEEDBACK */}
      <div className="grid grid-cols-2 gap-4">
         <div>
            <label className="block mb-1 text-xs font-bold text-green-600 dark:text-green-400 uppercase">Output Èxit</label>
            <textarea
              // FIX: Tipatge estricte
              {...register('content.outputParams.success' as Path<TerminalFormValues>)}
              className={`${inputClass} bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900`}
              placeholder="Correcte! Has accedit."
            />
         </div>
         <div>
            <label className="block mb-1 text-xs font-bold text-red-600 dark:text-red-400 uppercase">Output Error</label>
            <textarea
              // FIX: Tipatge estricte
              {...register('content.outputParams.error' as Path<TerminalFormValues>)}
              className={`${inputClass} bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900`}
              placeholder="Permís denegat."
            />
         </div>
      </div>
    </div>
  );
}