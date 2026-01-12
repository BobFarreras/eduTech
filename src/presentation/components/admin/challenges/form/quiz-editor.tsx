// filepath: src/presentation/components/admin/challenges/form/quiz-editor.tsx
import { useFormContext, Path } from 'react-hook-form';
import { ChallengeFormValues, Lang } from './form-config';

// 1. Definim el tipus específic
type QuizFormValues = Extract<ChallengeFormValues, { type: 'QUIZ' }>;

export function QuizEditor({ activeLang }: { activeLang: Lang }) {
  const { register, watch } = useFormContext<QuizFormValues>();
  
  // Watch segur
  const correctIdx = watch('content.correctOptionIndex' as Path<QuizFormValues>);

  const inputClass = "w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-3 text-sm font-medium dark:text-white focus:ring-2 focus:ring-indigo-500 block";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      {/* PREGUNTA */}
      <div>
        <label className="block mb-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Pregunta ({activeLang})</label>
        <textarea
          // FIX: Construcció de path segura
          {...register(`content.question.${activeLang}` as Path<QuizFormValues>)}
          className={inputClass}
          rows={2}
          placeholder="Escriu la pregunta aquí..."
        />
      </div>

      {/* OPCIONS */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Opcions (Marca la correcta)</label>
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className={`flex gap-2 items-center p-2 rounded-lg border transition-colors ${Number(correctIdx) === index ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
             
             {/* RÀDIO CUSTOM */}
             <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  value={index}
                  // FIX: Tipatge explícit per al path numèric
                  {...register('content.correctOptionIndex' as Path<QuizFormValues>, { valueAsNumber: true })}
                  className="peer sr-only"
                  id={`opt-${index}`}
                />
                <label 
                  htmlFor={`opt-${index}`}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-slate-600 flex items-center justify-center cursor-pointer peer-checked:bg-green-500 peer-checked:border-green-500 text-gray-400 peer-checked:text-white font-bold transition-all"
                >
                  {String.fromCharCode(65 + index)}
                </label>
             </div>

             {/* TEXT INPUT */}
             <input
                // FIX: Path construït dinàmicament però castat a Path<T>
                {...register(`content.options.${index}.text.${activeLang}` as Path<QuizFormValues>)} 
                className="flex-1 bg-transparent border-b border-gray-300 dark:border-slate-700 focus:border-indigo-500 outline-none text-sm py-1 dark:text-white"
                placeholder={`Opció ${index + 1}`}
             />
             
             {/* INPUT ID HIDDEN */}
             <input 
                type="hidden" 
                // FIX: Path segur per a l'ID
                {...register(`content.options.${index}.id` as Path<QuizFormValues>)} 
                value={index.toString()} 
             />
          </div>
        ))}
      </div>

      {/* EXPLICACIÓ */}
      <div>
        <label className="block mb-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Explicació ({activeLang})</label>
        <textarea
          {...register(`content.explanation.${activeLang}` as Path<QuizFormValues>)}
          className={inputClass}
          rows={2}
          placeholder="Per què és aquesta la resposta correcta?"
        />
      </div>
    </div>
  );
}