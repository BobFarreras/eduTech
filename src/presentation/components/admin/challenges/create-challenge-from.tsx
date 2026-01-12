// filepath: src/presentation/components/admin/challenges/create-challenge-form.tsx
'use client';

import { useState, useTransition } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { createChallengeAction } from '@/presentation/actions/admin/challenge.actions';

// 1. EXPORTEM la interfície per poder-la usar als tests (Clean Arch)
export interface TopicOption {
  id: string;
  name: string;
}

interface CreateChallengeFormProps {
  topics: TopicOption[];
}

const ChallengeTypeEnum = z.enum(['QUIZ', 'CODE_FIX', 'TERMINAL', 'DRAG_DROP']);

// 2. ESQUEMA ROBUST:
// Eliminem 'invalid_type_error' que et donava problemes.
// Si valueAsNumber falla (NaN), el .min(1) ho atraparà igualment perquè NaN < 1.
const formSchema = z.object({
  topicId: z.string().min(1, "Has de seleccionar un tema"),
  difficultyTier: z.number()
    .min(1, "La dificultat és obligatòria i ha de ser mínim 1")
    .max(5, "Màxim 5"),
  type: ChallengeTypeEnum,
  question: z.string().min(5, "La pregunta ha de tenir mínim 5 caràcters"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateChallengeForm({ topics }: CreateChallengeFormProps) {
  const t = useTranslations('Admin.Challenges.form');
  const [isPending, startTransition] = useTransition();
  const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topicId: '',
      difficultyTier: 1,
      type: 'QUIZ',
      question: ''
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setServerMessage(null);

    const payload = {
      topicId: data.topicId,
      difficultyTier: data.difficultyTier,
      type: data.type,
      content: {
        question: data.question,
        options: ['Exemple A', 'Exemple B'],
        correctAnswerIndex: 0
      }
    };

    startTransition(async () => {
      // @ts-expect-error - Ignorem l'error de tipus estricte del DTO vs Form temporalment
      const result = await createChallengeAction(payload);

      if (result.success) {
        setServerMessage({ type: 'success', text: t('success') });
        reset({
            topicId: '',
            difficultyTier: 1,
            type: 'QUIZ',
            question: ''
        });
      } else {
        setServerMessage({ type: 'error', text: result.message || t('error') });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      
      {serverMessage && (
        <div className={`p-4 rounded-md ${serverMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {serverMessage.text}
        </div>
      )}

      {/* Camp: Tema */}
      <div className="flex flex-col gap-2">
        <label htmlFor="topicId" className="font-semibold text-gray-700">
          {t('topicLabel')}
        </label>
        <select
          id="topicId"
          {...register('topicId')}
          className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">{t('topicPlaceholder')}</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
        {errors.topicId && <span className="text-sm text-red-500">{errors.topicId.message}</span>}
      </div>

      {/* Camp: Dificultat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="difficultyTier" className="font-semibold text-gray-700">
            {t('difficultyLabel')}
          </label>
          <input
            type="number"
            id="difficultyTier"
            min={1}
            max={5}
            // valueAsNumber gestiona la conversió HTML -> Number
            {...register('difficultyTier', { valueAsNumber: true })}
            className="border border-gray-300 p-2 rounded-md"
          />
          {errors.difficultyTier && <span className="text-sm text-red-500">{errors.difficultyTier.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="type" className="font-semibold text-gray-700">
            {t('typeLabel')}
          </label>
          <select
            id="type"
            {...register('type')}
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value="QUIZ">Quiz</option>
            <option value="CODE_FIX">Code Fix</option>
            <option value="TERMINAL">Terminal</option>
          </select>
        </div>
      </div>

      {/* Camp: Pregunta */}
      <div className="flex flex-col gap-2">
        <label htmlFor="question" className="font-semibold text-gray-700">
          {t('questionLabel')}
        </label>
        <textarea
          id="question"
          rows={3}
          {...register('question')}
          className="border border-gray-300 p-2 rounded-md w-full"
        />
        {errors.question && <span className="text-sm text-red-500">{errors.question.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isPending ? t('saving') : t('submitButton')}
      </button>
    </form>
  );
}