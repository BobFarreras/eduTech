// filepath: src/presentation/components/admin/challenges/form/ctf-editor.tsx
import { useFormContext, Path } from 'react-hook-form';
import { ChallengeFormValues, Lang } from './form-config';

// 🎩 TRUC DE MÀGIA: Aïllem el tipus CTF
type CtfFormValues = Extract<ChallengeFormValues, { type: 'CTF' }>;

export function CtfEditor({ activeLang }: { activeLang: Lang }) {
  const { register } = useFormContext<CtfFormValues>();

  const inputClass = "w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 mb-2";
  const labelClass = "block mb-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase";

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800 flex items-start gap-3">
        <span className="text-xl">🚩</span>
        <div>
          <h3 className="text-emerald-800 dark:text-emerald-300 font-bold text-sm mb-1">Mode: Capture The Flag (CTF)</h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            L'estudiant ha de trobar una "Flag" oculta (string exacte) investigant o hackejant.
          </p>
        </div>
      </div>

      {/* 1. DESCRIPCIÓ DE LA MISSIÓ */}
      <div>
        <label className={labelClass}>Missió / Descripció ({activeLang})</label>
        <textarea
          {...register(`content.description.${activeLang}` as Path<CtfFormValues>)}
          rows={3}
          className={inputClass}
          placeholder="Ex: Troba la contrasenya oculta en els headers de la petició..."
        />
      </div>

      {/* 2. LA FLAG (SECRET) */}
      <div>
        <label className={labelClass}>La Flag (Solució Exacta)</label>
        <div className="relative group">
          <input
            {...register('content.flag' as Path<CtfFormValues>)}
            className={`${inputClass} font-mono tracking-wider bg-slate-100 dark:bg-slate-950 border-l-4 border-l-emerald-500`}
            placeholder="CTF{th1s_1s_th3_fl4g}"
          />
          <span className="absolute top-2 right-2 text-[10px] bg-emerald-100 text-emerald-600 px-1.5 rounded font-bold">SECRET</span>
        </div>
        <p className="text-[10px] text-gray-400">
          * Aquesta cadena és la que l'usuari haurà d'introduir per guanyar.
        </p>
      </div>

       {/* 3. PISTA */}
       <div>
        <label className={labelClass}>Pista / Hint ({activeLang})</label>
        <input
          {...register(`content.hint.${activeLang}` as Path<CtfFormValues>)}
          className={inputClass}
          placeholder="Ex: Mira les cookies del navegador..."
        />
      </div>
    </div>
  );
}