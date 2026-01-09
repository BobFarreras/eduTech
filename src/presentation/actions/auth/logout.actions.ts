// filepath: src/presentation/actions/auth/logout.action.ts
'use server';

import { LogoutUseCase } from '@/application/use-cases/auth/logout.use-case';
import { SupabaseAuthService } from '@/infrastructure/service/supabase-auth.service';
import { redirect } from 'next/navigation'; // Aquí SÍ usem el natiu

export async function logoutAction() {
  const authService = new SupabaseAuthService();
  const useCase = new LogoutUseCase(authService);
  
  await useCase.execute();
  
  // Truc d'Arquitecte: Redirigim a l'arrel "/"
  // El Middleware detectarà "/" -> Detectarà l'idioma del navegador -> Redirigirà a "/ca/login"
  redirect('/login'); 
}