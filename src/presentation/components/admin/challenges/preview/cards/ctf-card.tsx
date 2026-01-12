import { Lang } from '../../form/form-config';

// 1. Afegeix interfície
interface CtfData {
  description?: Record<string, string>;
  flag?: string;
}

// 3. Crea el component visual
export function CtfCardPreview({ content, lang }: { content: CtfData, lang: Lang }) {
  return (
    <div className="space-y-4 animate-in zoom-in-95 duration-300 mt-4">
      <div className="bg-emerald-950 border border-emerald-800 p-4 rounded-lg font-mono text-xs text-emerald-400 shadow-2xl">
        <div className="border-b border-emerald-900 pb-2 mb-2 flex justify-between">
           <span>MISSION_BRIEFING.TXT</span>
           <span>TOP SECRET</span>
        </div>
        <p className="leading-relaxed">
          {content?.description?.[lang] || "Waiting for mission details..."}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Enter Flag</label>
        <div className="flex gap-2">
           <input disabled className="flex-1 bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm font-mono" placeholder="CTF{...}" />
           <button className="bg-emerald-600 text-white px-3 py-1 rounded-md text-xs font-bold">SUBMIT</button>
        </div>
      </div>
    </div>
  );
}