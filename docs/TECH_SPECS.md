// filepath: docs/TECH_SPECS.md
# 📘 Especificacions Tècniques - eduTech

> **Estat:** WIP (Fase 6 Completada)
> **Stack:** Next.js 16, Supabase, React 19, TypeScript
> **Arquitectura:** Clean Architecture (Hexagonal)

---

## 1. Model de Dades (Supabase)

L'aplicació es basa en un esquema relacional fortament tipat.

### 1.1 Core (Contingut)
* **`topics`**: Categories d'aprenentatge.
    * `slug`: Identificador únic per a URLs (ex: `react-basics`).
    * `name_key`: Clau i18n per a traduccions.
    * `is_active`: Soft-delete per amagar temes.
* **`challenges`**: Reptes individuals.
    * `type`: Enum (`QUIZ`, `CODE_FIX`, etc.).
    * `content`: JSONB estricte validat per TypeScript en temps d'execució.
    * `difficulty_tier`: 1-10.

### 1.2 Gamification (Usuaris)
* **`profiles`**: Extensió de l'usuari (sense FK estricta durant Dev).
    * `total_xp`: Acumulat històric.
    * `current_level`: Calculat automàticament `(XP / 100) + 1`.
* **`user_progress`**: Registre immutable de reptes superats.
    * Clau única composta: `(user_id, challenge_id)` per evitar farmar XP repetida (encara que la UI ho permeti visualment, la BD ho frena o l'Upsert ho gestiona).

---

## 2. Lògica de Negoci (Domain Rules)

### 2.1 Motor de Joc (Game Loop)
El joc segueix un patró híbrid:
1.  **Càrrega (Server):** `GetNextChallengeUseCase` obté un *batch* de 5 reptes.
2.  **Joc (Client):** `GameArena` gestiona la navegació entre reptes sense recarregar (optimització UX).
3.  **Validació (Client/Server):**
    * Instantània (Visual): Al client per feedback ràpid.
    * Persistència (Seguretat): Al final de la sessió es crida `CompleteSessionUseCase`.

### 2.2 Sistema de Nivells
La fórmula actual és lineal (MVP):
```typescript
Level = floor(TotalXP / 100) + 1
```

## Sistema de Puntuació

- Cada repte atorga: **10 XP**
- Cada lliçó (batch de 3) atorga: **30 XP**

---

## 3. Arquitectura de Software

Seguim **Clean Architecture** de manera estricta:

### `src/core`
- Entitats i interfícies pures  
- No sap res de React ni Supabase  

### `src/application`
- Casos d’ús (verbs)
- Orquestra la lògica de negoci

---

### ✅ ACCIÓ REQUERIDA

1. Crea aquest fitxer al teu projecte.
2. A partir d’ara, cada vegada que tanquem una **Fase gran**, actualitzarem aquest document.

Això ens permet tenir una “foto” clara del sistema.

> Et sembla bé aquest nivell de detall o vols documentar també l’API dels UseCases?  
> Ex: `complete-session.use-case.ts`

---

### `src/infrastructure`
- Implementació real (Supabase)

Exemple:
- `supabase-user.repository.ts`

---

### `src/presentation`
- UI i Web

**Components:**
- `GameArena`
- `TopicCard`

**Actions (controladors segurs):**
- `submit-session.action.ts`

---

## 4. Guia de Desenvolupament (Dev Log)

### Com afegir un nou tipus de repte?

1. Afegir el tipus a l’Enum de PostgreSQL (`challenge_type`)
2. Actualitzar `ChallengeType` a  
   `src/core/entities/challenge.entity.ts`
3. Crear el component visual  
   Ex: `TerminalView.tsx`
4. Afegir el cas al `switch` de `GameArena.tsx`

---

## Testing

- **Unitari:** Obligatori per a Use Cases i Serveis (`src/core/services`)
- **Eina:** Vitest + Mocks de Repositoris
