// filepath: messages/es.ts
export default {
  app: {
    name: "TechMastery"
  },
  game: {
    start: "Empezar",
    check: "Comprobar",
    next: "Siguiente",
    finish: "Finalizar",
    loading: "Cargando...",
    arena: {
      loading: "Guardando tu progreso...",
      progress: "Progreso",
      construction: "En construcción...",
      skip: "Saltar",
      unauthorized_title: "Inicia sesión",
      unauthorized_desc: "Necesitas una cuenta para guardar tu progreso y subir de nivel.",
      error_title: "¡Ups! Algo ha fallado",
      login_btn: "Entrar",
      retry_btn: "Reintentar",
      lesson_complete: "¡Lección completada!",
      xp_earned: "XP ganada",
      dashboard_btn: "Volver al Dashboard",
      level_up: "¡NIVEL SUPERADO!",
      continue_btn: "Continuar" // <--- AFEGIR
    }

  },
  dashboard: {
    welcome_title: "Hola de nuevo",
    subtitle: "¿Qué tecnología quieres dominar hoy?",
    availableTopics: "Temas Disponibles"
  },
  topic: {
    react: { title: "Fundamentos de React" },
    typescript: { title: "TypeScript Pro" },
    supabase: { title: "Supabase y SQL" },
    legacy: { title: "PHP Legacy" },
    security: { title: "Seguridad OWASP" },
    docker: { title: "Contenedores Docker" }
  },
  auth: {
    login: {
      title: "Bienvenido a eduTech 🚀",
      subtitle: "Inicia sesión para seguir aprendiendo.",
      submit_button: "Iniciar sesión",
      forgot_password: "¿Olvidaste tu contraseña?",
      no_account: "¿No tienes una cuenta?",
      register_link: "Crear cuenta gratis"
    },
    register: {
      title: "Únete a eduTech",
      subtitle: "Empieza a aprender hoy.",
      submit_button: "Crear cuenta",
      have_account: "¿Ya tienes una cuenta?",
      login_link: "Iniciar sesión"
    },
    fields: {
      email: "Correo electrónico",
      email_placeholder: "usuario@ejemplo.com",
      password: "Contraseña",
      password_placeholder: "••••••••"
    },
    errors: {
      generic: "Ocurrió un error inesperado.",
      invalid_credentials: "Correo electrónico o contraseña incorrectos.",
      user_already_exists: "El correo electrónico ya está registrado.",
      weak_password: "La contraseña debe tener al menos 6 caracteres."
    },
    success: {
      check_email: "¡Cuenta creada! Revisa tu correo electrónico."
    },
    logout: "Cerrar sesión"
  },
  landing: {
    badge: "Aprende programación jugando",
    title_prefix: "Conviértete en",
    title_highlight: "Senior Developer",
    description: "Domina React, Docker y Ciberseguridad con retos interactivos. Sin vídeos aburridos. Solo práctica real.",
    cta_primary: "EMPEZAR GRATIS",
    cta_secondary: "SABER MÁS",
    login_button: "ENTRAR"
  }
} as const;
