// filepath: src/presentation/components/admin/challenges/form/challenge-form-router.tsx
import {  Lang } from './form-config';

// Importem els editors existents
import { BinaryEditor } from './binary-editor';
import { CodeFixEditor } from './code-fix-editor';
import { QuizEditor } from './quiz-editor';
import { CtfEditor } from './ctf-editor'; // <--- NOU IMPORT

interface Props {
  type: string;
  activeLang: Lang;
}

export function ChallengeFormRouter({ type, activeLang }: Props) {
  
  switch (type) {
    case 'BINARY_DECISION':
      return <BinaryEditor activeLang={activeLang} />;
    
    case 'CODE_FIX':
      return <CodeFixEditor activeLang={activeLang} />;
    
    case 'QUIZ':
      return <QuizEditor activeLang={activeLang} />;

    case 'CTF': // <--- NOU CAS
      return <CtfEditor activeLang={activeLang} />;

    // --- CASOS PENDENTS (PLACEHOLDERS) ---
    // A mesura que creïs 'theory-editor.tsx', 'matching-editor.tsx', etc., els afegeixes aquí.
    
    case 'THEORY':
    case 'MATCHING':
    case 'TERMINAL':
    case 'LOGIC_ORDER':
      return <PlaceholderEditor type={type} />;
    
    default:
      return <PlaceholderEditor type={type} unknown />;
  }
}

// Un petit component auxiliar per no repetir el codi de "En construcció"
function PlaceholderEditor({ type, unknown = false }: { type: string, unknown?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-900/30 animate-in fade-in">
       <span className="text-3xl mb-2">{unknown ? '❓' : '🚧'}</span>
       <p className="text-sm text-gray-500 dark:text-gray-400">
         L'editor visual per a <strong>{type}</strong> {unknown ? 'és desconegut' : 'està en construcció'}.
       </p>
       <p className="text-xs text-indigo-500 mt-2 font-medium">
         Si us plau, utilitza la pestanya <strong>JSON</strong> per editar aquest contingut.
       </p>
    </div>
  );
}