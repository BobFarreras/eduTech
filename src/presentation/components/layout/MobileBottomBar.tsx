// filepath: src/presentation/components/layout/MobileBottomBar.tsx
'use client';

import { Link, usePathname } from '@/navigation';
import { Home, Zap, User, LogIn } from 'lucide-react';
import { clsx } from 'clsx';

interface MobileBottomBarProps {
  isLoggedIn: boolean;
}

export function MobileBottomBar({ isLoggedIn }: MobileBottomBarProps) {
  const pathname = usePathname();

  // 🛑 LOGICA D'ARQUITECTE: SI ESTEM JUGANT, NO MOSTREM LA BARRA
  // Això dóna tota la pantalla al joc (100dvh real)
  if (pathname.includes('/play') || pathname.includes('/arena')) {
    return null;
  }

  const navItems = [
    { label: 'Inici', href: '/', icon: Home },
    { label: 'Aprendre', href: '/learn', icon: Zap },
    { label: isLoggedIn ? 'Perfil' : 'Entrar', href: isLoggedIn ? '/profile' : '/login', icon: isLoggedIn ? User : LogIn }
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-md border-t border-slate-800 px-6 py-3 md:hidden z-50 pb-safe">
      <div className="flex justify-between items-center max-w-sm mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={clsx(
                "flex flex-col items-center gap-1 transition-all active:scale-90",
                isActive ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Icon className={clsx("w-6 h-6", isActive && "fill-current")} />
              <span className="text-[10px] font-bold tracking-wide uppercase">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}