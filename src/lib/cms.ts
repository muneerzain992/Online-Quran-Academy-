import { prisma } from "@/lib/prisma";
import { blogPosts as staticPosts } from "@/content/blog";
import { courses as staticCourses } from "@/content/courses";
import { teachers as staticTeachers } from "@/content/teachers";
import { homeFaqs, pricingPlans, testimonials } from "@/content/home";
import { contentJsonToHtml } from "@/lib/posts";

export async function getPublishedCourses() {
  try {
    const rows = await prisma.course.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    if (rows.length) {
      return rows.map((c) => ({
        slug: c.slug,
        title: c.title,
        description: c.shortDesc,
        shortDesc: c.shortDesc,
        longDesc: c.longDesc,
        audience: c.audience,
        duration: c.duration,
        level: c.level,
        outcomes: [] as string[],
      }));
    }
  } catch {
    /* fallback */
  }
  return staticCourses.map((c) => ({
    ...c,
    shortDesc: c.description,
    description: c.description,
  }));
}

export async function getCourseBySlug(slug: string) {
  try {
    const c = await prisma.course.findFirst({
      where: { slug, published: true },
    });
    if (c) {
      return {
        slug: c.slug,
        title: c.title,
        description: c.shortDesc,
        shortDesc: c.shortDesc,
        longDesc: c.longDesc,
        audience: c.audience,
        duration: c.duration,
        level: c.level,
        outcomes: [
          "Personalized one-to-one guidance",
          "Flexible scheduling",
          "Certified teaching approach",
        ],
      };
    }
  } catch {
    /* fallback */
  }
  return staticCourses.find((c) => c.slug === slug) ?? null;
}

export async function getActiveTeachers() {
  try {
    const rows = await prisma.teacher.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
    if (rows.length) {
      return rows.map((t) => ({
        slug: t.slug,
        name: t.name,
        gender: t.gender === "FEMALE" ? ("female" as const) : ("male" as const),
        title: t.subjects[0] ?? "Quran Teacher",
        bio: t.bio,
        certifications: t.certifications,
        subjects: t.subjects,
        rating: t.rating,
        experienceYears: 5,
      }));
    }
  } catch {
    /* fallback */
  }
  return staticTeachers;
}

export async function getTeacherBySlug(slug: string) {
  try {
    const t = await prisma.teacher.findFirst({
      where: { slug, active: true },
    });
    if (t) {
      return {
        slug: t.slug,
        name: t.name,
        gender: t.gender === "FEMALE" ? ("female" as const) : ("male" as const),
        title: t.subjects[0] ?? "Quran Teacher",
        bio: t.bio,
        certifications: t.certifications,
        subjects: t.subjects,
        rating: t.rating,
        experienceYears: 5,
      };
    }
  } catch {
    /* fallback */
  }
  return staticTeachers.find((t) => t.slug === slug) ?? null;
}

export async function getPlans() {
  try {
    const rows = await prisma.plan.findMany({ orderBy: { priceUsd: "asc" } });
    if (rows.length) {
      return rows.map((p) => ({
        id: p.name.toLowerCase(),
        name: p.name,
        price: `$${p.priceUsd}`,
        period: "/month",
        classesPerWeek: `${p.classesPerWeek} Classes/Week`,
        duration: `${p.minutesPerClass} Minutes Each`,
        classesPerWeekNum: p.classesPerWeek,
        minutesPerClass: p.minutesPerClass,
        popular: p.popular,
      }));
    }
  } catch {
    /* fallback */
  }
  return pricingPlans.map((p) => ({
    ...p,
    classesPerWeekNum:
      p.classesPerWeek === "3 Classes/Week"
        ? 3
        : p.classesPerWeek === "5 Classes/Week"
          ? 5
          : 6,
    minutesPerClass: p.duration.includes("45") ? 45 : 30,
  }));
}

export async function getPublishedFaqs() {
  try {
    const rows = await prisma.fAQ.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    if (rows.length) {
      return rows.map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
      }));
    }
  } catch {
    /* fallback */
  }
  return homeFaqs.map((f) => ({ ...f }));
}

export async function getPublishedTestimonials() {
  try {
    const rows = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    if (rows.length) {
      return rows.map((t) => ({
        quote: t.quote,
        name: t.name,
        location: t.location,
        rating: t.rating,
      }));
    }
  } catch {
    /* fallback */
  }
  return testimonials.map((t) => ({ ...t }));
}

