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
        empty_options: "Everything placed ✨",
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
    subtitle: "Which technology do you want to master today?",
    availableTopics: "Available Topics"
  },
  topic: {
    react: { title: "React Fundamentals" },
    typescript: { title: "TypeScript Pro" },
    supabase: { title: "Supabase & SQL" },
    legacy: { title: "Legacy PHP" },
    security: { title: "OWASP Security" },
    docker_basics: { title: "Docker Containers" },
    owasp: {
      title: "Cybersecurity (OWASP Top 10)"
    }
  },
  auth: {
    login: {
      title: "Welcome to eduTech 🚀",
      subtitle: "Log in to keep learning.",
      submit_button: "Log in",
      forgot_password: "Forgot your password?",
      no_account: "Don't have an account yet?",
      register_link: "Create a free account"
    },
    register: {
      title: "Join eduTech",
      subtitle: "Start learning today.",
      submit_button: "Create Account",
      have_account: "Already have an account?",
      login_link: "Log in"
    },
    fields: {
      email: "Email",
      email_placeholder: "user@example.com",
      password: "Password",
      password_placeholder: "••••••••"
    },
    errors: {
      generic: "An unexpected error occurred.",
      invalid_credentials: "Email or password is incorrect.",
      user_already_exists: "This email is already registered.",
      weak_password: "Password must be at least 6 characters long."
    },
    success: {
      check_email: "Account created! Check your email."
    },
    logout: "Log out"
  },
  landing: {
    badge: "Learn programming by playing",
    title_prefix: "Become a",
    title_highlight: "Senior Developer",
    description: "Master React, Docker, and Cybersecurity with interactive challenges. No boring videos. Just real practice.",
    cta_primary: "START FOR FREE",
    cta_secondary: "LEARN MORE",
    login_button: "LOG IN"
  },
  milestones: {
    junior: "Junior Developer",
    senior: "Senior Engineer",
    architect: "Tech Lead Architect",
    legend: "Code Legend",
    junior_architect: "Junior Architect",
    grandmaster: "System Grandmaster"
  },
  Admin: {
    Challenges: {
      title: "Create New Challenge",
      form: {
        topicLabel: "Topic",
        topicPlaceholder: "Select a topic...",
        difficultyLabel: "Difficulty (1-5)",
        typeLabel: "Challenge Type",
        questionLabel: "Statement / Question",
        submitButton: "Create Challenge",
        saving: "Saving...",
        success: "Challenge created successfully!",
        error: "Error creating the challenge."
      }
    }
  },
  profile: {
    title: "Your Headquarters",
    subtitle: "Manage your identity on eduTech.",
    stats: {
      level: "Level",
      total_xp: "Total XP",
      streak_days: "Streak Days",
      member_since: "Member since",
      id_label: "ID"
    },
    form: {
      configuration: "Settings",
      configuration_desc: "Customize how other players see you.",
      avatar_label: "Choose your Avatar",
      username_label: "Alias (Nickname)",
      username_placeholder: "Ex: CyberNinja",
      username_help: "{min}-{max} characters. Be creative!",
      save_button: "Save Changes",
      saving_button: "Saving...",
      success_message: "Profile updated successfully!",
      error_generic: "Unexpected server error."
    },
    validation: {
      username_min: "Name must be at least {min} characters long",
      username_max: "Maximum {max} characters",
      avatar_invalid: "Invalid emoji"
    }
  },
  leaderboard: {
    title: "Hall of Fame",
    subtitle: "Global eduTech student competition.",
    empty: "No data yet.",
    load_more: "Load more",
    loading: "Loading...",
    you: "(You)",
    rank_label: "Your current position",
    level: "Level",
    back_dashboard: "Back to Dashboard"
  }
} as const;
