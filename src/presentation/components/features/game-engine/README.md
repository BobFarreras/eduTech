// filepath: src/presentation/components/features/game-engine/README.md

# 🎮 Game Engine Components

Aquest directori conté el motor visual polimòrfic d'eduTech.
El sistema renderitza automàticament la interfície de joc correcta basant-se en l'entitat `Challenge`.

## 🧩 Structure

* **`ChallengeRenderer.tsx`**: El component "Director". Rep un `Challenge` i decideix quin component visual pintar (`switch(challenge.type)`).
* **`useGameSession.ts`**: Hook personalitzat que gestiona l'estat de la partida (punts, vides, progrés).

## 🎨 Game Modes (Vistes)

### 1. Quiz (`QuizView`)
* **Tipus:** `QUIZ`
* **Descripció:** Pregunta clàssica amb 4 opcions.
* **Interacció:** Click simple.

### 2. Code Fix (`CodeFixView`)
* **Tipus:** `CODE_FIX`
* **Descripció:** Mostra un codi trencat i 3 opcions de fragments per arreglar-lo.
* **Interacció:** Selecció de la peça correcta. Inclou visualització de diferències (Diff).

### 3. Matching (`MatchingView`)
* **Tipus:** `MATCHING`
* **Descripció:** Relacionar conceptes de la columna esquerra amb la dreta.
* **Interacció:** Click origen -> Click destí.

### 4. Terminal (`TerminalView`) (✨ NOU)
* **Tipus:** `TERMINAL`
* **Descripció:** Simulació realista d'una consola Linux/Docker.
* **Característiques:**
    * Prompt interactiu.
    * Validació de comandes (suporta àlies).
    * Historial de comandes (fletxa amunt/avall no suportat encara, però visualització sí).
    * Output simulat (stdout/stderr).

## 🛠️ Usage

```tsx
import { ChallengeRenderer } from './ChallengeRenderer';

// Dins d'una pàgina de joc
<ChallengeRenderer 
  challenge={currentChallenge} 
  onNext={(isCorrect) => handleProgression(isCorrect)} 
/>