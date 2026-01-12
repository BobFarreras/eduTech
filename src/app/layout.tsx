// filepath: src/app/layout.tsx
import { ReactNode } from 'react';

// Aquest layout és necessari per Next.js però no ha de fer RES visualment
// perquè tota la teva app viu dins de /[locale]/
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}