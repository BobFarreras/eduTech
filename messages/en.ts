// filepath: messages/en.ts
export default {
  app: {
    name: "TechMastery"
  },
  game: {
    start: "Start",
    check: "Check",
    next: "Next",
    finish: "Finish",
    loading: "Loading...",
    arena: {
      loading: "Saving your progress...",
      progress: "Progress",
      construction: "Under construction...",
      skip: "Skip",
      unauthorized_title: "Log in",
      unauthorized_desc: "You need an account to save your progress and level up.",
      error_title: "Oops! Something went wrong",
      login_btn: "Log in",
      retry_btn: "Retry",
      lesson_complete: "Lesson Completed!",
      xp_earned: "XP Earned",
      dashboard_btn: "Back to Dashboard",
      level_up: "LEVEL UP!",
      continue_btn: "Continue",
      quit: "Quit"
    },
    modes: {
      logic_order: {
        label: "Logical Order",
        your_answer: "Your answer",
        placeholder: "Drag items here",
        empty_options: "All set ✨",
        drag_hint: "Click or drag"
      },
      terminal: {
        label: "Terminal",
        prompt_user: "user",
        placeholder: "Type the command...",
        session_closed: "--- Session ended ---"
      }
    },
    actions: {
      check: "Check",
      verify: "Verify",
      continue: "Continue",
      reset: "Reset",
      retry: "Try again"
    },
    feedback: {
      correct: "Correct!",
      incorrect: "Incorrect",
      solution: "Solution",
      hint: "Hint"
    },
    level_node: {
      level: "LEVEL",
      locked: "Locked",
      completed: "Completed"
    }
  },

  dashboard: {
    welcome_title: "Welcome back",
    subtitle: "What technology do you want to master today?",
    availableTopics: "Available Topics"
  },
  topic: {
    react: { title: "React Basics" },
    typescript: { title: "TypeScript Pro" },
    supabase: { title: "Supabase & SQL" },
    legacy: { title: "Legacy PHP" }, // Encara que estigui desactivat
    security: { title: "OWASP Top 10" }, // Exemple extra
    docker_basics: { title: "Docker Containers" },

    owasp: {
      title: "Cybersecurity (OWASP Top 10)"
    }
  },
  auth: {
    login: {
      title: "Welcome to eduTech 🚀",
      subtitle: "Login to continue learning.",
      submit_button: "Login",
      forgot_password: "Forgot password?",
      no_account: "Don't have an account?",
      register_link: "Create free account"
    },
    register: {
      title: "Join eduTech",
      subtitle: "Start learning today.",
      submit_button: "Create Account",
      have_account: "Already have an account?",
      login_link: "Login"
    },
    fields: {
      email: "Email",
      email_placeholder: "user@example.com",
      password: "Password",
      password_placeholder: "••••••••"
    },
    errors: {
      generic: "An unexpected error occurred.",
      invalid_credentials: "Invalid email or password.",
      user_already_exists: "Email already registered.",
      weak_password: "Password must be at least 6 characters."
    },
    success: {
      check_email: "Account created! Check your email."
    },
    logout: "Logout"
  },
  landing: {
    badge: "Learn coding by playing",
    title_prefix: "Become a",
    title_highlight: "Senior Developer",
    description: "Master React, Docker, and Cybersecurity with interactive challenges. No boring videos. Just real practice.",
    cta_primary: "START FOR FREE",
    cta_secondary: "LEARN MORE",
    login_button: "LOGIN"
  },
  milestones: {
    junior: "Junior Developer",
    senior: "Senior Engineer",
    architect: "Tech Lead Architect",
    legend: "Code Legend",
    junior_architect: "Junior Architect",
    grandmaster: "System Grandmaster"
  }
  ,
  Admin: {
    Challenges: {
      title: "Create New Challenge",
      form: {
        topicLabel: "Topic",
        topicPlaceholder: "Select a topic...",
        difficultyLabel: "Difficulty (1-5)",
        typeLabel: "Challenge Type",
        questionLabel: "Prompt / Question",
        submitButton: "Create Challenge",
        saving: "Saving...",
        success: "Challenge created successfully!",
        error: "Error creating the challenge."
      }
    }
  }


} as const;