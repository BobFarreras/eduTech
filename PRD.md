# 📄 PRODUCT REQUIREMENTS DOCUMENT (PRD) - TechMastery

| Atribut | Detall |
| :--- | :--- |
| **Projecte** | TechMastery Platform |
| **Versió** | 1.4.0 (Dynamic Architecture & Boss System) |
| **Estat** | **APROVAT** |
| **Objectiu** | Motor d'aprenentatge gamificat agnòstic al contingut i multi-idioma natiu. |

---

## 1. VISIÓ TÈCNICA I TECNOLOGIES

* **Stack Principal:** Next.js 16 (App Router), React 19, Supabase (PostgreSQL), TypeScript.
* **Internacionalització (i18n):** Arquitectura híbrida:
    * **UI:** Fitxers estàtics (`messages/*.json`) amb `next-intl` per a la interfície.
    * **Contingut:** Camps JSONB a la BD (`LocalizedText`) per a temes i reptes.
* **Filosofia:** *"Code Once, Serve Anything"*. El motor de joc no coneix temàtiques específiques; només sap renderitzar estructures de dades definides a la BD.

---

## 2. ARQUITECTURA (CLEAN ARCHITECTURE)

Seguim els principis de **Clean Architecture** i **Hexagonal Architecture** per garantir la independència de les regles de negoci.

### Estructura de Capes (`src/`)
1.  **Domain (`core/`):**
    * Entitats pures (`Topic`, `Challenge`).
    * Interfícies de Repositori (`ITopicRepository`).
    * **Regla:** Zero dependències externes (no sap què és React ni Supabase).
2.  **Application (`application/`):**
    * Casos d'Ús (`GetTopicPathUseCase`, `GetUserDashboardUseCase`).
    * DTOs.
    * **Regla:** Orquestra el flux de dades i aplica lògica de negoci.
3.  **Infrastructure (`infrastructure/`):**
    * Implementacions (`SupabaseTopicRepository`).
    * Mappers (`LevelNodeMapper`).
    * **Regla:** Connecta amb el món exterior (BD, APIs).
4.  **Presentation (`presentation/`):**
    * Components React, Pàgines Next.js.
    * **Regla:** Només visualització.

---

## 3. MODEL DE DADES (ESCALABILITAT INFINITA)

Eliminem Enums hardcoded i claus de traducció estàtiques per al contingut. Tot és dinàmic.

### 3.1 Entitat: `Topic` (La Categoria)
* **Taula:** `topics`
* **Descripció:** Defineix un curs. Permet crear nous cursos (ex: "Rust") des del Backoffice sense fer deploy.
* **Camps:**
    * `id` (uuid, PK).
    * `slug` (text, unique): Identificador per URL (ex: `docker-basics`).
    * `title` (JSONB): `{ "ca": "Fonaments", "en": "Basics" }` (Substitueix `name_key`).
    * `description` (JSONB): Descripció multi-idioma.
    * `icon_name` (text): Nom de la icona `lucide-react` (ex: `container`, `database`).
    * `color_theme` (text): Classe Tailwind (ex: `bg-blue-500`).
    * `is_active` (boolean): Soft-delete.

### 3.2 Entitat: `Challenge` (El Repte)
* **Taula:** `challenges`
* **Descripció:** Unitat mínima de joc.
* **Camps:**
    * `id` (uuid, PK).
    * `topic_id` (uuid, FK).
    * `difficulty_tier` (int): Nivell (1-100). Agrupa diversos reptes en un node visual.
    * `type` (enum): `QUIZ`, `CODE_FIX`, `TERMINAL`, `MATCHING`, `CTF`, `THEORY`.
    * `content` (JSONB): Dades específiques del repte (preguntes, codi, validacions).
    * **`map_config` (JSONB):** Configuració visual del node al mapa.
        * **Clau per als Bosses Dinàmics.**
        * Exemple:
          ```json
          {
            "isBoss": true,
            "bossIcon": "crown",
            "bossTitle": "milestones.architect",
            "bossColor": "bg-purple-600 shadow-purple-600/50"
          }
          ```

### 3.3 Entitat: `UserProgress`
* **Taula:** `user_progress`
* **Camps:** `user_id`, `challenge_id`, `completed_at`, `score`.

---

## 4. SISTEMA DE JOC (GAMEPLAY)

### 4.1 Path Logic (Orquestració)
El camí es genera dinàmicament agrupant reptes per `difficulty_tier`.

* **Desbloqueig:**
    * **Tier 1:** Obert per defecte.
    * **Tier N:** Es desbloqueja (Estat: `ACTIVE`) quan el Tier N-1 està `COMPLETED`.
* **Càlcul d'XP:** Basat en el total de reptes completats dins del tema.

### 4.2 Sistema de Bosses (Data-Driven)
Ja no hi ha lògica hardcoded ("cada 5 nivells és Boss").
* El Mapper (`LevelNodeMapper`) mira si algun repte del Tier té `map_config`.
* Si en té, el node es renderitza com a **BossMarker** (visualment diferent).
* Això permet crear cursos amb ritmes diferents (Bosses al nivell 10, 20, 30... o només al final).

### 4.3 Tipus de Reptes
1.  **QUIZ:** Preguntes tipus test.
2.  **CODE_FIX:** Corregir un snippet de codi.
3.  **TERMINAL:** Simulador de línia de comandes (validació d'inputs).
4.  **MATCHING:** Relacionar parelles de conceptes.
5.  **THEORY:** Blocs de lectura/codi sense avaluació (per introduir temes).
6.  **CTF (Capture The Flag):** Simulació d'incidents reals (logs, configs) per a nivells avançats.

---

## 5. EXPERIÈNCIA D'USUARI (UX)

### 5.1 Dashboard
* Mostra les targetes dels temes actius.
* Ús de `getLocalizedText` per mostrar títols en l'idioma de l'usuari, amb fallback automàtic.

### 5.2 Learning Map (El Mapa)
* **Orchestrator:** Component intel·ligent que decideix si mostrar ruta vertical (mòbil) o horitzontal (escriptori).
* **Feedback Visual:**
    * Nodes normals vs Boss Nodes.
    * Estats: Locked (Gris), Active (Pulse/Color), Completed (Verd/Or).

---

## 6. EINES D'ADMINISTRACIÓ (Backoffice)

### 6.1 Gestor de Reptes (`/sys-ops/challenges`)
* Editor visual per crear reptes.
* Previsualització en temps real.

### 6.2 Gestor de Temes (`/sys-ops/topics`)
* CRUD complet. Permet afegir icones i colors sense tocar codi CSS.

---

## 7. SEGURETAT I VALIDACIONS

1.  **Row Level Security (RLS):** Polítiques de Supabase per protegir les dades d'usuari.
2.  **Type Safety:** Ús estricte de TypeScript i DTOs per evitar errors de tipus "any".
3.  **Integració Contínua:** Tests amb Vitest per a Mappers i Use Cases.

---