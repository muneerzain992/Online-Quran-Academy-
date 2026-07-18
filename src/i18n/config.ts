export const locales = ["en", "ur", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const localeCookieName = "NEXT_LOCALE";

export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ur: "rtl",
  ar: "rtl",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
