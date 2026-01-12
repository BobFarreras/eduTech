// filepath: src/application/use-cases/gamification/README.md
# 🎮 Gamification Module

Aquest mòdul gestiona el sistema de progressió, experiència (XP) i nivells dels usuaris.

## 🧠 Lògica de Negoci (Domain Rules)

### Sistema de Nivells
La fórmula de càlcul de nivell és lineal per simplificar l'MVP:
> **Fórmula:** `Nivell = (TotalXP / 100) + 1`

* **0 - 99 XP:** Nivell 1
* **100 - 199 XP:** Nivell 2
* etc.

### Recompenses
* **Per Repte:** 10 XP.
* **Per Lliçó (Sessió):** Suma total dels reptes (Ex: 3 reptes = 30 XP).

---

## ⚙️ Flux de Dades (Data Flow)

1.  **Frontend (`GameArena`):** * L'usuari completa els reptes.
    * Al finalitzar, crida a la Server Action `submitSessionAction`.
2.  **Server Action (`submit-session.action.ts`):**
    * Rep `challengeIds` (array) i `topicId`.
    * Instancia `SupabaseUserRepository` i `CompleteSessionUseCase`.
3.  **Use Case (`CompleteSessionUseCase`):**
    * Calcula l'XP guanyada.
    * Guarda el registre a `user_progress` (ignorant duplicats).
    * Calcula el nou nivell usant `LevelCalculatorService`.
    * Actualitza el perfil d'usuari (`profiles`) si hi ha canvis.

---

## 🛠️ Components Clau

| Component | Tipus | Responsabilitat |
| :--- | :--- | :--- |
| `CompleteSessionUseCase` | Application | Orquestrador principal. Transactional boundary. |
| `LevelCalculatorService` | Domain Service | Matemàtiques pures (Testejable 100%). |
| `SupabaseUserRepository` | Infrastructure | Connexió amb taules `profiles` i `user_progress`. |

## 🧪 Testing

Els tests unitaris es troben al fitxer adjunt `.test.ts`.
Per executar-los:
```bash
pnpm test src/application/use-cases/gamification