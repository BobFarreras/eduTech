// filepath: src/presentation/components/layout/MobileBottomBar.tsx
'use client';

import { Link, usePathname } from '@/navigation';
import { Home, Trophy, User, LayoutDashboard, Hexagon } from 'lucide-react';
import { clsx } from 'clsx';

interface MobileBottomBarProps {
  isLoggedIn: boolean;
}

export function MobileBottomBar({ isLoggedIn }: MobileBottomBarProps) {
  const pathname = usePathname();

  if (pathname.includes('/play')) return null;

  const navItems = isLoggedIn 
    ? [
        { label: 'APRENDRE', href: '/dashboard', icon: Hexagon }, // Hexagon és molt "Tech"
        { label: 'RÀNQUING', href: '/leaderboard', icon: Trophy },
        { label: 'PERFIL', href: '/profile', icon: User }
      ]
    : [ /* ... ítems de convidat ... */ ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-950 border-t-2 border-slate-200 dark:border-slate-800 px-2 pb-safe pt-2 md:hidden z-50">
      <div className="flex justify-around items-center max-w-sm mx-auto h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={clsx(
                "flex items-center justify-center w-16 h-12 rounded-xl transition-all relative",
                // Estil actiu vs inactiu tipus app nativa
                isActive 
                  ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800" 
                  : "hover:bg-slate-100 dark:hover:bg-slate-900"
              )}
            >
              <Icon 
                className={clsx(
                  "w-7 h-7 transition-all",
                  isActive 
                    ? "text-blue-500 fill-blue-500 stroke-blue-600 dark:stroke-blue-400" 
                    : "text-slate-400 dark:text-slate-600"
                )} 
                strokeWidth={2.5}
              />
              {/* Indicador de notificació (opcional futur) */}
            </Link>
          );
        })}
      </div>
    </div>
  );
}