// filepath: src/presentation/components/auth/LogoutButton.tsx
'use client';

import { LogOut } from 'lucide-react';
import { logoutAction } from '@/presentation/actions/auth/logout.actions';

export function LogoutButton() {
  return (
    <button 
      onClick={() => logoutAction()}
      className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm font-medium p-2 rounded-lg hover:bg-red-500/10 w-full"
    >
      <LogOut className="w-4 h-4" />
      <span>Tancar Sessió</span>
    </button>
  );
}