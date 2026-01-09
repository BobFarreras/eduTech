// filepath: src/presentation/components/layout/MobileBottomBar.tsx
'use client';

// IMPORTANT: Importem Link i usePathname des de @/navigation
import { Link, usePathname } from '@/navigation';
import { Home, Zap, User, LogIn } from 'lucide-react';
import { clsx } from 'clsx';

interface MobileBottomBarProps {
  isLoggedIn: boolean;
}

export function MobileBottomBar({ isLoggedIn }: MobileBottomBarProps) {
  // Aquest pathname ja ve "net" (ex: '/learn' encara que estiguis a '/ca/learn')
  const pathname = usePathname();

  const navItems = [
    { 
      label: 'Inici', 
      href: '/', 
      icon: Home 
    },
    { 
      label: 'Aprendre', 
      href: '/learn', 
      icon: Zap 
    },
    { 
      label: isLoggedIn ? 'Perfil' : 'Entrar', 
      href: isLoggedIn ? '/profile' : '/login', 
      icon: isLoggedIn ? User : LogIn 
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t-2 border-slate-800 px-6 py-2 md:hidden z-40 pb-safe">
      <div className="flex justify-between items-center max-w-sm mx-auto">
        {navItems.map((item) => {
          // Comparació directa i neta
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={clsx(
                "flex flex-col items-center gap-1 p-2 transition-all active:scale-90",
                isActive ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <div className={clsx(
                "p-2 rounded-xl border-2 transition-all",
                isActive 
                  ? "bg-blue-500/20 border-blue-500/50 -translate-y-2 shadow-[0_4px_0_0_rgba(59,130,246,0.5)]" 
                  : "border-transparent"
              )}>
                <Icon className={clsx("w-6 h-6", isActive && "stroke-[3px]")} />
              </div>
              
              <span className="text-xs font-bold tracking-wide uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}