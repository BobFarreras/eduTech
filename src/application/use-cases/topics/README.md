# 📚 Topics Module

Aquest mòdul gestiona les categories d'aprenentatge (temes) disponibles a la plataforma.

## 🧠 Lògica de Negoci

### Visibilitat
* **Actius vs Inactius:** El sistema només mostra temes on `is_active = true`. Això permet crear contingut en "borrany" sense que els usuaris ho vegin.
* **Internacionalització:** Els noms dels temes a la BD no són text pla, sinó claus de traducció (`name_key`) que es resolen al frontend (ex: `topics.react.title`).

### Ordenació
* Els temes s'ordenen per defecte segons el camp `sort_order` (ascendent) per controlar l'ordre pedagògic del Dashboard.

---

## ⚙️ Flux de Dades

1.  **Dashboard Page (`/`):**
    * El component servidor crida directament al Use Case (o via Action).
2.  **Use Case (`GetActiveTopicsUseCase`):**
    * Demana tots els temes al repositori.
    * Filtra els inactius (si no ho fa la query).
3.  **Repository (`SupabaseTopicRepository`):**
    * Connecta amb la taula `topics`.
    * Mapeja els resultats SQL (snake_case) a Entitats de Domini (camelCase).

---

## 🛠️ Components Clau

| Component | Tipus | Responsabilitat |
| :--- | :--- | :--- |
| `GetActiveTopicsUseCase` | Application | Recuperar el llistat principal. |
| `Topic` | Entity | Defineix l'estructura (slug, icons, colors). |
| `TopicCard` | Presentation | Component visual que renderitza el tema i gestiona el routing. |