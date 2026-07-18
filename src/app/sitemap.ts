import type { MetadataRoute } from "next";
import { getPublishedCourses, getPublishedPosts } from "@/lib/cms";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [courses, posts] = await Promise.all([
    getPublishedCourses(),
    getPublishedPosts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/courses",
    "/teachers",
    "/blog",
    "/contact",
    "/book",
    "/pricing",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const courseRoutes: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${base}/courses/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...courseRoutes, ...postRoutes];
}
