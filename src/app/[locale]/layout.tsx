// filepath: src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { createClient } from '@/infrastructure/utils/supabase/server'; // Importem el client
import "../globals.css";

// Components de Navegació
import { MobileBottomBar } from "@/presentation/components/layout/MobileBottomBar";
import { DesktopNavbar } from "@/presentation/components/layout/DesktopNavbar";

const nunito = Nunito({ 
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "EduTech",
  description: "Aprèn tecnologia jugant",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  // 1. COMPROVACIÓ DE SESSIÓ AL SERVIDOR
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user; // true si hi ha usuari, false si no

  return (
    <html lang={locale}>
      <body className={`${nunito.variable} font-sans bg-slate-950 text-white antialiased pb-24 md:pb-0 md:pt-20`}>
        {/* pb-24: Padding inferior al mòbil perquè la barra no tapi contingut.
            md:pt-20: Padding superior a l'escriptori perquè la navbar no tapi contingut.
        */}

        <NextIntlClientProvider messages={messages}>
          
          {/* BARRA SUPERIOR (ESCRIPTORI) */}
          <DesktopNavbar isLoggedIn={isLoggedIn} />

          {/* CONTINGUT PRINCIPAL */}
          <main className="min-h-screen relative">
             {children}
          </main>

          {/* BARRA INFERIOR (MÒBIL) */}
          <MobileBottomBar isLoggedIn={isLoggedIn} />

        </NextIntlClientProvider>
      </body>
    </html>
  );
}