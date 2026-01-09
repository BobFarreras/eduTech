// filepath: src/proxy.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './routing';
 
export default createMiddleware(routing);

export const config = {
  // Matcher: Ignora rutes internes de Next.js i fitxers estàtics
  matcher: ['/', '/(ca|es|en)/:path*']
};