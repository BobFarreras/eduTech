// filepath: src/core/services/auth.service.ts
export interface UserIdentity {
  id: string;
  email: string;
}

export interface IAuthService {
  logout(): Promise<void>;
  getUser(): Promise<UserIdentity | null>;
  // Login i Register els gestiona Supabase directament via Actions, 
  // però el Logout és millor passar-lo per aquí per neteja.
}