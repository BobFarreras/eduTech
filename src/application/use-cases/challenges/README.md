# ⚔️ Challenges Module (Game Engine)

Aquest mòdul és el cor de l'aplicació. Gestiona la recuperació, validació i presentació dels reptes educatius.

## 🧠 Lògica de Negoci

### Estructura del Contingut
El contingut és **Polimòrfic**. La base de dades guarda un JSONB, però el Domini el converteix en tipus estrictes:
* `QUIZ`: Pregunta + 4 opcions + resposta correcta.
* `CODE_FIX` (Futur): Codi trencat + Solució regex.
* `TERMINAL` (Futur): Comanda esperada.

### Sessions d'Aprenentatge
L'usuari no demana 1 repte, sinó una **Sessió** (Batch).
* Actualment: Es recuperen els següents 5 reptes disponibles del tema.
* Ordre: Basat en `difficulty_tier`.

---

## ⚙️ Flux de Dades

1.  **Game Page (`/learn/[slug]`):**
    * Releva l'slug de la URL i crida `getNextChallengeAction`.
2.  **Use Case (`GetNextChallengeUseCase`):**
    * Tradueix `slug` -> `topicId`.
    * Busca reptes a `SupabaseChallengeRepository`.
    * Retorna una llista `Challenge[]`.
3.  **Frontend Engine (`GameArena`):**
    * Rep la llista i gestiona l'estat local (índex actual).
    * No torna a contactar amb el servidor fins que s'acaba la llista (per optimitzar latència).

---

## 🛠️ Components Clau

| Component | Tipus | Responsabilitat |
| :--- | :--- | :--- |
| `GetNextChallengeUseCase` | Application | Orquestració de la càrrega de sessió. |
| `Challenge` | Entity | Defineix els tipus `QuizContent`, etc. |
| `GameArena` | Presentation | **Client Component**. Gestiona el bucle de joc i la UI interactiva. |
| `QuizView` | Presentation | Renderitza un repte tipus test i valida visualment la resposta. |