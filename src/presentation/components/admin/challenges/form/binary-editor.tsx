// filepath: src/presentation/components/admin/challenges/form/binary-editor.tsx
import { useFormContext, Path } from 'react-hook-form';
import { ChallengeFormValues, Lang } from './form-config';

interface BinaryEditorProps {
  activeLang: Lang;
}

export function BinaryEditor({ activeLang }: BinaryEditorProps) {
  // Usem el context per connectar amb el formulari del pare
  const { register } = useFormContext<ChallengeFormValues>();

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-md mb-4">
        <h3 className="text-blue-900 font-bold text-sm mb-2">Mode: Binary Decision</h3>
        <p className="text-blue-700 text-xs">Configura una pregunta de Verdader/Fals o Hot/Not.</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Enunciat ({activeLang.toUpperCase()})</label>
        <textarea
          {...register(`content.statement.${activeLang}` as Path<ChallengeFormValues>)}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-20"
          placeholder="Escriu la afirmació aquí..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
          <label className="text-sm font-semibold text-gray-700">És cert?</label>
          <input
            type="checkbox"
            {...register('content.isTrue' as Path<ChallengeFormValues>)}
            className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Variant Visual</label>
          <select
            {...register('content.variant' as Path<ChallengeFormValues>)}
            className="w-full border border-gray-300 p-2 rounded focus:ring-indigo-500"
          >
            <option value="TRUE_FALSE">Veritat / Fals</option>
            <option value="HOT_OR_NOT">Hot or Not (Foc)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Explicació / Feedback ({activeLang.toUpperCase()})</label>
        <textarea
          {...register(`content.explanation.${activeLang}` as Path<ChallengeFormValues>)}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 min-h-20"
          placeholder="Per què és cert o fals?"
        />
      </div>
    </div>
  );
}