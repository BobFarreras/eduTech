// filepath: src/proxy.ts
import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './routing';
import { createMiddlewareClient } from '@/infrastructure/utils/supabase/middleware';

export default async function proxy(request: NextRequest) {
  // 1. Inicialitzem client de Supabase (Infraestructura)
  // Això gestiona automàticament el refresc de tokens
  const { supabase, response } = await createMiddlewareClient(request);

  // 2. SEGURETAT: Protecció de rutes Admin (/sys-ops)
  // Només comprovem usuari si realment cal, per rendiment
  if (request.nextUrl.pathname.includes('/sys-ops')) {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Obtenim llista d'admins de les ENV
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',');
    
    // Validació
    if (!user || !user.email || !adminEmails.includes(user.email)) {
      // Redirigim a l'arrel si no és admin (Security by Obscurity)
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 3. i18n: Si passem la seguretat, deleguem a next-intl
  // IMPORTANT: next-intl necessita retornar la seva pròpia resposta
  const handleI18n = createIntlMiddleware(routing);
  const intlResponse = handleI18n(request);

  // 4. Fusionem les cookies de Supabase (sessió) amb la resposta de l'idioma
  // Si Supabase ha refrescat el token, hem de passar aquesta cookie a la resposta final
  const supabaseCookies = response.cookies.getAll();
  supabaseCookies.forEach(cookie => {
    intlResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};