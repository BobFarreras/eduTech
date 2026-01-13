// filepath: messages/es.ts
export default {
  app: {
    name: "TechMastery"
  },
  game: {
    start: "Comenzar",
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
      xp_earned: "XP Ganada",
      dashboard_btn: "Volver al Dashboard",
      level_up: "¡NIVEL SUPERADO!",
      continue_btn: "Continuar",
      quit: "Salir"
    },
    modes: {
      logic_order: {
        label: "Orden Lógico",
        your_answer: "Tu respuesta",
        placeholder: "Arrastra los elementos aquí",
        empty_options: "Todo colocado ✨",
        drag_hint: "Haz clic o arrastra"
      },
      terminal: {
        label: "Terminal",
        prompt_user: "usuario",
        placeholder: "Escribe el comando...",
        session_closed: "--- Sesión finalizada ---"
      }
    },
    actions: {
      check: "Comprobar",
      verify: "Verificar",
      continue: "Continuar",
      reset: "Reiniciar",
      retry: "Volver a intentar"
    },
    feedback: {
      correct: "¡Correcto!",
      incorrect: "Incorrecto",
      solution: "Solución",
      hint: "Pista"
    },
    level_node: {
      level: "NIVEL",
      locked: "Bloqueado",
      completed: "Completado"
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
    docker_basics: { title: "Contenedores Docker" },
    owasp: {
      title: "Ciberseguridad (OWASP Top 10)"
    }
  },
  auth: {
    login: {
      title: "Bienvenido a eduTech 🚀",
      subtitle: "Inicia sesión para seguir aprendiendo.",
      submit_button: "Entrar",
      forgot_password: "¿Has olvidado la contraseña?",
      no_account: "¿Aún no tienes cuenta?",
      register_link: "Crea una cuenta gratuita"
    },
    register: {
      title: "Únete a eduTech",
      subtitle: "Empieza a aprender hoy mismo.",
      submit_button: "Crear Cuenta",
      have_account: "¿Ya tienes cuenta?",
      login_link: "Inicia sesión"
    },
    fields: {
      email: "Correo electrónico",
      email_placeholder: "usuario@ejemplo.com",
      password: "Contraseña",
      password_placeholder: "••••••••"
    },
    errors: {
      generic: "Ha ocurrido un error inesperado.",
      invalid_credentials: "El correo o la contraseña son incorrectos.",
      user_already_exists: "Este correo ya está registrado.",
      weak_password: "La contraseña debe tener al menos 6 caracteres."
    },
    success: {
      check_email: "¡Cuenta creada! Revisa tu correo."
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
  },
  milestones: {
    junior: "Desarrollador Junior",
    senior: "Ingeniero Senior",
    architect: "Tech Lead Architect",
    legend: "Leyenda del Código",
    junior_architect: "Arquitecto Junior",
    grandmaster: "Gran Maestro del Sistema"
  },
  Admin: {
    Challenges: {
      title: "Crear Nuevo Reto",
      form: {
        topicLabel: "Tema",
        topicPlaceholder: "Selecciona un tema...",
        difficultyLabel: "Dificultad (1-5)",
        typeLabel: "Tipo de Reto",
        questionLabel: "Enunciado / Pregunta",
        submitButton: "Crear Reto",
        saving: "Guardando...",
        success: "¡Reto creado correctamente!",
        error: "Error al crear el reto."
      }
    }
  },
  profile: {
    title: "Tu Cuartel General",
    subtitle: "Gestiona tu identidad en eduTech.",
    stats: {
      level: "Nivel",
      total_xp: "XP Total",
      streak_days: "Días de racha",
      member_since: "Miembro desde",
      id_label: "ID"
    },
    form: {
      configuration: "Configuración",
      configuration_desc: "Personaliza cómo te ven los demás jugadores.",
      avatar_label: "Elige tu Avatar",
      username_label: "Alias (Nickname)",
      username_placeholder: "Ej: CyberNinja",
      username_help: "{min}-{max} caracteres. ¡Sé creativo!",
      save_button: "Guardar Cambios",
      saving_button: "Guardando...",
      success_message: "¡Perfil actualizado correctamente!",
      error_generic: "Error inesperado del servidor."
    },
    validation: {
      username_min: "El nombre debe tener al menos {min} letras",
      username_max: "Máximo {max} caracteres",
      avatar_invalid: "Emoji inválido"
    }
  },
  leaderboard: {
    title: "Salón de la Fama",
    subtitle: "Competición global de estudiantes eduTech.",
    empty: "Aún no hay datos.",
    load_more: "Cargar más",
    loading: "Cargando...",
    you: "(Tú)",
    rank_label: "Tu posición actual",
    level: "Nivel",
    back_dashboard: "Volver al Dashboard"
  }
} as const;
