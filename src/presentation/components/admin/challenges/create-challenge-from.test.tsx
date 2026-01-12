// filepath: src/presentation/components/admin/challenges/create-challenge-form.test.tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// IMPORTEM LA INTERFÍCIE AQUÍ
import { CreateChallengeForm, TopicOption } from './create-challenge-from';
import * as actions from '@/presentation/actions/admin/challenge.actions';
import { NextIntlClientProvider } from 'next-intl';

const messages = {
  Admin: {
    Challenges: {
      title: "Crear Nou Repte",
      form: {
        topicLabel: "Tema",
        topicPlaceholder: "Selecciona un tema...",
        difficultyLabel: "Dificultat",
        typeLabel: "Tipus",
        questionLabel: "Pregunta",
        submitButton: "Crear",
        saving: "Guardant...",
        success: "Èxit",
        error: "Error"
      }
    }
  }
};

const mockCreateAction = vi.spyOn(actions, 'createChallengeAction');

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextIntlClientProvider locale="ca" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};

describe('CreateChallengeForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hauria de renderitzar tots els camps del formulari', () => {
    render(<CreateChallengeForm topics={[]} />, { wrapper: TestWrapper });

    expect(screen.getByLabelText(/Tema/i)).toBeDefined();
    expect(screen.getByLabelText(/Dificultat/i)).toBeDefined();
    expect(screen.getByLabelText(/Tipus/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Crear/i })).toBeDefined();
  });

  it('hauria de mostrar errors de validació client-side si es deixa buit', async () => {
    render(<CreateChallengeForm topics={[]} />, { wrapper: TestWrapper });

    const submitBtn = screen.getByRole('button', { name: /Crear/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
       expect(mockCreateAction).not.toHaveBeenCalled();
    });
  });

  it('hauria de cridar a la Server Action amb les dades correctes', async () => {
    mockCreateAction.mockResolvedValue({ success: true, message: 'Creat' });

    // FIX NO-ANY: Definim les dades tipades segons el contracte del component.
    // Si tenim camps extra (com createdAt) però volem complir la interfície, 
    // podem fer un cast a 'unknown' i després a 'TopicOption[]', però el més net 
    // en tests és passar el que es necessita.
    const mockTopics: TopicOption[] = [
      { id: 'topic-1', name: 'React' }
    ];
    
    render(<CreateChallengeForm topics={mockTopics} />, { wrapper: TestWrapper });

    // Omplim el formulari
    fireEvent.change(screen.getByLabelText(/Tema/i), { target: { value: 'topic-1' } });
    fireEvent.change(screen.getByLabelText(/Dificultat/i), { target: { value: 2 } }); // Note: value can be number in fireEvent for strict inputs
    fireEvent.change(screen.getByLabelText(/Tipus/i), { target: { value: 'QUIZ' } });
    fireEvent.change(screen.getByLabelText(/Pregunta/i), { target: { value: 'Què és un Hook?' } });

    const submitBtn = screen.getByRole('button', { name: /Crear/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockCreateAction).toHaveBeenCalled();
      const calledArg = mockCreateAction.mock.calls[0][0];
      expect(calledArg.topicId).toBe('topic-1');
      expect(calledArg.difficultyTier).toBe(2);
    });
  });
});