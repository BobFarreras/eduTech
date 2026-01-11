// filepath: src/presentation/components/features/game-engine/README.md

# 🎮 Game Engine & Challenge System

Aquest directori conté el nucli visual polimòrfic d'`eduTech`. 
El sistema implementa el patró **Strategy/Factory** a nivell de UI per renderitzar automàticament la interfície de joc correcta basant-se en l'entitat `Challenge`.

## 🏗️ Arquitectura i Estructura

El motor està dissenyat seguint **Clean Architecture** i **Atomic Design**. Els components visuals són "tontos" (Presentational) i reben tota la lògica via props des del `ChallengeRenderer`.

```text
src/presentation/components/features/game-engine/
├── ChallengeRenderer.tsx       # 🚦 DIRECTOR: Switch principal (Entry Point)
├── useGameSession.ts           # 🧠 HOOK: Gestió d'estat (Vides, Punts, Streak)
│
├── quiz/                       # 🧠 Mode: QUIZ
│   └── QuizView.tsx
│
├── code-fix/                   # 🛠️ Mode: CODE_FIX (IDE Simulator)
│   ├── CodeFixView.tsx         # Layout Principal
│   ├── CodeWindow.tsx          # Editor visual (VSCode style)
│   ├── SolutionDeck.tsx        # Graella d'opcions responsive
│   └── HintPanel.tsx           # Sistema de pistes
│
├── terminal/                   # 💻 Mode: TERMINAL (Linux Sim)
│   └── TerminalView.tsx
│
└── matching/                   # 🧩 Mode: MATCHING
    └── MatchingView.tsx
```

# 🎨 Game Modes (Vistes Polimòrfiques)

Tots els modes consumeixen les definicions de tipus situades a `@/core/entities/challenges`.

---

## 1. Quiz (`QuizView`)

**Tipus:** `QUIZ`

**Objectiu:**  
Validar coneixement teòric ràpid.

**UI:**  
- Targeta central amb pregunta  
- Graella de 4 botons  
- Feedback immediat  

---

## 2. Code Fix (`CodeFixView`) ✨ *REFACTORITZAT*

**Tipus:** `CODE_FIX`

**Objectiu:**  
Depuració i lectura de codi.

**UI (IDE Style):**
- Simulació fidel d’un editor de codi (estil VSCode) amb pestanyes i números de línia  
- *Syntax Highlighting* personalitzat per a JS / React  
- Botó **RUN CODE** integrat al footer de l’editor per millorar l’UX en dispositius mòbils  
- Sistema `SolutionDeck` *responsive* que gestiona l’overflow de text amb `break-all`  

---

## 3. Terminal (`TerminalView`) ✨ *NOU*

**Tipus:** `TERMINAL`

**Objectiu:**  
Ensenyar comandes CLI (Bash / Git / Docker) en un entorn segur.

**UI:**
- Consola fosca amb *prompt* interactiu  
- *Parsing* de comandes reals (suporta flags i arguments)  
- Feedback visual d’`stdout` i `stderr`  

---

## 4. Matching (`MatchingView`)

**Tipus:** `MATCHING`

**Objectiu:**  
Relacionar conceptes (ex: `HTML` ↔ `Estructura`).

**UI:**  
- Dues columnes connectables  
- Interacció via *Drag & Drop* o *Click-to-match*  

---

## 5. Logic Order (`LogicOrderView`) 🚧 *WIP*

**Tipus:** `LOGIC_ORDER`

**Objectiu:**  
Ordenar passos d’un procés (ex: Cicle de vida de Docker).

**UI:**  
- Llista reordenable (*Drag & Drop*)  

---

# 🛠️ Implementació (Usage)

El component **`ChallengeRenderer`** és l’únic punt d’entrada necessari per a qualsevol pàgina (`page.tsx`).

```ts
import { ChallengeRenderer } from '@/presentation/components/features/game-engine/ChallengeRenderer';
import { Challenge } from '@/core/entities/challenges';

interface GamePageProps {
  challenge: Challenge;
}

export default function GamePage({ challenge }: GamePageProps) {
  // Lògica de progrés
  const handleNext = (isCorrect: boolean) => {
    if (isCorrect) {
      // Server Action: saveProgress()
      // Router: nextLevel()
    } else {
      // UI: Show error toast / Lose Life
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <ChallengeRenderer 
        challenge={challenge} 
        onNext={handleNext} 
      />
    </div>
  );
}
