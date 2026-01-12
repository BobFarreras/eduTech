// filepath: src/presentation/utils/auth-guards.ts
import { createClient } from '@/infrastructure/utils/supabase/server';
import { AuthenticationError, UnauthorizedError } from '@/core/errors/auth.error';

/**
 * Verifica si l'usuari actual té permisos d'administrador.
 * Utilitza les variables d'entorn per validar la llista d'emails permesos.
 * * @throws {AuthenticationError} Si no hi ha sessió activa.
 * @throws {UnauthorizedError} Si l'usuari no és admin.
 * @returns L'objecte usuari de Supabase si és vàlid.
 */
export async function assertAdmin() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthenticationError('Cal iniciar sessió per accedir a aquesta funció.');
  }

  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',');
  const userEmail = user.email || '';
  
  if (!userEmail || !adminEmails.includes(userEmail)) {
    throw new UnauthorizedError(`L'usuari ${userEmail} no té permisos d'administrador.`);
  }

  return user;
}