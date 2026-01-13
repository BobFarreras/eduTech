// filepath: scripts/seed-leaderboard.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variables d'entorn
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Error: Falten les variables d\'entorn NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

// Creem client amb permisos d'ADMIN (Service Role)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const ADJECTIVES = ['Super', 'Cyber', 'Mega', 'Tech', 'Quantum', 'Binary', 'Digital', 'Logic', 'Neural', 'Pixel'];
const NOUNS = ['Coder', 'Hacker', 'Ninja', 'Wizard', 'Guru', 'Master', 'Bot', 'Surfer', 'Architect', 'Pilot'];

function generateRandomName() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 999);
  return `${adj}${noun}${num}`;
}

async function seed() {
  console.log('🌱 Iniciant sembra de la base de dades (Seeding)...');

  for (let i = 0; i < 50; i++) {
    const email = `student${Date.now()}_${i}@test.edutech.cat`;
    const password = 'Password123!';
    const fakeName = generateRandomName();
    const fakeXP = Math.floor(Math.random() * 10000); // Entre 0 i 10.000 XP
    const fakeLevel = Math.floor(fakeXP / 1000) + 1;

    // 1. Crear l'usuari d'Autenticació (Això dispararà el trigger handle_new_user)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: fakeName },
      email_confirm: true // Confirmem directament
    });

    if (authError) {
      console.error(`❌ Error creant usuari ${i}:`, authError.message);
      continue;
    }

    const userId = authData.user.id;

    // 2. Simular progrés (Actualitzar XP)
    // Com que el trigger ja ha creat el perfil amb 0 XP, ara li fem un update
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        total_xp: fakeXP,
        current_level: fakeLevel,
        username: fakeName // Forcem el nom generat
      })
      .eq('id', userId);

    if (updateError) {
      console.error(`⚠️ Error actualitzant XP per ${userId}:`, updateError.message);
    } else {
      console.log(`✅ Creat: ${fakeName} [Lvl ${fakeLevel} - ${fakeXP} XP]`);
    }
  }

  console.log('🏁 Procés finalitzat. Ara tens un Leaderboard viu!');
}

seed();