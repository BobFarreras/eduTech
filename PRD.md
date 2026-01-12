# PRODUCT REQUIREMENTS DOCUMENT (PRD) - TechMastery

| Atribut | Detall |
| :--- | :--- |
| **Projecte** | TechMastery Platform |
| **Versió** | 1.3.0 (Dynamic Topic Architecture) |
| **Estat** | APROVAT |
| **Objectiu** | Crear un motor de joc agnòstic al contingut. |

---

## 1. VISIÓ TÈCNICA I TECNOLOGIES

* **Stack:** Next.js 16, Supabase, React 19, i18n (`next-intl`).
* **Filosofia:** "Code Once, Serve Anything". El codi no sap què és "React", només sap renderitzar "Temes" i "Reptes".

---

## 2. ARQUITECTURA (CLEAN ARCH)

Mantenim l'estructura `src/` definida a `AGENTS.md`. La clau aquí és que el `Core` tractarà els `Topics` com a entitats dinàmiques.

---

## 3. MODEL DE DADES (ESCALABILITAT INFINITA)

Aquí està el secret per no tenir deute tècnic. Eliminem els Enums hardcoded per als temes.

### 3.1 Entitat: `Topic` (La Categoria)
Aquesta taula permet afegir "Supabase", "Python", "Vercel" sense tocar codi.

* **Taula:** `topics`
* **Camps:**
    * `id` (uuid, PK).
    * `slug` (text, unique): 'python', 'react', 'servers-basics'. (Per a URLs netes: `/learn/python`).
    * `name_key` (text): Clau de traducció o text directe ('topic.python.title').
    * `icon_name` (text): Nom de la icona (ex: 'brand-python', 'server', 'git-merge'). El frontend mapeja això dinàmicament.
    * `color_theme` (text): Hex o Tailwind class ('bg-blue-500') per diferenciar temes visuals.
    * `parent_topic_id` (uuid, opcional): Per crear subtemes (ex: 'React' dins de 'Frontend').

// filepath: docs/DATA_MODEL.md

## 3.2 Entitat: `Challenge` (El Repte)

* **Taula:** `challenges`
* **Camps:**
    * `id` (uuid, PK)
    * `topic_id` (uuid, FK -> topics.id)
    * `difficulty_tier` (int): 1-10
    * `type` (enum): 'QUIZ', 'CODE_FIX', 'TERMINAL'
    * `content` (JSONB): Estructura i18n rica.

#### Esquema JSONB per a `content` (Tipus QUIZ):

```json
{
  "question": {
    "ca": "Pregunta en Català?",
    "en": "Question in English?",
    "es": "Pregunta en Español?"
  },
  "explanation": {
    "ca": "Explicació...",
    "en": "Explanation...",
    "es": "Explicación..."
  },
  "options": [
    {
      "id": "uuid-v4",
      "text": {
        "ca": "Opció A",
        "en": "Option A",
        "es": "Opción A"
      }
    }
  ],
  "correctOptionIndex": 0
}
```

### 3.3 Entitat: `UserProfile` (Matriu d'Habilitats Dinàmica)
El progrés es guarda referenciant l'ID del tema.

* **Taula:** `profiles`
* **Camps:**
    * `skills_matrix` (JSONB):
        ```json
        {
          "uuid-del-tema-python": { "level": 3, "xp": 450 },
          "uuid-del-tema-react": { "level": 1, "xp": 50 }
        }
        ```
    * *Nota:* Usem UUIDs com a claus per si canviem el nom del tema ('React.js' -> 'React 19') no perdem el progrés.

---
### 4.3 Sistema de Progressió (Path Logic)
El progrés és seqüencial i basat en competència, no en XP acumulada.

**Regla de Desbloqueig (Unlock):**
- **Nivell 1:** Sempre desbloquejat per defecte.
- **Nivell N:** Es desbloqueja automàticament quan l'usuari ha completat el **Nivell N-1**.

**Definició de "Nivell Completat":**
Un nivell es considera completat quan l'usuari ha superat amb èxit un % significatiu dels reptes únics d'aquell nivell (per exemple, el 80% o tots).

**XP (Experiència):**
L'XP és una mètrica global per a gamificació (rànquings) i no afecta al desbloqueig de rutes.

### 4.4 Tipus de Reptes (Game Modes)
El sistema ha de suportar múltiples modalitats de joc. L'arquitectura ha de permetre afegir-ne de nous fàcilment.

**Tipus Suportats (MVP):**
1.  **QUIZ:** Pregunta tipus test (1 correcta de N opcions).
2.  **CODE_FILL:** Emplenar forats en un fragment de codi.
3.  **MATCHING:** Relacionar conceptes (Ex: 'useState' -> 'Hook d'Estat').

### 4.5 Feedback Visual al Mapa
- **Current Position:** L'últim nivell completat ha de mostrar un indicador "Estàs aquí" (Avatar/Icona).
- **Next Up:** El següent nivell desbloquejat ha de tenir una animació de "pols" o "ones" per convidar a jugar.
- **Game Icon:** Cada node ha de mostrar una icona representativa del tipus de joc predominant en aquell nivell.

---

## 4. USER STORIES (GESTIÓ DINÀMICA)

### Feature [ADMIN-02]: Gestor de Temes (CMS)
**User Story:**
> **Com a** creador de contingut,
> **Vull** crear un nou tema anomenat "Supabase" des del panell d'administració, assignar-li una icona verda i començar a afegir preguntes,
> **Per tal de** llançar un curs nou sense necessitar un programador que faci un "deploy".

**Requeriments:**
1.  Interfície `/admin/topics/new`.
2.  Pujada d'icona o selecció de llibreria (Lucide/React Icons).
3.  Assignació de color.

### Feature [GAME-03]: El "Motor de Temes" (Frontend)
**User Story:**
> **Com a** sistema,
> **He de** renderitzar la llista de temes disponibles basant-me en el que hi ha a la base de dades,
> **Per tal de** que si demà s'afegeix "Rust", aparegui automàticament al Dashboard.

**Implementació:**
* Component `<TopicGrid />` que fa un `map()` sobre la consulta `SELECT * FROM topics WHERE active = true`.

---

## 5. VALIDACIONS I SEGURETAT

1.  **Integritat Referencial:** Si esborres un Tema, què passa amb els reptes? (Configuració `ON DELETE CASCADE` o soft-delete `active: false`). Recomanem `active: false` per no perdre històric.
2.  **Validació de JSON:** Encara que els temes siguin dinàmics, l'estructura del `content` dins de `challenges` ha de seguir un esquema Zod estricte segons el `type` de repte.

---

## 6. EXPERIÈNCIA D'USUARI (UX FLOW)

### 6.2 Learning Path (Topic View)
* Vista vertical amb "scroll infinit" cap amunt o avall.
* **Nodes del Camí:**
    * **Nivells Normals:** Cercles amb icona del tipus predominant (Quiz, Codi, Tutorial).
    * **Nivells Boss (Milestones):** * Apareixen cada X nivells (Configurable: Tiers 3, 5, 10...).
        * Visualment distintius (més grans, amb vora animada o color especial).
        * Representen una fita de coneixement.
* **Estats dels Nodes:**
    * 🔒 **Locked:** Gris, no interactuable.
    * ▶️ **Active:** Color, amb efecte "pulse". És el següent repte a fer.
    * ✅ **Completed:** Color sòlid + Checkmark. Rejugable.
...

### 6.3 Game Mode
* Interfície immersiva (sense header/footer de navegació).
* Feedback immediat.