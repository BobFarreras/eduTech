// filepath: src/infrastructure/repositories/supabase/challenge.repository.real.test.ts

// --- 1. CARREGAR VARIABLES D'ENTORN MANUALMENT ---
import { config } from 'dotenv';
config({ path: '.env.test' });

import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
// Importem el client 'vanilla' de la llibreria oficial (el que no usa cookies)
import { createClient as createVanillaClient } from '@supabase/supabase-js'; 
import { SupabaseChallengeRepository } from './challenge.repository';
import { QuizContent } from '@/core/entities/challenge.entity';

// --- CONSTANTS ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;


const shouldRun = SUPABASE_URL && SERVICE_ROLE_KEY;

// --- 2. MOCK DEL CONTEXT DE NEXT.JS (La solució a l'error de cookies) ---
// Interceptem la importació de 'utils/supabase/server'.
// En lloc d'usar cookies(), retornem un client estàndard connectat a local.
vi.mock('@/infrastructure/utils/supabase/server', () => {
  return {
    createClient: async () => {
      // Retornem un client REAL, però creat de forma "tonta" (sense cookies).
      // Usem la clau SERVICE_ROLE per evitar problemes d'autenticació en el test d'integració,
      // ja que en aquest test volem validar SQL i Mapeig, no Auth.
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error("Falten variables d'entorn al Mock");
      }
      return createVanillaClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { persistSession: false } }
      );
    }
  };
});

describe('SupabaseChallengeRepository (REAL DB INTEGRATION)', () => {
  if (!shouldRun) {
    it.skip('Skipping integration tests: Missing keys', () => {});
    return;
  }

  // Client ADMIN per preparar l'escenari
  const adminClient = createVanillaClient(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  let repository: SupabaseChallengeRepository;
  
  const TEST_TOPIC_ID = '11111111-1111-1111-1111-111111111111';
  const TEST_CHALLENGE_ID = '22222222-2222-2222-2222-222222222222';
  const TEST_USER_ID = '33333333-3333-3333-3333-333333333333';

  beforeAll(async () => {
    // Setup Topic
    await adminClient.from('topics').upsert({
      id: TEST_TOPIC_ID,
      slug: 'integration-test-topic',
      name_key: 'topic.test',
      icon_name: 'test-icon',
      color_theme: 'bg-test',
      active: true
    });
  });

  beforeEach(async () => {
    // Inicialitzem el repo (que ara usarà el nostre Mock internament)
    repository = new SupabaseChallengeRepository();
    // Neteja
    await adminClient.from('challenges').delete().eq('id', TEST_CHALLENGE_ID);
  });

  it('should store and retrieve a localized JSONB challenge correctly', async () => {
    // ARRANGE: Inserim dades REALS
    const { error: insertError } = await adminClient.from('challenges').insert({
      id: TEST_CHALLENGE_ID,
      topic_id: TEST_TOPIC_ID,
      difficulty_tier: 1,
      type: 'QUIZ',
      content: {
        question: { ca: "Hola Món", en: "Hello World" },
        explanation: { ca: "Prova", en: "Test" },
        correctOptionIndex: 0,
        options: [
          { id: "opt1", text: { ca: "Opció A", en: "Option A" } }
        ]
      }
    });

    if (insertError) throw new Error(`Insert failed: ${insertError.message}`);

    // ACT: El Repositori fa la consulta REAL a Postgres
    const result = await repository.findNextForUser(TEST_TOPIC_ID, TEST_USER_ID, 'ca');

    // ASSERT
    expect(result).toHaveLength(1);
    const content = result[0].content as QuizContent;
    
    // Si això passa, vol dir que hem llegit JSONB real de la BD
    expect(content.question).toBe("Hola Món"); 
    expect(content.options[0].text).toBe("Opció A");
  });
});