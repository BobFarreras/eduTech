import { clsx } from 'clsx';

// Motor de sintaxi optimitzat
const SyntaxHighlighter = ({ code }: { code: string }) => {
  const parts = code.split(/(\s+|[(){}[\]<>=;])/g);
  return (
    <span className="font-mono text-sm md:text-base leading-relaxed">
      {parts.map((part, i) => {
        if (['function', 'const', 'let', 'var', 'return', 'if', 'else', 'export', 'default'].includes(part)) 
          return <span key={i} className="text-pink-500">{part}</span>;
        if (['useState', 'useEffect', 'useContext', 'useMemo'].includes(part)) 
          return <span key={i} className="text-yellow-300 font-medium">{part}</span>;
        if (part.startsWith('<') || part.startsWith('</') || part.endsWith('>')) 
          return <span key={i} className="text-blue-400">{part}</span>;
        if (part.match(/^[A-Z]/) && !['A', 'B', 'C'].includes(part)) 
          return <span key={i} className="text-yellow-400">{part}</span>;
        if (['=', '=>', '==='].includes(part)) 
          return <span key={i} className="text-blue-300">{part}</span>;
        return <span key={i} className="text-blue-100/90">{part}</span>;
      })}
    </span>
  );
};

interface CodeWindowProps {
  initialCode: string;
  selectedCode?: string | null;
  isError?: boolean;
  isSuccess?: boolean;
}

export function CodeWindow({ initialCode, selectedCode, isError, isSuccess }: CodeWindowProps) {
  // Calculem les línies totals per als números de línia
  const lines = initialCode.split('\n');
  
  // Dividim el codi pel marcador per saber en quina línia cau el "forat"
  const parts = initialCode.split('???');
  const preCode = parts[0];
  const postCode = parts[1] || '';

  return (
    <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-slate-700 ring-4 ring-black/20 mt-4">
      
      {/* 1. BARRA DE TÍTOL (VSCODE STYLE) */}
      <div className="bg-[#252526] px-4 py-2 flex items-center gap-2 border-b border-[#333]">
        <div className="flex gap-1.5 mr-4">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        
        {/* Pestanya activa */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1e1e1e] rounded-t-md text-[11px] text-blue-300 font-mono border-t border-x border-[#333] -mb-[9px] z-10">
          <span className="text-yellow-500 text-[10px] font-bold">JS</span> 
          Solution.jsx
        </div>
      </div>

      {/* 2. AREA DE CODI AMB NÚMEROS DE LÍNIA */}
      <div className="flex relative min-h-[160px]">
        
        {/* Columna de números */}
        <div className="bg-[#1e1e1e] w-12 py-6 flex flex-col items-end pr-4 text-slate-600 font-mono text-xs select-none border-r border-[#333]">
          {lines.map((_, i) => (
            <div key={i} className="leading-relaxed h-[1.5rem]">{i + 1}</div>
          ))}
        </div>

        {/* Editor de codi */}
        <div className="flex-1 p-6 py-6 font-mono overflow-x-auto bg-[#1e1e1e]/50">
          <div className="whitespace-pre">
            <SyntaxHighlighter code={preCode} />
            
            {/* EL "FORAT" INTERACTIU */}
            <span className={clsx(
              "px-3 py-1 rounded-md mx-1 font-bold transition-all duration-300 inline-block min-w-20 text-center",
              "border-b-2 shadow-inner",
              !selectedCode ? "bg-slate-800 text-slate-500 border-slate-600 animate-pulse italic text-sm" :
              isSuccess ? "bg-green-500/20 text-green-400 border-green-500 scale-110 shadow-[0_0_15px_rgba(34,197,94,0.2)]" :
              isError ? "bg-red-500/20 text-red-400 border-red-500 shake-animation" :
              "bg-blue-500/20 text-blue-300 border-blue-500"
            )}>
              {selectedCode || "???"}
            </span>

            <SyntaxHighlighter code={postCode} />
          </div>
        </div>
      </div>

      {/* 3. FOOTER DE L'EDITOR */}
      <div className="bg-[#252526] px-4 py-1 border-t border-[#333] flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
        <div className="flex gap-4">
          <span>Ln {lines.length}, Col 1</span>
          <span>Spaces: 2</span>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span>JavaScript JSX</span>
        </div>
      </div>
    </div>
  );
}