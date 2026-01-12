# 🔐 Auth Module

Aquest mòdul gestiona la identitat, autenticació i seguretat de l'usuari.

## 🧠 Lògica de Negoci

### Proveïdor
Utilitzem **Supabase Auth** com a proveïdor d'identitat (IDP). 
Això ens gestiona:
* Seguretat de contrasenyes (Hashing).
* Sessions (JWT / Cookies).
* Emails de confirmació (desactivat en Dev).

### Sincronització de Dades
L'arquitectura utilitza un patró de **Trigger de Base de Dades** per sincronitzar la taula interna `auth.users` amb la nostra taula de domini `public.profiles`.
* **Registre:** Trigger `handle_new_user` crea perfil automàticament.
* **Login:** Accedim a les dades via `SupabaseAuthService`.

---

## ⚙️ Fluxos

### Login / Registre
1.  Frontend (`LoginForm`/`RegisterForm`) envia `FormData` amb un camp `intent`.
2.  Server Action (`authAction`) processa la petició contra Supabase.
3.  Si és exitós -> `redirect('/')`.

### Logout
1.  Usuari clica `LogoutButton`.
2.  Server Action (`logoutAction`) executa `LogoutUseCase`.
3.  Infraestructura neteja la cookie de sessió.
4.  Redirect -> `/login`.

---

## 🛠️ Components Clau

| Component | Tipus | Responsabilitat |
| :--- | :--- | :--- |
| `LogoutUseCase` | Application | Desconnectar l'usuari (Business Logic). |
| `SupabaseAuthService` | Infrastructure | Wrapper sobre el client `ssr` de Supabase. |
| `auth.action.ts` | Presentation | Controlador únic per Login i Signup. |