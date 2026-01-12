// filepath: src/test/setup.ts
import dotenv from 'dotenv';
import path from 'path';

// Carreguem explícitament el fitxer .env.test
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

// Opcional: Si no troba el .env.test, prova amb .env.local per desenvolupament local
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
}

console.log('🧪 Test Environment Loaded. Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Found' : '❌ Missing');