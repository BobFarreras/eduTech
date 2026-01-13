// filepath: src/core/entities/user-profile.entity.ts

export interface UserProfile {
  id: string;
  email: string;       // Ve de la taula Auth (read-only)
  username: string;
  avatarIcon: string;  // L'emoji (ex: '🤖')
  
  // Dades de Joc (Read-only per a l'usuari)
  totalXp: number;
  level: number;
  streakDays: number;
  
  joinedAt: Date;
}

/**
 * Defineix estrictament quins camps pot modificar l'usuari
 * des de la pantalla de perfil.
 * XP i Level queden fora intencionadament.
 */
export interface EditableProfileFields {
  username?: string;
  avatarIcon?: string;
}