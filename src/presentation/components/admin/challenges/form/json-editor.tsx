// filepath: src/presentation/components/admin/challenges/form/json-editor.tsx
import { useFormContext } from 'react-hook-form';
import { ChallengeFormValues } from './form-config';

export function JsonEditor() {
    const { watch, reset } = useFormContext<ChallengeFormValues>();

    const formValues = watch();
    const jsonString = JSON.stringify(formValues, null, 2);

    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        try {
            const parsed = JSON.parse(e.target.value);
            reset(parsed);
        } catch {
            // Silenciosament ignorem errors de parseig mentre s'escriu
        }
    };

    return (
        <div className="bg-slate-950 p-4 rounded-lg">
            <p className="text-gray-400 text-xs mb-2 font-mono">
                {/* CORRECCIÓ JSX COMMENT: Usar claus */}
                {/* Edita el JSON directament. Es sincronitza amb el visual. */}
                JSON MODE: Validació automàtica al desar.
            </p>
            <textarea
                className="w-full h-125 bg-transparent border-none text-green-400 font-mono text-sm focus:outline-none resize-none"
                value={jsonString}
                onChange={handleJsonChange}
                spellCheck={false}
            />
        </div>
    );
}