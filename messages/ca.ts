// filepath: messages/ca.ts
export default {
  app: {
    name: "TechMastery"
  },
  game: {
    start: "Comença",
    check: "Comprovar",
    next: "Següent",
    finish: "Acabar",
    loading: "Carregant...",
    arena: {
      loading: "Guardant el teu progrés...",
      progress: "Progrés",
      construction: "En construcció...",
      skip: "Saltar",
      unauthorized_title: "Inicia sessió",
      unauthorized_desc: "Necessites un compte per guardar el teu progrés i pujar de nivell.",
      error_title: "Ups! Alguna cosa ha fallat",
      login_btn: "Entrar",
      retry_btn: "Reintentar",
      lesson_complete: "Lliçó Completada!",
      xp_earned: "XP Guanyada",
      dashboard_btn: "Tornar al Dashboard",
      level_up: "NIVELL SUPERAT!",
      continue_btn: "Continuar",
      quit: "Sortir"
    },
    modes: {
      logic_order: {
        label: "Ordre Lògic",
        your_answer: "La teva resposta",
        placeholder: "Arrossega els elements aquí",
        empty_options: "Tot col·locat ✨",
        drag_hint: "Clica o arrossega"
      },
      terminal: {
        label: "Terminal",
        prompt_user: "usuari",
        placeholder: "Escriu la comanda...",
        session_closed: "--- Sessió finalitzada ---"
      }
    },
    actions: {
      check: "Comprovar",
      verify: "Verificar",
      continue: "Continuar",
      reset: "Reiniciar",
      retry: "Tornar a provar"
    },
    feedback: {
      correct: "Correcte!",
      incorrect: "Incorrecte",
      solution: "Solució",
      hint: "Pista"
    },
    level_node: {
      level: "NIVELL",
      locked: "Bloquejat",
      completed: "Completat"
    }

  },
  // AFEGEIX AIXÒ:
  dashboard: {
    welcome_title: "Hola de nou",
    subtitle: "Quina tecnologia vols dominar avui?",
    availableTopics: "Temes Disponibles"
  },
  topic: {
    react: { title: "Fonaments de React" },
    typescript: { title: "TypeScript Pro" },
    supabase: { title: "Supabase i SQL" },
    legacy: { title: "PHP Legacy" },
    security: { title: "Seguretat OWASP" },
    docker_basics: { title: "Contenidors Docker" },
    owasp: {
      title: "Ciberseguretat (OWASP Top 10)"
    }
  },

  // --- NOVA SECCIÓ AUTH ---
  auth: {
    login: {
      title: "Benvingut a eduTech 🚀",
      subtitle: "Inicia sessió per continuar aprenent.",
      submit_button: "Entrar",
      forgot_password: "Has oblidat la contrasenya?",
      no_account: "Encara no tens compte?",
      register_link: "Crea un compte gratuït"
    },
    register: {
      title: "Uneix-te a eduTech",
      subtitle: "Comença a aprendre avui mateix.",
      submit_button: "Crear Compte",
      have_account: "Ja tens compte?",
      login_link: "Inicia sessió"
    },
    fields: {
      email: "Correu electrònic",
      email_placeholder: "usuari@exemple.com",
      password: "Contrasenya",
      password_placeholder: "••••••••"
    },
    errors: {
      generic: "Hi ha hagut un error inesperat.",
      invalid_credentials: "El correu o la contrasenya són incorrectes.",
      user_already_exists: "Aquest correu ja està registrat.",
      weak_password: "La contrasenya ha de tenir mínim 6 caràcters."
    },
    success: {
      check_email: "Compte creat! Revisa el teu correu."
    },
    logout: "Tancar Sessió"
  },
  landing: {
    badge: "Aprèn programació jugant",
    title_prefix: "Converteix-te en",
    title_highlight: "Senior Developer",
    description: "Domina React, Docker i Ciberseguretat amb reptes interactius. Sense vídeos avorrits. Només pràctica real.",
    cta_primary: "COMENÇAR GRATIS",
    cta_secondary: "SABER-NE MÉS",
    login_button: "ENTRAR"
  },
  milestones: {
    junior: "Desenvolupador Junior",
    senior: "Enginyer Senior",
    architect: "Tech Lead Architect",
    legend: "Llegenda del Codi",
    junior_architect: "Arquitecte Junior", 
    grandmaster: "Gran Mestre del Sistema"
  },
  Admin: {
    Challenges: {
      title: "Crear Nou Repte",
      form: {
        topicLabel: "Tema",
        topicPlaceholder: "Selecciona un tema...",
        difficultyLabel: "Dificultat (1-5)",
        typeLabel: "Tipus de Repte",
        questionLabel: "Enunciat / Pregunta",
        submitButton: "Crear Repte",
        saving: "Guardant...",
        success: "Repte creat correctament!",
        error: "Error al crear el repte."
      }
    }
  }
} as const;