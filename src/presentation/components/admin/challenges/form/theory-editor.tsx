// filepath: src/presentation/components/admin/challenges/form/theory-editor.tsx
import { useFormContext, Path } from 'react-hook-form';
import { ChallengeFormValues, Lang } from './form-config';

type TheoryFormValues = Extract<ChallengeFormValues, { type: 'THEORY' }>;

export function TheoryEditor({ activeLang }: { activeLang: Lang }) {
  const { register } = useFormContext<TheoryFormValues>();

  const inputClass = "w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 mb-2";
  const labelClass = "block mb-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase";

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800 flex items-start gap-3">
        <span className="text-xl">📚</span>
        <div>
          <h3 className="text-purple-800 dark:text-purple-300 font-bold text-sm mb-1">Mode: Theory Lesson</h3>
          <p className="text-xs text-purple-600 dark:text-purple-400">
            Contingut educatiu pur. Suporta Markdown per a format ric.
          </p>
        </div>
      </div>

      {/* TITOL */}
      <div>
        <label className={labelClass}>Títol de la Lliçó ({activeLang})</label>
        <input
          {...register(`content.title.${activeLang}` as Path<TheoryFormValues>)}
          className={inputClass}
          placeholder="Introducció a..."
        />
      </div>

      {/* TEMPS DE LECTURA */}
      <div>
        <label className={labelClass}>Temps de lectura (minuts)</label>
        <input
          type="number"
          {...register('content.timeToRead' as Path<TheoryFormValues>)}
          className={inputClass}
          placeholder="5"
        />
      </div>

      {/* CONTINGUT MARKDOWN */}
      <div>
        <label className={labelClass}>Contingut Markdown ({activeLang})</label>
        <div className="relative">
          <textarea
            {...register(`content.markdownContent.${activeLang}` as Path<TheoryFormValues>)}
            rows={15}
            className={`${inputClass} font-mono text-xs leading-relaxed`}
            placeholder="# Títol principal\n\nEl text va aquí amb **negreta** i *cursiva*..."
          />
          <div className="absolute bottom-2 right-2 text-[10px] text-gray-400 bg-white dark:bg-slate-900 px-2 rounded border border-gray-200 dark:border-slate-700">
             Markdown Supported
          </div>
        </div>
      </div>
    </div>
  );
}