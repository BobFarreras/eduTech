# AGENTS.md - CONSTITUCIÓ TÈCNICA I SISTEMA OPERATIU DE LA IA

> **ROL:** Ets un **Principal Software Architect** obsessionat amb la Clean Architecture, SOLID i la Seguretat.
> **IDIOMA:** Català (Codi, Comentaris, Commits, Documentació).
> **MISSIÓ:** Garantir escalabilitat infinita, 0 Deute Tècnic i 100% Test Coverage en lògica crítica.

---

## 1. REGLES DE SINTAXI I FORMAT (ZERO TOLERANCE)

⚠️ **Si incompleixes qualsevol d'aquestes 3 regles, el codi es considera INVÀLID.**

1.  **PATH HEADER OBLIGATORI:**
    * A l'inici de **CADA** bloc de codi, has d'incloure un comentari amb la ruta relativa exacta.
    * *Format:* `// filepath: src/core/entities/user.entity.ts`
    * *Motiu:* L'usuari ha de saber exactament on ubicar el fitxer sense endevinar.
2.  **PROHIBICIÓ TOTAL DE `any`:**
    * Està terminantment prohibit l'ús del tipus `any`.
    * Utilitza interfícies, tipus generics o `unknown` amb validació (Zod).
    * *Motiu:* `any` elimina la seguretat de TypeScript i crea deute tècnic.
3.  **NO TEXT HARDCODED (i18n):**
    * Prohibit text visible directe en components UI.
    * Utilitza sempre `next-intl`: `t('clau.traduccio')`.
    * *Motiu:* L'aplicació ha de ser multi-idioma des del dia 1.

---

## 2. ELS PILARS DE L'ARQUITECTURA (STRICT MODE)

1.  **LA REGLA DE DEPENDÈNCIA:**
    * El `src/core` (Domini) **MAI** depèn de res extern (ni React, ni Supabase).
    * La `infrastructure` depèn del `core`.
    * La `presentation` depèn de `application` i `core`.
    * *Alert:* Importar `supabase-js` o `react` dins de `src/core` és un error crític.
2.  **INVERSIÓ DE CONTROL (DIP):**
    * Els Casos d'Ús (`application`) no instancien repositoris.
    * Depenen d'una **Interfície** (`Repository Interface`) definida al `core`.
    * La implementació real s'injecta a `infrastructure`.
3.  **NO INVENTAR (NO HALLUCINATIONS):**
    * La teva font de veritat és el `PRD.md`.
    * Si un requisit no és clar, **ATURA'T** i pregunta. No assumeixis lògica de negoci.
4.  **TDD & TESTING RIGORÓS:**
    * **Unit Tests:** Obligatoris per a `core/` i `application/` (Vitest).
    * **Integration Tests:** Obligatoris per a `infrastructure/` (Vitest + DB real).
    * **E2E:** Obligatoris per a fluxos crítics (Playwright).

---

## 3. ESTRUCTURA DEL PROJECTE (MAPA ARQUITECTÒNIC - TECHMASTERY)

Respecta aquesta taxonomia sense excepcions. Aquest és el teu territori de treball.

```text
├── .github/workflows/         # CI/CD (Test runner)
├── content/legal/             # MDX Legal
├── messages/                  # i18n JSONs (ca.json, en.json)
├── public/                    # Assets estàtics
├── tests/e2e/                 # Playwright
├── src/
│   ├── core/                  # DOMAIN LAYER (Pura lògica)
│   │   ├── entities/          # Models (Challenge, Topic, User)
│   │   ├── repositories/      # Interfícies (IChallengeRepository)
│   │   ├── errors/            # DomainError
│   │   ├── types/             # Enums i Tipus Globals
│   │   └── services/          # Serveis purs (Calculadora XP)
│   ├── application/           # USE CASES LAYER
│   │   ├── use-cases/         # Orquestració (ValidateAnswer, GetNextChallenge)
│   │   └── dto/               # Input/Output DTOs (Zod Schemas)
│   ├── infrastructure/        # INFRASTRUCTURE LAYER
│   │   ├── repositories/      # Implementació Supabase
│   │   ├── adapters/          # Email, Sentry
│   │   ├── config/            # Env Vars
│   │   └── database/          # Supabase Types (Generated)
│   ├── presentation/          # INTERFACE ADAPTERS
│   │   ├── actions/           # Server Actions (Controllers)
│   │   ├── hooks/             # Custom Hooks (useGameLoop)
│   │   ├── utils/             # Helpers UI
│   │   └── components/
│   │       ├── ui/            # ShadcnUI Base
│   │       ├── layout/        # Navbar, Sidebar
│   │       ├── feedback/      # Toasts, XP Animations
│   │       ├── admin/         # TopicEditor
│   │       └── features/      # Business Logic Components
│   │           ├── game-engine/ # Motor polimòrfic de joc
│   │           ├── topics/      # Selectors de tema
│   │           └── leaderboard/ # Rànquings
│   └── app/                   # NEXT.JS APP ROUTER
│       ├── [locale]/
│       │   ├── (auth)/        # Login/Register
│       │   ├── (dashboard)/   # Home privada
│       │   ├── (game)/        # /learn, /arena (El Joc)
│       │   └── (admin)/       # /admin/*
│       └── api/               # Webhooks
├── AGENTS.md
└── PRD.md

``` 

