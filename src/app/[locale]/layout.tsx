// filepath: src/app/[locale]/layout.tsx
import type { Metadata, Viewport } from "next"; // Afegim Viewport
import { Nunito } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { createClient } from '@/infrastructure/utils/supabase/server';
import "../globals.css";
import { createProfileService } from '@/application/di/container'; // <--- NOU IMPORT
// Components
import { MobileBottomBar } from "@/presentation/components/layout/MobileBottomBar";
import { DesktopNavbar } from "@/presentation/components/layout/DesktopNavbar";
import { Providers } from "../providers"; // Importem el nou provider
import { MobileTopBar } from "@/presentation/components/layout/MobileTopBar";
const nunito = Nunito({ 
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-nunito",
});

// 1. SEPAREM EL VIEWPORT (Bones pràctiques Next.js 16)
// El themeColor ara va al viewport, no a metadata directament.
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Evita zoom en inputs en mòbil (accessibilitat vs usabilitat, en apps gamificades solem bloquejar per evitar trencar la UI)
};

// 2. METADATA AVANÇADA
export const metadata: Metadata = {
  title: {
    template: "%s | EduTech",
    default: "EduTech",
  },
  description: "Aprèn tecnologia jugant. Domina GitHub, Servidors i Programació.",
  // Vinculació explícita d'icones
  icons: {
    icon: "/favicon.ico", // O el teu png petit
    shortcut: "/favicon.ico",
    apple: "/web-app-manifest-192x192.png", // Reutilitzem el gran per a Apple si no en tens un d'específic
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/web-app-manifest-192x192.png",
      },
    ],
  },
  manifest: "/manifest.webmanifest", // Next.js genera aquesta ruta automàticament des del fitxer .ts
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

  // 1. OBTENIR USUARI I PERFIL REAL
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let userProfile = null;
  
  if (user) {
      // Si estem loguejats, busquem el perfil (Avatar, Username, XP)
      const { getUserProfile } = createProfileService(supabase);
      userProfile = await getUserProfile.execute(user.id);
  }

  return (
    <html lang={locale} suppressHydrationWarning> 
      {/* suppressHydrationWarning és necessari per next-themes al html tag */}
      <body className={`${nunito.variable} font-sans antialiased`}>
        <Providers>
            <NextIntlClientProvider messages={messages}>
              
              {/* --- ESTRUCTURA RESPONSIVE --- */}
              
              {/* 1. Escriptori: Navbar complerta */}
              <DesktopNavbar userProfile={userProfile} />

              {/* 2. Mòbil: Top Bar (HUD) */}
              <MobileTopBar userProfile={userProfile} />

              {/* 3. Main Content amb fons dinàmic */}
              <main className="min-h-screen relative bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pt-20 pb-24 md:pb-0 transition-colors duration-300">
                 {children}
              </main>

              {/* 4. Mòbil: Bottom Bar (Navegació) */}
              <MobileBottomBar isLoggedIn={!!user} />

            </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}