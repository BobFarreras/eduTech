import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// En la sintaxi moderna (ESM), __dirname no existeix per defecte,
// així que el creem nosaltres manualment:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// DEFINICIÓ DE L'ARQUITECTURA (TECHMASTERY)
// ==========================================

const structure = [
  // --- ARREL I CONFIGURACIÓ ---
  '.github/workflows',
  '.vscode',
  'content/legal',
  'messages',
  'public/images/badges',
  'public/images/topics',
  'tests/e2e',

  // --- CAPA DE DOMINI (CORE) ---
  'src/core/entities',
  'src/core/repositories',
  'src/core/errors',
  'src/core/types',
  'src/core/services',

  // --- CAPA D'APLICACIÓ (USE CASES) ---
  'src/application/use-cases/auth',
  'src/application/use-cases/challenges',
  'src/application/use-cases/topics',
  'src/application/use-cases/gamification',
  'src/application/dto',

  // --- CAPA D'INFRAESTRUCTURA (ADAPTERS) ---
  'src/infrastructure/repositories/supabase',
  'src/infrastructure/adapters',
  'src/infrastructure/config',
  'src/infrastructure/database',

  // --- CAPA DE PRESENTACIÓ (UI & ACTIONS) ---
  'src/presentation/actions',
  'src/presentation/hooks',
  'src/presentation/utils',
  
  // Components UI
  'src/presentation/components/ui',
  'src/presentation/components/layout',
  'src/presentation/components/feedback',
  
  // Components de Features
  'src/presentation/components/features/auth',
  'src/presentation/components/features/topics',
  'src/presentation/components/features/leaderboard',
  'src/presentation/components/features/game-engine',
  'src/presentation/components/features/game-engine/challenges',
  
  // Components d'Administració
  'src/presentation/components/admin',

  // --- NEXT.JS APP ROUTER ---
  'src/app/[locale]/api/webhooks',
  'src/app/[locale]/(auth)',
  'src/app/[locale]/(dashboard)',
  'src/app/[locale]/(game)/learn',
  'src/app/[locale]/(game)/arena',
  'src/app/[locale]/(admin)/admin/topics',
  'src/app/[locale]/(admin)/admin/users',
];

const filesToCreate = [
  {
    path: 'messages/ca.json',
    content: `{
  "app": { "name": "TechMastery" },
  "game": { "start": "Comença", "check": "Comprovar" }
}`
  },
  {
    path: 'messages/en.json',
    content: `{
  "app": { "name": "TechMastery" },
  "game": { "start": "Start", "check": "Check" }
}`
  },
  {
    path: 'src/core/README.md',
    content: `# Core Layer (Domini)
Aquesta capa conté les regles de negoci pures del joc.
⚠️ NO importis res de React, Next.js o Supabase aquí.`
  },
  {
    path: 'src/application/README.md',
    content: `# Application Layer (Casos d'Ús)
Aquí resideix l'orquestració de l'aplicació.`
  },
  {
    path: 'src/presentation/components/features/game-engine/README.md',
    content: `# Game Engine Components
Components polimòrfics per a Quiz, Terminal, etc.`
  },
  {
    path: 'src/app/globals.css',
    content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;`
  }
];

console.log('🚀 Iniciant creació d\'estructura Enterprise (ESM)...\n');

// 1. CREACIÓ DE CARPETES
structure.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Carpeta creada: ${dir}`);
  }
});

// 2. CREACIÓ D'ARXIUS BASE
filesToCreate.forEach(file => {
  const fullPath = path.join(__dirname, file.path);
  if (!fs.existsSync(fullPath)) {
    const dirName = path.dirname(fullPath);
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }
    fs.writeFileSync(fullPath, file.content);
    console.log(`📄 Fitxer creat: ${file.path}`);
  }
});

console.log('\n🎉 ESTRUCTURA COMPLETADA!');