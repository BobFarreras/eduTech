// filepath: src/presentation/components/admin/challenges/form/code-fix-editor.tsx
import { useFormContext, Path } from 'react-hook-form';
import { ChallengeFormValues, Lang } from './form-config';

// 1. TRUC DE MÀGIA 🎩: Creem un tipus que només conté l'estructura de CODE_FIX
// Això elimina l'ambigüitat de la Unió.
type CodeFixFormValues = Extract<ChallengeFormValues, { type: 'CODE_FIX' }>;

export function CodeFixEditor({ activeLang }: { activeLang: Lang }) {
  // 2. Diem al context que, DINS d'aquest component, les dades són de tipus CodeFix
  const { register } = useFormContext<CodeFixFormValues>();

  const inputClass = "w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 mb-2";
  const labelClass = "block mb-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase";

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
        <h3 className="text-blue-800 dark:text-blue-300 font-bold text-sm mb-1">Mode: Code Fix</h3>
        <p className="text-xs text-blue-600 dark:text-blue-400">L'usuari haurà de trobar i arreglar un bug en el codi inicial.</p>
      </div>

      {/* 1. DESCRIPCIÓ DEL PROBLEMA */}
      <div>
        <label className={labelClass}>Descripció del Problema ({activeLang})</label>
        <textarea
          // ✅ FIX: Usem 'as Path<...>' per assegurar a TS que la ruta construïda és vàlida
          {...register(`content.description.${activeLang}` as Path<CodeFixFormValues>)}
          rows={3}
          className={inputClass}
          placeholder="Explica què ha de fer l'alumne..."
        />
      </div>

      {/* 2. CODI INICIAL (BUGGED) */}
      <div>
        <label className={labelClass}>Codi Inicial (Amb Errors)</label>
        <div className="relative">
          <span className="absolute top-2 right-2 text-[10px] bg-red-100 text-red-600 px-2 rounded">BUGGY</span>
          <textarea
            // ✅ FIX: Ara TS sap que 'content.initialCode' existeix dins de CodeFixFormValues
            // Si encara es queixa, afegim el cast 'as Path<CodeFixFormValues>' per seguretat extra
            {...register('content.initialCode' as Path<CodeFixFormValues>)}
            rows={6}
            className={`${inputClass} font-mono bg-slate-900 text-red-300`}
            placeholder="function suma(a, b) { return a - b; }"
          />
        </div>
      </div>

      {/* 3. SOLUCIÓ (CORRECTA) */}
      <div>
        <label className={labelClass}>Solució Esperada (Regex o String)</label>
        <div className="relative">
          <span className="absolute top-2 right-2 text-[10px] bg-green-100 text-green-600 px-2 rounded">CORRECT</span>
          <textarea
            // ✅ FIX: Mateix cast aquí
            {...register('content.solution' as Path<CodeFixFormValues>)}
            rows={4}
            className={`${inputClass} font-mono bg-slate-900 text-green-300`}
            placeholder="return a + b;"
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-1">
          * El sistema compararà l'input de l'usuari amb aquesta solució.
        </p>
      </div>

       {/* 4. PISTA */}
       <div>
        <label className={labelClass}>Pista / Hint ({activeLang})</label>
        <input
          // ✅ FIX: Cast per a la clau dinàmica
          {...register(`content.hint.${activeLang}` as Path<CodeFixFormValues>)}
          className={inputClass}
          placeholder="Dóna una petita ajuda..."
        />
      </div>
    </div>
  );
}