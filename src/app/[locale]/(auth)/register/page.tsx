// filepath: src/app/[locale]/(auth)/register/page.tsx
import { RegisterForm } from './RegisterForm';

export default function RegisterPage() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl backdrop-blur-sm w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Uneix-te a eduTech</h1>
        <p className="text-slate-400">Comença a aprendre avui mateix.</p>
      </div>
      <RegisterForm />
    </div>
  );
}