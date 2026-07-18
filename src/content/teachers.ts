export type Teacher = {
  slug: string;
  name: string;
  gender: "female" | "male";
  title: string;
  bio: string;
  certifications: string[];
  subjects: string[];
  rating: number;
  experienceYears: number;
};

export const teachers: Teacher[] = [
  {
    slug: "aisha-rahman",
    name: "Ustadha Aisha Rahman",
    gender: "female",
    title: "Tajweed & Hifz Specialist",
    bio: "Al-Huda certified teacher with a patient, structured approach for girls and women. Specializes in Tajweed refinement and Hifz with strong daily revision routines.",
    certifications: ["Al-Huda Certification", "Tajweed Ijazah pathway"],
    subjects: ["Tajweed", "Hifz-ul-Quran", "Norani Qaida"],
    rating: 5,
    experienceYears: 8,
  },
  {
    slug: "fatima-siddiqui",
    name: "Ustadha Fatima Siddiqui",
    gender: "female",
    title: "Qaida & Nazra Teacher",
    bio: "Warm and encouraging with beginners — especially children overseas. Focuses on clear makharij, confidence, and a nurturing Islamic classroom environment.",
    certifications: ["Al-Huda Certification", "Child education training"],
    subjects: ["Norani Qaida", "Nazra Quran", "Islamic Duas and Salah"],
    rating: 5,
    experienceYears: 6,
  },
  {
    slug: "maryam-hassan",
    name: "Ustadha Maryam Hassan",
    gender: "female",
    title: "Translation & Sahabiyat Mentor",
    bio: "Helps students connect with the meaning of the Quran and the legacy of the Sahabiyat. Ideal for women seeking deeper understanding alongside recitation.",
    certifications: ["Al-Huda Certification", "Tafseer studies"],
    subjects: [
      "Quran Translation & Basic Tafseer",
      "Sahabiyat Course",
      "Personal Development & Life Skills",
    ],
    rating: 5,
    experienceYears: 7,
  },
  {
    slug: "omar-farooq",
    name: "Ustadh Omar Farooq",
    gender: "male",
    title: "Tajweed & Nazra Instructor",
    bio: "Experienced with boys and young men across UK, USA, and Canada time zones. Builds accurate recitation habits with clear goals and consistent feedback.",
    certifications: ["Al-Huda Certification", "Tajweed specialization"],
    subjects: ["Tajweed", "Nazra Quran", "Norani Qaida"],
    rating: 5,
    experienceYears: 9,
  },
  {
    slug: "yusuf-ahmed",
    name: "Ustadh Yusuf Ahmed",
    gender: "male",
    title: "Hifz Coach",
    bio: "Guides dedicated students through structured Hifz with careful revision cycles. Known for patience, accountability, and celebrating every milestone.",
    certifications: ["Al-Huda Certification", "Hifz program training"],
    subjects: ["Hifz-ul-Quran", "Tajweed", "Nazra Quran"],
    rating: 5,
    experienceYears: 10,
  },
  {
    slug: "ibrahim-malik",
    name: "Ustadh Ibrahim Malik",
    gender: "male",
    title: "Foundations & Salah Teacher",
    bio: "Supports new Muslims and young beginners with Kalmas, Salah, daily duas, and early Quran reading — always with respect and clarity.",
    certifications: ["Al-Huda Certification", "New Muslim mentoring"],
    subjects: ["Islamic Duas and Salah", "Norani Qaida", "Basic Rules of Arabic"],
    rating: 5,
    experienceYears: 5,
  },
];

export function getTeacherBySlug(slug: string) {
  return teachers.find((t) => t.slug === slug);
}

export function getAllTeacherSlugs() {
  return teachers.map((t) => t.slug);
}
