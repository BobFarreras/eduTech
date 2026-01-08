// filepath: messages/ca.ts
export default {
  app: {
    name: "TechMastery"
  },
  game: {
    start: "Comença",
    check: "Comprovar"
  },
  dashboard: {
    availableTopics: "Rutes d'Aprenentatge",
    startTopic: "Entrar"
  },
  // Exemples de traduccions dinàmiques per als temes
  topic: {
    react: { title: "React Avançat" },
    supabase: { title: "Supabase & SQL" },
    typescript: { title: "TypeScript Total" }
  }
} as const;