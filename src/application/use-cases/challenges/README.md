// filepath: src/application/use-cases/challenges/README.md

# ⚔️ Challenges Module (Application Layer)

Aquest mòdul és el cor de l'aplicació. Gestiona la recuperació, orquestració i lògica de negoci dels reptes educatius.

## 🧠 Lògica de Negoci

### Estructura del Contingut (Polimorfisme)
El Domini converteix el JSONB de la base de dades en estructures de dades tipades estrictament:
* **`QUIZ`**: Pregunta + Opcions + Solució.
* **`CODE_FIX`**: Editor de codi + Snippets de reparació.
* **`TERMINAL`**: Simulador de consola + Validació de comandes.
* **`MATCHING`**: Parelles de conceptes.

### Sessions d'Aprenentatge (Batching)
L'usuari juga per nivells de dificultat (`difficultyTier`).
* El sistema recupera un conjunt de reptes filtrats per `topicId` i `difficulty`.
* Això permet càrrega optimitzada (no fem una petició per cada pregunta).

---

## ⚙️ Flux de Dades (Clean Architecture)

1.  **UI (`/learn/[slug]`):**
    * L'usuari entra a un nivell específic.
    * Es dispara `GetNextChallengeUseCase` passant el `difficulty` seleccionat.
2.  **Use Case (`GetNextChallengeUseCase`):**
    * Valida que el tema existeix (`TopicRepository`).
    * Demana els reptes al `ChallengeRepository` amb els filtres adequats.
    * Retorna `Challenge[]` (Entitats pures).
3.  **Presentation (`GameArena`):**
    * Rep les entitats i utilitza el `ChallengeRenderer` per pintar la vista corresponent segons el `type`.

---

## 🛠️ Components Clau

| Component | Capa | Responsabilitat |
| :--- | :--- | :--- |
| `GetNextChallengeUseCase` | Application | Orquestració de la càrrega de sessió. |
| `Challenge` | Entity | Defineix els contractes de dades (Quiz, Terminal, etc.). |
| `IChallengeRepository` | Domain | Interfície que defineix com accedir a les dades. |