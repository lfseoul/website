import { Analytics } from "@vercel/analytics/next"
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { routing } from "../../i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lycée Français de Séoul",
  description: "Excellence in international education.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  // Fetch all messages for the current language
  const messages = await getMessages();

  // Check if draft mode is active
  const { isEnabled } = await draftMode();

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased min-h-full flex flex-col`}>
        {/* 3. Wrap your app in the provider and pass the messages */}
        <NextIntlClientProvider messages={messages}>
          {children}
          {isEnabled && <VisualEditing />}
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}