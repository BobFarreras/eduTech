import { Lang } from '../../form/form-config';

interface QuizData {
  question?: Record<string, string>;
  options?: Array<{ id: string; text: Record<string, string> }>;
}
// 3. QUIZ
export function QuizCardPreview({ content, lang }: { content: QuizData, lang: Lang }) {
  const question = content?.question?.[lang] || "Pregunta...";
  // Simulació d'opcions si no n'hi ha encara
  const options = content?.options && content.options.length > 0
    ? content.options
    : [{ id: '1', text: { [lang]: 'Opció A' } }, { id: '2', text: { [lang]: 'Opció B' } }];

  return (
    <div className="space-y-6 mt-4">
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-snug">
          {question}
        </h3>
      </div>

      <div className="space-y-3">
        {options.map((opt, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 flex items-center gap-3 cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 transition-all">
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-slate-600 flex items-center justify-center text-[10px] font-bold text-gray-400">
              {String.fromCharCode(65 + idx)}
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {opt.text?.[lang] || `Opció ${idx + 1}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

