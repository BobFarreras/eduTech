// filepath: src/infrastructure/mappers/README.md

# 🗺️ Challenge Mappers (Patró Strategy)

Aquest mòdul s'encarrega de transformar les dades "crues" (`unknown` / JSON) provinents de la base de dades (Supabase) en Entitats de Domini netes i tipades (`ChallengeContent`).

## 🏗️ Arquitectura

Utilitzem el **Strategy Pattern** per complir amb el principi **Open/Closed (SOLID)**.
Això permet afegir nous tipus de joc sense modificar el codi existent del Repositori.

### Components

1.  **`ChallengeMapperFactory`**: Decideix quin mapper utilitzar basant-se en el `type` del repte.
2.  **`MapperUtils`**: Funcions pures per gestionar traduccions (`i18n`) i parsimònia de JSON segura.
3.  **`Strategies`**: Classes individuals per a cada tipus de joc (ex: `TerminalMapper`, `QuizMapper`).

## 🚀 Com afegir un nou tipus de joc?

1.  **Definir la Interfície Raw**: A `challenge.mappers.ts`, defineix com es veu el JSON a la BD (`interface RawNouJoc`).
2.  **Crear la Classe Mapper**: Implementa `ContentMapperStrategy`.
    ```typescript
    class NouJocMapper implements ContentMapperStrategy {
      map(rawData: unknown, locale: string): ChallengeContent {
        const content = rawData as RawNouJoc;
        return {
           // ... mapeig segur
        };
      }
    }
    ```
3.  **Registrar a la Factory**: Afegeix un nou `case` al `ChallengeMapperFactory`.

## 🛡️ Seguretat de Tipus

* **No usem `any`**.
* L'entrada sempre és `unknown`.
* Fem servir *Type Guards* o *Casts* controlats per validar l'estructura.
* Si el JSON és invàlid, retornem valors per defecte segurs (Fail-safe), mai errors no controlats.