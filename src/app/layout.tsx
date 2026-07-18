import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import {
  Fraunces,
  Geist,
  Geist_Mono,
  Noto_Naskh_Arabic,
  Noto_Nastaliq_Urdu,
} from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { SessionProvider } from "@/providers/SessionProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { site } from "@/config/site";
import { localeDirections, type Locale } from "@/i18n/config";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const notoNaskh = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.name,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  icons: {
    icon: site.logo,
    apple: site.logo,
  },
  keywords: [
    "online Quran academy",
    "learn Quran online",
    "online Quran classes for kids",
    "Quran classes USA",
    "Quran classes UK",
    "Quran classes Canada",
    "Norani Qaida online",
    "Nazra Quran",
    "Hifz online",
    "Tajweed course online",
    "female Quran teachers",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  alternates: {
    canonical: "/",
  },
};

function bodyFontClass(locale: Locale) {
  if (locale === "ur") return "font-urdu locale-ur";
  if (locale === "ar") return "font-arabic locale-ar";
  return "font-sans locale-en";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();
  const dir = localeDirections[locale];

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${notoNaskh.variable} ${notoNastaliq.variable} h-full antialiased`}
    >
      <body
        className={`min-h-full bg-background text-foreground ${bodyFontClass(locale)}`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider>
            <ThemeProvider>
              <SkipToContent />
              {children}
              <PageViewTracker />
              <Analytics />
            </ThemeProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
