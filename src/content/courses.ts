import { homeCourses, pricingPlans, type HomeCourse } from "./home";

export type Course = HomeCourse & {
  level: string;
  longDesc: string;
  outcomes: string[];
};

export const courses: Course[] = homeCourses.map((course) => {
  const extras: Record<string, Omit<Course, keyof HomeCourse>> = {
    tajweed: {
      level: "Beginner to Advanced",
      longDesc:
        "Master the rules of Tajweed so every letter is pronounced from its correct origin. Lessons are paced to your level with regular feedback in one-to-one sessions.",
      outcomes: [
        "Correct makharij and sifaat",
        "Fluent, beautiful recitation",
        "Confidence reading any passage",
      ],
    },
    "hifz-ul-quran": {
      level: "Intermediate to Advanced",
      longDesc:
        "A structured memorization journey with daily new lessons and revision (sabaq, sabqi, manzil) under a dedicated teacher who tracks progress carefully.",
      outcomes: [
        "Strong, lasting memorization",
        "Daily revision habits",
        "Support toward becoming a Hafiza",
      ],
    },
    "quran-translation-tafseer": {
      level: "All levels",
      longDesc:
        "Understand the meaning of the Quran through clear translation and accessible tafseer, connecting verses to daily life and Islamic values.",
      outcomes: [
        "Clearer understanding of Quranic message",
        "Basic tafseer literacy",
        "Stronger spiritual connection",
      ],
    },
    "islamic-duas-salah": {
      level: "Beginner",
      longDesc:
        "Learn essential daily duas, the method of Salah, and foundational Islamic practices in a warm, supportive environment for children and adults.",
      outcomes: [
        "Correct Salah method",
        "Core daily duas memorized",
        "Foundational Islamic habits",
      ],
    },
    sahabiyat: {
      level: "All levels",
      longDesc:
        "Explore the lives of the Sahabiyat — their faith, character, sacrifices, and contributions — designed especially for women and young girls.",
      outcomes: [
        "Inspiration from early Muslim women",
        "Character and values lessons",
        "Stronger Islamic identity",
      ],
    },
    "personal-development": {
      level: "Youth & women",
      longDesc:
        "Build practical life skills while staying rooted in Islamic values — confidence, communication, and personal growth for Muslim youth and women.",
      outcomes: [
        "Practical life skills",
        "Islamic values in daily decisions",
        "Personal confidence and growth",
      ],
    },
    "norani-qaida": {
      level: "Beginner",
      longDesc:
        "The ideal starting point for absolute beginners. Letter recognition, joining, and correct pronunciation with Tajweed foundations.",
      outcomes: [
        "Arabic letter mastery",
        "Joining and fluency basics",
        "Ready for Nazra Quran",
      ],
    },
    "nazra-quran": {
      level: "Beginner to Intermediate",
      longDesc:
        "Complete fluent recitation of the whole Quran with Tajweed, verse by verse, after finishing Qaida — guided in live one-to-one classes.",
      outcomes: [
        "Full Quran Nazra completion",
        "Tajweed applied throughout",
        "Independent fluent reading",
      ],
    },
  };

  return {
    ...course,
    ...(extras[course.slug] ?? {
      level: "All levels",
      longDesc: course.description,
      outcomes: ["Personalized progress", "One-to-one guidance", "Flexible timing"],
    }),
  };
});

export function getCourseBySlug(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export function getAllCourseSlugs() {
  return courses.map((c) => c.slug);
}

export { pricingPlans };