type CmsPost = {
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  coverImage?: string | null;
  tags: string[];
  authorName: string;
  publishedAt: string;
};

function mergePosts(dbPosts: CmsPost[]): CmsPost[] {
  const bySlug = new Map<string, CmsPost>();
  for (const p of dbPosts) {
    bySlug.set(p.slug, p);
  }
  // Static SEO posts win for matching slugs so blog content stays keyword-fresh.
  for (const p of staticPosts) {
    bySlug.set(p.slug, {
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      contentHtml: p.contentHtml,
      coverImage: p.coverImage ?? null,
      tags: p.tags,
      authorName: p.authorName,
      publishedAt: p.publishedAt,
    });
  }
  return [...bySlug.values()].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getPublishedPosts(tag?: string) {
  let dbPosts: CmsPost[] = [];
  try {
    const rows = await prisma.post.findMany({
      where: {
        published: true,
        ...(tag ? { tags: { has: tag } } : {}),
      },
      orderBy: { publishedAt: "desc" },
      include: { author: { select: { name: true } } },
    });
    dbPosts = rows.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      contentHtml: contentJsonToHtml(p.contentJson),
      coverImage: p.coverImage,
      tags: p.tags,
      authorName: p.author?.name ?? "Academy",
      publishedAt: (p.publishedAt ?? p.createdAt).toISOString(),
    }));
  } catch {
    /* fallback to static only */
  }
  const all = mergePosts(dbPosts);
  return tag ? all.filter((p) => p.tags.includes(tag)) : all;
}

export async function getPostBySlug(slug: string) {
  const staticPost = staticPosts.find((p) => p.slug === slug);
  if (staticPost) {
    return {
      slug: staticPost.slug,
      title: staticPost.title,
      excerpt: staticPost.excerpt,
      contentHtml: staticPost.contentHtml,
      coverImage: staticPost.coverImage ?? null,
      tags: staticPost.tags,
      authorName: staticPost.authorName,
      publishedAt: staticPost.publishedAt,
    };
  }
  try {
    const p = await prisma.post.findFirst({
      where: { slug, published: true },
      include: { author: { select: { name: true } } },
    });
    if (p) {
      return {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        contentHtml: contentJsonToHtml(p.contentJson),
        coverImage: p.coverImage,
        tags: p.tags,
        authorName: p.author?.name ?? "Academy",
        publishedAt: (p.publishedAt ?? p.createdAt).toISOString(),
      };
    }
  } catch {
    /* fallback */
  }
  return null;
}

export async function getAllPostTags() {
  const posts = await getPublishedPosts();
  return [...new Set(posts.flatMap((p) => p.tags))].sort();
}

export type SearchHit = {
  type: "course" | "post";
  title: string;
  excerpt: string;
  href: string;
  tags?: string[];
};

export async function searchContent(query: string): Promise<SearchHit[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const hits: SearchHit[] = [];

  try {
    const [courses, posts] = await Promise.all([
      prisma.course.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { shortDesc: { contains: q, mode: "insensitive" } },
            { longDesc: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 8,
        orderBy: { order: "asc" },
      }),
      prisma.post.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
            { tags: { has: q.toLowerCase() } },
          ],
        },
        take: 8,
        orderBy: { publishedAt: "desc" },
      }),
    ]);

    for (const c of courses) {
      hits.push({
        type: "course",
        title: c.title,
        excerpt: c.shortDesc,
        href: `/courses/${c.slug}`,
      });
    }
    for (const p of posts) {
      hits.push({
        type: "post",
        title: p.title,
        excerpt: p.excerpt,
        href: `/blog/${p.slug}`,
        tags: p.tags,
      });
    }
    if (hits.length) return hits;
  } catch {
    /* fallback below */
  }

  const ql = q.toLowerCase();
  for (const c of staticCourses) {
    if (
      c.title.toLowerCase().includes(ql) ||
      c.description.toLowerCase().includes(ql)
    ) {
      hits.push({
        type: "course",
        title: c.title,
        excerpt: c.description,
        href: `/courses/${c.slug}`,
      });
    }
  }
  for (const p of staticPosts) {
    if (
      p.title.toLowerCase().includes(ql) ||
      p.excerpt.toLowerCase().includes(ql) ||
      p.tags.some((t) => t.includes(ql))
    ) {
      hits.push({
        type: "post",
        title: p.title,
        excerpt: p.excerpt,
        href: `/blog/${p.slug}`,
        tags: p.tags,
      });
    }
  }
  return hits.slice(0, 16);
}
