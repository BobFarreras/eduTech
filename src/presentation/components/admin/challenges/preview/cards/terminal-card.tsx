import { Lang } from '../../form/form-config';

interface TerminalData {
  instruction?: Record<string, string>;
  initialCommand?: string;
  outputParams?: { success: string; error: string };
}

export function TerminalCardPreview({ content, lang }: { content: TerminalData, lang: Lang }) {
  const instruction = content?.instruction?.[lang] || "Executa la comanda...";
  const initialCmd = content?.initialCommand || "";

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 mt-4">
      {/* INSTRUCCIÓ */}
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border-l-4 border-green-500 shadow-sm">
         <p className="text-xs font-mono text-gray-600 dark:text-gray-300">
           <span className="font-bold text-green-600 dark:text-green-400">MISSION:</span> {instruction}
         </p>
      </div>

      {/* TERMINAL WINDOW */}
      <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-700 font-mono text-xs">
         {/* HEADER */}
         <div className="bg-gray-800 px-3 py-2 flex gap-1.5 border-b border-gray-700">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            <div className="ml-auto text-[9px] text-gray-500">bash — 80x24</div>
         </div>

         {/* BODY */}
         <div className="p-4 text-green-400 h-48 flex flex-col gap-1">
            <div><span className="text-blue-400">user@hacklab</span>:<span className="text-white">~</span>$ ls -la</div>
            <div className="text-gray-400">drwxr-xr-x  secrets</div>
            <div><span className="text-blue-400">user@hacklab</span>:<span className="text-white">~</span>$ {initialCmd}<span className="animate-pulse inline-block w-2 h-4 bg-green-400 align-middle ml-1"></span></div>
         </div>
      </div>
    </div>
  );
}