// filepath: src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css"; // Assegura't que la ruta és correcta

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechMastery",
  description: "Aprèn tecnologia jugant",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // En Next.js 15/16 params és una Promise, cal fer await
  const { locale } = await params;
  
  // Obtenim els missatges del servidor per passar-los al client
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}