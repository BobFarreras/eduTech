// filepath: src/presentation/components/features/game/code-fix/CodeWindow.tsx
import { clsx } from 'clsx';

const SyntaxHighlighter = ({ code }: { code: string }) => {
  if (!code) return null;
  // Regex millorada per tokenitzar millor símbols
  const parts = code.split(/(\s+|[(){}[\]<>=;:"'`.,])/g);
  
  return (
    <span className="font-mono leading-relaxed whitespace-pre">
      {parts.map((part, i) => {
        if (['function', 'const', 'let', 'var', 'return', 'if', 'else', 'import', 'from', 'export', 'default', 'async', 'await'].includes(part)) 
          return <span key={i} className="text-pink-400 font-semibold">{part}</span>;
        if (['useState', 'useEffect', 'console', 'log'].includes(part)) 
          return <span key={i} className="text-yellow-300">{part}</span>;
        if (part.match(/^[A-Z][a-zA-Z0-9]*$/)) // Components/Classes
          return <span key={i} className="text-yellow-200">{part}</span>;
        if (['=', '=>', '{', '}', '<', '>', '(', ')', '[', ']', '.', ';'].includes(part)) 
          return <span key={i} className="text-blue-300">{part}</span>;
        if (part.startsWith('"') || part.startsWith("'") || part.startsWith('`'))
           return <span key={i} className="text-green-300">{part}</span>;
        if (!isNaN(Number(part)) && part.trim() !== '')
           return <span key={i} className="text-purple-300">{part}</span>;

        return <span key={i} className="text-blue-100/90">{part}</span>;
      })}
    </span>
  );
};

interface CodeWindowProps {
  initialCode: string;
  selectedCode?: string | null;
  status: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'ERROR';
}

export function CodeWindow({ initialCode, selectedCode, status }: CodeWindowProps) {
  const lines = initialCode.split('\n');

  return (
    <div className="bg-[#1e1e1e] relative shadow-inner w-full">
      {/* Scroll Horitzontal per al codi */}
      <div className="overflow-x-auto custom-scrollbar">
          <div className="flex flex-col font-mono text-[11px] sm:text-xs md:text-sm py-4 min-w-fit">
            
            {lines.map((lineContent, index) => {
              const hasGap = lineContent.includes('???');
              let preGap = '', postGap = '';

              if (hasGap) {
                const parts = lineContent.split('???');
                preGap = parts[0];
                postGap = parts[1] || '';
              }

              return (
                <div 
                  key={index} 
                  className={clsx(
                    "group flex hover:bg-[#2a2a2b] transition-colors w-full min-w-max", // min-w-max assegura que la línia no es trenqui
                    hasGap && "bg-blue-900/10"
                  )}
                >
                  {/* Números de línia */}
                  <div className="w-8 sm:w-10 shrink-0 text-right pr-3 select-none text-[#5a5a5a] border-r border-[#333] group-hover:text-slate-400 bg-[#1e1e1e] sticky left-0 z-10">
                    {index + 1}
                  </div>

                  {/* Codi */}
                  <div className="pl-3 sm:pl-4 pr-4 whitespace-pre">
                    {hasGap ? (
                      <div className="inline-block">
                        <SyntaxHighlighter code={preGap} />
                        
                        {/* INPUT BOX */}
                        <span className={clsx(
                          "inline-flex items-center justify-center px-1.5 py-0.5 mx-1 rounded-sm align-middle",
                          "font-bold text-[10px] sm:text-xs min-w-10 transition-all duration-300",
                          "border border-dashed shadow-sm",
                          !selectedCode 
                            ? "bg-slate-800 border-slate-600 text-slate-500 animate-pulse" 
                            : status === 'SUCCESS' 
                              ? "bg-green-500/20 border-green-500 text-green-400 scale-105" 
                              : status === 'ERROR' 
                                ? "bg-red-500/20 border-red-500 text-red-400" 
                                : "bg-blue-500/20 border-blue-400 text-blue-300"
                        )}>
                           {selectedCode || "?"}
                        </span>

                        <SyntaxHighlighter code={postGap} />
                      </div>
                    ) : (
                      <SyntaxHighlighter code={lineContent} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
      </div>
      
      {/* Footer Info */}
      <div className="bg-[#252526] px-3 py-1 text-[10px] text-slate-500 flex justify-between items-center border-t border-[#333]">
        <span className="uppercase tracking-wider">ReadOnly</span>
        <div className="flex gap-2">
            <span>Ln {lines.length}</span>
            <span>TSX</span>
        </div>
      </div>
    </div>
  );
}