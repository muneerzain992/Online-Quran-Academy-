import type { Locale } from "@/i18n/config";

type CourseLike = {
  slug: string;
  title: string;
  description: string;
  audience?: string;
  duration?: string;
  shortDesc?: string;
  longDesc?: string;
};

type Messages = {
  CourseTitles?: Record<
    string,
    { title: string; description: string; audience?: string; duration?: string }
  >;
  Plans?: Record<string, string>;
};

export function localizeCourse<T extends CourseLike>(
  course: T,
  messages: Messages,
  locale: Locale,
): T {
  if (locale === "en") return course;
  const tr = messages.CourseTitles?.[course.slug];
  if (!tr) return course;
  return {
    ...course,
    title: tr.title,
    description: tr.description,
    shortDesc: tr.description,
    audience: tr.audience ?? course.audience,
    duration: tr.duration ?? course.duration,
  };
}

export function localizePlanName(
  name: string,
  messages: Messages,
  locale: Locale,
) {
  if (locale === "en") return name;
  return messages.Plans?.[name] ?? name;
}
