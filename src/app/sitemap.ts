import type { MetadataRoute } from "next";
import {
  getActiveTeachers,
  getPublishedCourses,
  getPublishedPosts,
} from "@/lib/cms";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [courses, posts, teachers] = await Promise.all([
    getPublishedCourses(),
    getPublishedPosts(),
    getActiveTeachers(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/learn-quran-online", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/courses", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/teachers", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/book", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const courseRoutes: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${base}/courses/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const teacherRoutes: MetadataRoute.Sitemap = teachers.map((t) => ({
    url: `${base}/teachers/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...courseRoutes, ...teacherRoutes, ...postRoutes];
}
