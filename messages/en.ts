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
      level_up: "LEVEL UP!"
    }

  },
  dashboard: {
    availableTopics: "Learning Paths",
    startTopic: "Enter"
  },
  topic: {
    react: { title: "Advanced React" },
    supabase: { title: "Supabase & SQL" },
    typescript: { title: "Total TypeScript" }
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
  }
} as const;