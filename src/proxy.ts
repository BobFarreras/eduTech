// filepath: src/proxy.ts
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';
 
export default createMiddleware({
  locales: locales,
  defaultLocale: 'ca'
});
 
export const config = {
  // Matcher per ignorar fitxers interns i API
  matcher: ['/', '/(ca|es|en)/:path*']
};