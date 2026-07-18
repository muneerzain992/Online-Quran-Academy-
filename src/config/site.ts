/**
 * Central brand & contact config.
 * Change phone/email/socials here — never hardcode them in components.
 */
export const site = {
  name: "Dr Farhat Hashmi Online Quran Academy",
  shortName: "DFH Academy",
  monogram: "DFH",
  tagline: "Illuminating Hearts Through Quranic Education",
  description:
    "Trusted online Quran education for overseas Pakistani and Muslim families, with certified teachers and a safe, values-based Islamic environment.",

  email: "ferhathashmi1@gmail.com",
  phone: "+92 309 7339756",
  /** Digits only for wa.me links */
  whatsappE164: "923097339756",
  facebookUrl: "https://www.facebook.com/share/1DYCF1J4oE/",
  instagramUrl:
    "https://www.instagram.com/ferhathashmi?igsh=MW00MjE1aDI4eGFreA==",
  tiktokUrl:
    "https://www.tiktok.com/@dr.farhat.hashmi37?_r=1&_t=ZS-988tLJtPaxm",
  logo: "/logo.png",

  serving:
    "Serving Students Worldwide from UK, USA & Canada, Saudi Arabia, Bahrain, Qatar, Oman and all over the world",
  regions: [
    "UK",
    "USA",
    "Canada",
    "Saudi Arabia",
    "Bahrain",
    "Qatar",
    "Oman",
  ] as const,

  trialOffer: "3 Days Free Trial Classes",
  startingPrice: "$50/month",

  nav: [
    { key: "home", href: "/" },
    { key: "courses", href: "/courses" },
    { key: "teachers", href: "/teachers" },
    { key: "blog", href: "/blog" },
    { key: "contact", href: "/contact" },
  ] as const,

  cta: {
    demo: { labelKey: "demo", href: "/book" },
    bookTrial: { labelKey: "bookTrial", href: "/book" },
    exploreCourses: { labelKey: "exploreCourses", href: "/courses" },
  },

  footerQuickLinks: [
    { key: "home", href: "/" },
    { key: "teachers", href: "/teachers" },
    { key: "courses", href: "/courses" },
    { key: "blog", href: "/blog" },
    { key: "contact", href: "/contact" },
  ] as const,

  footerCourses: [
    { label: "Tajweed Course", href: "/courses/tajweed" },
    { label: "Hifz-ul-Quran", href: "/courses/hifz-ul-quran" },
    { label: "Quran Translation & Basic Tafseer", href: "/courses/quran-translation-tafseer" },
    { label: "Islamic Duas and Salah", href: "/courses/islamic-duas-salah" },
    { label: "Sahabiyat Course", href: "/courses/sahabiyat" },
    { label: "Personal Development & Life Skills", href: "/courses/personal-development" },
  ] as const,

  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ] as const,

  locales: [
    { code: "en", label: "EN", dir: "ltr" },
    { code: "ur", label: "اردو", dir: "rtl" },
    { code: "ar", label: "العربية", dir: "rtl" },
  ] as const,
} as const;

export type SiteConfig = typeof site;

/** Social profiles for JSON-LD / sharing (WhatsApp uses wa.me without prefill). */
export function getSocialProfileUrls() {
  return [
    site.facebookUrl,
    site.instagramUrl,
    site.tiktokUrl,
    `https://wa.me/${site.whatsappE164}`,
  ];
}

/** Prefills WhatsApp chat with the free-trial request message. */
export function getWhatsAppUrl(
  message = "Assalamu Alaikum! I'd like to book my 3 days free trial classes.",
) {
  return `https://wa.me/${site.whatsappE164}?text=${encodeURIComponent(message)}`;
}

export function getMailtoUrl(subject?: string) {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${site.email}${query}`;
}

export function getTelUrl() {
  return `tel:${site.phone.replace(/\s/g, "")}`;
}
