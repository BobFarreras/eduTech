// filepath: src/app/[locale]/(auth)/login/page.tsx
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl backdrop-blur-sm w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">eduTech 🚀</h1>
        <p className="text-slate-400">Inicia sessió o registra't per continuar.</p>
      </div>

      <LoginForm />
    </div>
  );
}