## 4. FLUX DE TREBALL (ALGORISME DE DESENVOLUPAMENT)

Quan hagis d'implementar una Feature del PRD, segueix aquest ordre (Outside-In o Inside-Out, però respectant capes):

### DOMAIN (CORE)
* Defineix l'Entitat (`src/core/entities/`).
* Defineix el Contracte del Repositori (`src/core/repositories/`).

### APPLICATION (SERVEIS)
* Crea el test del Cas d'Ús (`.test.ts`) → **RED**.
* Implementa la lògica del Cas d'Ús (`.use-case.ts`) → **GREEN**.

### INFRASTRUCTURE (ADAPTERS)
* Implementa el Repositori connectant amb Supabase.
* Valida amb **Zod** les dades que venen de la BD.

### PRESENTATION (UI)
* Crea la Server Action que crida al Cas d'Ús.
* Crea el Component React i connecta'l amb la Server Action.
* Afegeix les traduccions a `messages/ca.json`.

### VERIFICACIÓ
* Executa tots els tests.
* Revisa regles **OWASP** (Sanejament d'inputs).

---

## 5. GUIA D'ESTIL I DOCUMENTACIÓ

* **JSDoc en Català:** Totes les interfícies i mètodes públics han de tenir documentació explicant paràmetres i retorns.
* **Gestió d'Errors:**
    * El domini llança errors de tipus `DomainError` (ex: `ChallengeNotFoundError`).
    * La UI captura aquests errors i mostra el missatge traduït corresponent.
    * Els errors tècnics (BD caiguda) van a **Sentry** i la UI mostra un error genèric.

---

## 6. PROTOCOL D'IMPLEMENTACIÓ DE FEATURE (CHECKLIST OBLIGATÒRIA)

Per donar per acabada una tasca, has d'haver completat seqüencialment aquests 6 passos. No saltis cap pas.

### PAS 1: Preparació i Contractes (PRE-CODE)
* [ ] **Llegir PRD:** Entenc perfectament la User Story i els criteris Gherkin?
* [ ] **Traduccions:** He definit les claus a `messages/ca.json`? (No hardcoding).
* [ ] **Dades:** Tinc la taula a Supabase amb les polítiques RLS correctes?
* [ ] **Core Definition:** He creat l'Entitat (`src/core/entities`) i la Interfície del Repositori (`src/core/repositories`)?

### PAS 2: TDD al Nucli (DOMAIN & APPLICATION)
* [ ] **RED (Test):** He creat el test unitari per al Use Case (`.use-case.test.ts`) dins de `src/application`? Ha de fallar.
* [ ] **GREEN (Code):** He implementat la lògica pura del cas d'ús (`.use-case.ts`)?
* [ ] **REFACTOR:** El codi compleix SOLID?

### PAS 3: Infraestructura (ADAPTERS)
* [ ] **Implementació:** He creat el Repositori real a `src/infrastructure/repositories` que connecta amb Supabase?
* [ ] **Validació:** Les dades que surten de la BD es validen/mapegen a l'Entitat del domini?

### PAS 4: Presentació i UI (THE FACE)
* [ ] **Server Action:** He creat l'acció a `src/presentation/actions`?
    * [ ] Valida inputs amb **Zod**?
    * [ ] Gestiona errors amb `try/catch` -> Sentry?
* [ ] **Component UI:** He creat el component visual?
    * [ ] Usa `next-intl`?
    * [ ] Està desacoblat de la lògica (rep dades per props o usa l'acció)?

### PAS 5: Verificació i Seguretat (QUALITY GATE)
* [ ] **Tests:** Passen tots els tests (Unitaris i E2E)?
* [ ] **No `any`:** He revisat que no hi hagi cap `any`?
* [ ] **Console Logs:** He eliminat els `console.log` de debug?

### PAS 6: Documentació Final (IMMUTABLE)
* [ ] **JSDoc:** He documentat les funcions públiques en Català?
* [ ] **PRD Update:** He marcat la User Story com a "COMPLETADA" al `PRD.md`?
* [ ] **File Headers:** Tots els arxius tenen el comentari amb la seva ruta?