// filepath: src/presentation/components/layout/DesktopNavbar.tsx
'use client';

import { Link } from '@/navigation';
import { LanguageSwitcher } from '../ui/gamified/LanguagerSwitcher';
import { Button3D } from '../ui/gamified/Button3D';
import { LogOut, Trophy, Zap } from 'lucide-react'; // <--- ICONS
import { logoutAction } from '@/presentation/actions/auth/logout.actions';
import { UserProfile } from '@/core/entities/user-profile.entity'; // <--- IMPORT ENTITAT
import Image from 'next/image';

interface DesktopNavbarProps {
  userProfile: UserProfile | null; // <--- ARA REBEM EL PERFIL REAL
}

export function DesktopNavbar({ userProfile }: DesktopNavbarProps) {
  return (
    <header className="hidden md:flex w-full h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl fixed top-0 z-50 px-8 items-center justify-between shadow-2xl shadow-black/20">
      {/* 1. LOGO */}
      <Link href="/" className="flex items-center gap-3 group cursor-pointer" aria-label="EduTech Home">

        {/* CONTENIDOR ICONA (Ara amb fons i forma) */}
        <div className="relative w-10 h-10 p-1.5 bg-slate-800 rounded-xl border border-slate-700 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 group-hover:border-blue-500/50 group-hover:bg-slate-750 shadow-lg shadow-black/20">
          <Image
            src="/web-app-manifest-192x192.png"
            alt="EduTech Logo"
            fill
            className="object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" // Ombra interna per donar profunditat
            sizes="32px"
            priority
          />
        </div>

        {/* TEXT BRANDING */}
        <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400 group-hover:from-blue-300 group-hover:to-cyan-300 transition-all">
          eduTech
        </span>
      </Link>

      {/* 2. ACCIONS HUD */}
      <div className="flex items-center gap-4">

        {userProfile ? (
          <>
            {/* --- BOTÓ RÀNQUING --- */}
            <Link href="/leaderboard">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-full transition-all group hover:border-yellow-500/50 cursor-pointer">
                <Trophy className="w-4 h-4 text-yellow-500 group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-bold text-slate-300 group-hover:text-yellow-100">Rànquing</span>
              </div>
            </Link>

            {/* --- SEPARADOR VERTICAL --- */}
            <div className="h-6 w-px bg-slate-800 mx-2" />

            {/* --- ZONA USUARI (XP + AVATAR + NOM) --- */}
            <Link href="/profile" className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-900 transition-colors group cursor-pointer">

              {/* XP (Opcional, queda xulo) */}
              <div className="flex-col items-end mr-2 hidden lg:flex">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Nivell {userProfile.level}</span>
                <div className="flex items-center gap-1 text-xs font-black text-blue-400">
                  <Zap className="w-3 h-3 fill-current" />
                  {new Intl.NumberFormat('ca-ES').format(userProfile.totalXp)} XP
                </div>
              </div>

              {/* Nom */}
              <span className="font-bold text-white group-hover:text-blue-300 transition-colors">
                {userProfile.username}
              </span>

              {/* Avatar (Emoji) */}
              <div className="w-10 h-10 bg-slate-800 rounded-full border-2 border-slate-700 flex items-center justify-center text-xl shadow-lg group-hover:scale-110 group-hover:border-blue-500 transition-all">
                {userProfile.avatarIcon}
              </div>
            </Link>

            {/* --- LOGOUT --- */}
            <button
              onClick={() => logoutAction()}
              className="ml-2 p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all"
              title="Tancar Sessió"
            >
              <LogOut className="w-5 h-5" />
            </button>

          </>
        ) : (
          /* --- ESTAT NO LOGUEJAT --- */
          <div className="flex gap-3">
            <LanguageSwitcher />
            <Link href="/login">
              <Button3D variant="outline" className="py-2 px-6 text-sm">Entrar</Button3D>
            </Link>
            <Link href="/register">
              <Button3D variant="primary" className="py-2 px-6 text-sm">Començar</Button3D>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}