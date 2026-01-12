// filepath: src/presentation/components/admin/challenges/preview/cards/theory-card.tsx
import { Lang } from '../../form/form-config';

interface TheoryData {
  title?: Record<string, string>;
  markdownContent?: Record<string, string>;
  timeToRead?: number;
}

export function TheoryCardPreview({ content, lang }: { content: TheoryData, lang: Lang }) {
  const title = content?.title?.[lang] || "Títol de la lliçó...";
  const markdown = content?.markdownContent?.[lang] || "El contingut apareixerà aquí...";
  const time = content?.timeToRead || 5;

  return (
    <div className="bg-white dark:bg-slate-900 min-h-full animate-in fade-in duration-500">
      {/* HEADER IMATGE */}
      <div className="h-40 bg-linear-to-br from-purple-500 to-indigo-600 relative">
        <div className="absolute bottom-0 left-0 p-4 w-full bg-linear-to-t from-black/50 to-transparent">
           <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded backdrop-blur-md">
             THEORY
           </span>
        </div>
      </div>

      <div className="p-5 -mt-6 relative z-10">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 border border-gray-100 dark:border-slate-700">
           <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 dark:text-gray-400">
              <span>⏱️ {time} min read</span>
              <span>•</span>
              <span>📚 Lesson 1</span>
           </div>
           
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
             {title}
           </h1>

           {/* SIMULACIÓ MARKDOWN RENDERER */}
           <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {markdown}
              </p>
           </div>
        </div>

        <div className="mt-8 flex justify-center">
           <button className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-6 py-2 rounded-full text-sm font-bold hover:bg-purple-200 transition-colors">
             Mark as Completed
           </button>
        </div>
      </div>
    </div>
  );
}