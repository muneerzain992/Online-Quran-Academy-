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
import { metaKeywords, seoDefaults } from "@/config/seo-keywords";
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
  weight: ["500", "600", "700"],
});

const notoNaskh = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  preload: false,
  display: "swap",
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  preload: false,
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seoDefaults.title,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  icons: {
    icon: site.logo,
    apple: site.logo,
  },
  keywords: [...metaKeywords],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: site.name,
    title: seoDefaults.ogTitle,
    description: site.description,
    images: [
      {
        url: site.logo,
        width: 512,
        height: 512,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoDefaults.ogTitle,
    description: site.description,
    images: [site.logo],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "education",
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
  const fontVars = [
    geistSans.variable,
    geistMono.variable,
    fraunces.variable,
    locale === "ar" || locale === "ur" ? notoNaskh.variable : "",
    locale === "ur" ? notoNastaliq.variable : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${fontVars} h-full antialiased`}
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
