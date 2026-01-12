// filepath: src/presentation/components/admin/challenges/challenge-editor.tsx
'use client';

import { useState, useTransition } from 'react';
import { useForm, FormProvider, SubmitHandler, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateChallengeSchema } from '@/application/dto/challenge.schema';
import { createChallengeAction, updateChallengeAction } from '@/presentation/actions/admin/challenge.actions';

// IMPORTS NOUS
import { INITIAL_VALUES, ChallengeFormValues, Lang } from './form/form-config';
import { JsonEditor } from './form/json-editor';
import { LivePreview } from './preview/live-preview';
import { ChallengeFormRouter } from './form/challenge-from.router'; // <--- EL ROUTER

interface Topic {
  id: string;
  name: string;
}

interface ChallengeEditorProps {
  topics: Topic[];
  initialData?: Partial<ChallengeFormValues>;
  challengeId?: string;
}

export function ChallengeEditor({ topics, initialData, challengeId }: ChallengeEditorProps) {
  const [mode, setMode] = useState<'VISUAL' | 'JSON'>('VISUAL');
  const [activeLang, setActiveLang] = useState<Lang>('ca');
  const [isPending, startTransition] = useTransition();

  const defaultValues = initialData 
    ? { ...INITIAL_VALUES, ...initialData } as ChallengeFormValues
    : INITIAL_VALUES;

  const methods = useForm<ChallengeFormValues>({
    resolver: zodResolver(CreateChallengeSchema) as Resolver<ChallengeFormValues>,
    defaultValues,
    mode: 'onChange' // Vital per al Live Preview
  });

  const { register, handleSubmit, watch, reset } = methods;
  const currentType = watch('type');

  const onSubmit: SubmitHandler<ChallengeFormValues> = (data) => {
    startTransition(async () => {
      const result = challengeId 
        ? await updateChallengeAction(challengeId, data)
        : await createChallengeAction(data);

      if (result?.success) {
        // Podries posar un Toast aquí
        alert(challengeId ? "✅ Actualitzat" : "🚀 Creat");
        if (!challengeId) reset(INITIAL_VALUES);
      } else {
        alert("❌ Error: " + JSON.stringify(result?.message || result?.errors));
      }
    });
  };

  // ESTILS
  const inputClass = "w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 transition-colors";
  const labelClass = "block mb-1 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide";

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-[calc(100vh-100px)] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        
        {/* === HEADER ULTRA-COMPACTE === */}
        <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
             {/* TOGGLE MODE */}
             <div className="flex bg-gray-100 dark:bg-slate-900 rounded-md p-0.5 border border-gray-200 dark:border-slate-800">
              <button type="button" onClick={() => setMode('VISUAL')} className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all ${mode === 'VISUAL' ? 'bg-white dark:bg-slate-800 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}>VISUAL</button>
              <button type="button" onClick={() => setMode('JSON')} className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all ${mode === 'JSON' ? 'bg-white dark:bg-slate-800 shadow text-emerald-600 dark:text-emerald-400' : 'text-gray-500'}`}>JSON</button>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-slate-700"></div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 hidden sm:inline">
              {challengeId ? 'Edit Mode' : 'Create Mode'}
            </span>
          </div>
          
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-md hover:opacity-80 transition-all disabled:opacity-50"
          >
            {isPending ? 'Saving...' : (challengeId ? 'Update' : 'Create')}
          </button>
        </div>

        {/* === MAIN LAYOUT === */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* ESQUERRA: EDITOR */}
          <div className="lg:col-span-7 overflow-y-auto p-0 border-r border-gray-200 dark:border-slate-800 custom-scrollbar">
            <div className="p-6 space-y-6">
                
                {/* 1. CONFIG GLOBAL (Compacta) */}
                <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50/50 dark:bg-slate-900/50 rounded-lg border border-gray-100 dark:border-slate-800/50">
                  <div>
                    <label className={labelClass}>Topic</label>
                    <select {...register('topicId')} className={inputClass}>
                      <option value="">...</option>
                      {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Tipus</label>
                    <select {...register('type')} className={inputClass}>
                      <option value="BINARY_DECISION">Binary</option>
                      <option value="QUIZ">Quiz</option>
                      <option value="CODE_FIX">Code Fix</option>
                      <option value="MATCHING">Matching</option>
                      <option value="TERMINAL">Terminal</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Lvl</label>
                    <input type="number" {...register('difficultyTier')} className={inputClass} min={1} max={10} />
                  </div>
                </div>

                {/* 2. EDITOR DE CONTINGUT */}
                {mode === 'JSON' ? (
                  <JsonEditor />
                ) : (
                  <div className="space-y-4">
                    {/* TABS IDIOMA */}
                    <div className="flex gap-1 border-b border-gray-100 dark:border-slate-800 pb-1">
                      {(['ca', 'es', 'en'] as Lang[]).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setActiveLang(lang)}
                          className={`px-3 py-1 text-[10px] font-bold uppercase rounded-t-md transition-all ${
                            activeLang === lang 
                              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/10' 
                              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>

                    {/* ROUTER DINÀMIC */}
                    <ChallengeFormRouter type={currentType} activeLang={activeLang} />
                  </div>
                )}
            </div>
          </div>

          {/* DRETA: PREVIEW */}
          <div className="lg:col-span-5 bg-gray-100 dark:bg-black border-l border-gray-200 dark:border-slate-800 hidden lg:block overflow-hidden relative">
             <div className="absolute inset-0 flex items-center justify-center">
                <LivePreview activeLang={activeLang} />
             </div>
          </div>

        </div>
      </form>
    </FormProvider>
  );
}