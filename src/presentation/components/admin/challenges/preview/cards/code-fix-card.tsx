import { Lang } from '../../form/form-config';
interface CodeFixData {
  description?: Record<string, string>;
  initialCode?: string;
  hint?: Record<string, string>;
}

// 1. CODE FIX (Simulador IDE)
export function CodeFixCardPreview({ content, lang }: { content: CodeFixData, lang: Lang }) {
  const description = content?.description?.[lang] || "Descripció del problema...";
  const code = content?.initialCode || "// El teu codi apareixerà aquí...";

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
      {/* Bombolla de Chat / Instrucció */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Editor de Codi Simulat */}
      <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-[#1e1e1e] font-mono text-xs">
        {/* Fake Tabs */}
        <div className="flex bg-[#252526] px-2 pt-2 border-b border-[#333]">
          <div className="bg-[#1e1e1e] text-blue-400 px-3 py-1.5 rounded-t-md flex items-center gap-2">
            <span className="text-[10px]">TS</span>
            <span>solution.ts</span>
          </div>
        </div>

        {/* Code Area */}
        <div className="p-4 text-gray-300 overflow-x-auto">
          <pre className="whitespace-pre-wrap leading-relaxed">
            <code>
              <span className="text-pink-400">function</span> <span className="text-yellow-200">fixMe</span>() {'{'}
              {'\n'}  {code}
              {'\n'}
              {'}'}
            </code>
          </pre>
        </div>
      </div>

      {/* Fake Terminal Output */}
      <div className="bg-black/90 rounded-lg p-3 font-mono text-[10px] text-green-400 border border-slate-800 shadow-inner">
        <div className="opacity-50 mb-1">$ running tests...</div>
        <div>❌ Error: Expected output '42', got 'undefined'</div>
      </div>
    </div>
  );
}
