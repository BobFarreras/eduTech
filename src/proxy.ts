// filepath: src/proxy.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './routing';
 
export default createMiddleware(routing);

export const config = {
  // MATCHER CORRECTE (REGEX):
  // Atrapa totes les peticions EXCEPTE:
  // - api (rutes d'API)
  // - _next/static (fitxers estàtics de Next)
  // - _vercel (interns de Vercel)
  // - fitxers amb extensió (imatges .png, .jpg, favicon.ico, etc.)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};