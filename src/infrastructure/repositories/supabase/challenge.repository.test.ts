// filepath: src/infrastructure/repositories/supabase/challenge.repository.test.ts
import { describe, it, expect, vi } from 'vitest';
import { SupabaseChallengeRepository } from './challenge.repository';
import { QuizContent } from '@/core/entities/challenges/challenge.entity';
// Importem el client "RAW" de l'SDK oficial, no el nostre wrapper de Next.js
import { createClient as createRawSupabaseClient } from '@supabase/supabase-js';

// --- 1. CONFIGURACIÓ DE L'ENTORN DE TEST ---

// Necessitem l'URL i la Key. En test, solem usar la SERVICE_ROLE_KEY per saltar-nos les RLS i poder crear/esborrar dades lliurement.
// Si no tens SERVICE_ROLE_KEY al .env.test, usa l'ANON_KEY, però assegura't que les RLS permeten escriptura.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.test');
}

// Creem un client real que funciona en Node (sense cookies)
const testClient = createRawSupabaseClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false, // No volem guardar sessió en disc durant els tests
  }
});

// --- 2. MOCK MÀGIC (DEPENDENCY INJECTION) ---
// Aquí diem: "Quan algú importi '@/infrastructure/utils/supabase/server',
// NO executis el codi real (que peta per les cookies).
// Retorna aquest objecte en el seu lloc."
vi.mock('@/infrastructure/utils/supabase/server', () => ({
  createClient: async () => testClient
}));

// --- 3. EL TEST ---

describe('SupabaseChallengeRepository (REAL DB INTEGRATION)', () => {
  // El repositori farà servir internament el nostre 'testClient' gràcies al mock
  const repository = new SupabaseChallengeRepository();

  it('should store and retrieve a localized JSONB challenge correctly', async () => {
    // A. SETUP: Creem les dades usant el client de test directament
    const topicId = '11111111-1111-4111-8111-111111111111';
    const challengeId = '22222222-2222-4222-8222-222222222222';
    const testSlug = 'integration-test-topic'; // Constant per evitar typos
    const userId = 'user-test-123';

    // 🔥 NETEJA AGRESSIVA (Idempotència)
    // Esborrem primer pel conflicte únic (slug) i després per ID.
    // Això garanteix que la taula està neta abans de començar, passi el que passi.
    await testClient.from('challenges').delete().eq('id', challengeId);
    await testClient.from('topics').delete().eq('slug', testSlug);
    await testClient.from('topics').delete().eq('id', topicId);

    // Crear Tema
    const { error: topicError } = await testClient.from('topics').insert({
      id: topicId,
      slug: 'integration-test-topic',
      name_key: 'test',
      icon_name: 'test',
      color_theme: 'red',
      is_active: true
    });
    if (topicError) throw new Error(`Error creating topic: ${topicError.message}`);

    // Crear Repte
    const { error: challengeError } = await testClient.from('challenges').insert({
      id: challengeId,
      topic_id: topicId,
      difficulty_tier: 1,
      type: 'QUIZ',
      content: {
        question: { en: 'Hello?', ca: 'Hola?' },
        explanation: { en: 'Yes', ca: 'Si' },
        options: [{ id: '1', text: { en: 'A', ca: 'A' } }],
        correctOptionIndex: 0
      },
      created_at: new Date().toISOString()
    });
    if (challengeError) throw new Error(`Error creating challenge: ${challengeError.message}`);

    // B. ACT: Provem el Repositori
    // Aquesta crida internament farà `await createClient()` que retornarà el nostre `testClient`
    const result = await repository.findNextForUser(topicId, userId, 'en', 1);

    // C. ASSERT
    expect(result).toHaveLength(1);
    const challenge = result[0];
    const content = challenge.content as QuizContent;

    expect(challenge.id).toBe(challengeId);
    expect(content.question).toBe('Hello?');

    // D. CLEANUP
    await testClient.from('challenges').delete().eq('id', challengeId);
    await testClient.from('topics').delete().eq('id', topicId);
  });
});