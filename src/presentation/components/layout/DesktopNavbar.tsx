// filepath: src/presentation/components/layout/DesktopNavbar.tsx
'use client';

// IMPORTACIONS ARQUITECTÒNIQUES: Usem el nostre wrapper, no el de Next directament
import { Link } from '@/navigation'; 
import { LanguageSwitcher } from '../ui/gamified/LanguagerSwitcher';
import { Button3D } from '../ui/gamified/Button3D';
import { LogOut, User } from 'lucide-react';
import { logoutAction } from '@/presentation/actions/auth/logout.actions';

interface DesktopNavbarProps {
  isLoggedIn: boolean;
}

export function DesktopNavbar({ isLoggedIn }: DesktopNavbarProps) {
  // No necessitem useLocale(), el Link ja sap on som.

  return (
    <header className="hidden md:flex w-full h-20 border-b-2 border-slate-800 bg-slate-900/80 backdrop-blur-md fixed top-0 z-50 px-8 items-center justify-between">
      {/* LOGO - Ruta neta '/' */}
      <Link href="/" className="text-2xl font-black tracking-tighter text-green-500 hover:scale-105 transition-transform">
        edu<span className="text-white">Tech</span>
      </Link>

      {/* ACCIONS DRETA */}
      <div className="flex items-center gap-4">
        <LanguageSwitcher />

        {isLoggedIn ? (
          <div className="flex gap-3">
             {/* Rutes netes sense ${locale} */}
             <Link href="/profile">
                <Button3D variant="outline" className="py-2 px-4 text-sm">
                   <User className="w-4 h-4" /> Perfil
                </Button3D>
             </Link>
             <div onClick={() => logoutAction()} className="cursor-pointer">
                <Button3D variant="danger" className="py-2 px-4 text-sm">
                   <LogOut className="w-4 h-4" />
                </Button3D>
             </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link href="/login">
               <Button3D variant="outline" className="py-2 px-6 text-sm">
                 Entrar
               </Button3D>
            </Link>
            <Link href="/register">
               <Button3D variant="primary" className="py-2 px-6 text-sm">
                 Començar
               </Button3D>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}