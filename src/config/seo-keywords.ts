/**
 * High-intent SEO keyword map for Dr Farhat Hashmi Online Quran Academy.
 * Used for metadata, internal linking, and content planning.
 */

export const primaryKeywords = [
  "Online Quran Academy",
  "Learn Quran Online",
  "Online Quran Classes",
  "Quran Classes Online",
  "Online Quran Teacher",
  "Quran Tutor Online",
  "Quran Learning Online",
  "Best Online Quran Academy",
  "Quran Academy",
  "Online Islamic Academy",
] as const;

export const transactionalKeywords = [
  "Book Quran Classes Online",
  "Free Quran Trial Class",
  "Quran Classes for Kids",
  "Online Quran Course",
  "Affordable Quran Classes",
  "Quran Teacher for Kids",
  "One to One Quran Classes",
  "Live Quran Classes",
  "Online Tajweed Classes",
  "Online Hifz Classes",
] as const;

export const countryKeywords = [
  "Online Quran Classes USA",
  "Online Quran Classes UK",
  "Online Quran Classes Canada",
  "Online Quran Classes Australia",
  "Online Quran Classes Germany",
  "Online Quran Classes Saudi Arabia",
  "Online Quran Classes UAE",
  "Online Quran Classes Qatar",
  "Online Quran Classes Bahrain",
  "Online Quran Classes Oman",
  "Quran Classes in USA",
  "Quran Classes in UK",
  "Quran Classes in Canada",
  "Quran Classes in Australia",
  "Quran Classes in Saudi Arabia",
  "Quran Classes in UAE",
] as const;

export const familyKeywords = [
  "Quran Classes for Children",
  "Quran Classes for Adults",
  "Quran Classes for Beginners",
  "Female Quran Teacher",
  "Male Quran Teacher",
  "Quran Classes for Sisters",
  "Quran Classes for Boys",
  "Quran Classes for Girls",
  "Islamic Education for Kids",
  "Quran Learning for Families",
] as const;

export const courseKeywords = [
  "Learn Tajweed Online",
  "Tajweed Course",
  "Quran Recitation Classes",
  "Hifz Quran Online",
  "Memorize Quran Online",
  "Noorani Qaida Online",
  "Learn Noorani Qaida",
  "Quran for Beginners",
  "Quran Translation Course",
  "Basic Tafseer Course",
  "Islamic Studies Online",
  "Daily Duas Course",
] as const;

export const longTailKeywords = [
  "Best Online Quran Academy for Kids",
  "Certified Online Quran Teachers",
  "Online Quran Classes with Female Teachers",
  "Online Quran Classes with Male Teachers",
  "Learn Quran from Home",
  "Online Quran Classes Worldwide",
  "Quran Academy with Free Trial",
  "Personalized Quran Learning",
  "Quran Academy for Overseas Families",
  "Best Quran Learning Platform",
] as const;

/** Compact list for meta keywords (avoid stuffing the entire set into every page). */
export const metaKeywords = [
  ...primaryKeywords,
  ...transactionalKeywords.slice(0, 6),
  ...countryKeywords.slice(0, 10),
  ...familyKeywords.slice(0, 6),
  ...courseKeywords,
  ...longTailKeywords.slice(0, 6),
];

export const seoDefaults = {
  title:
    "Online Quran Academy | Learn Quran Online with Certified Teachers",
  description:
    "Best online Quran academy for kids and adults. Live one-to-one Quran classes, Tajweed, Hifz, Noorani Qaida, and Islamic studies with male and female teachers. Free trial for families in USA, UK, Canada, Australia, Saudi Arabia, UAE, Qatar, Bahrain, Oman, and worldwide.",
  ogTitle: "Dr Farhat Hashmi Online Quran Academy — Learn Quran Online",
};
