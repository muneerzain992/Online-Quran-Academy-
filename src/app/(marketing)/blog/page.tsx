import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout";
import { Card, CardDescription, CardTitle } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion";
import { getAllPostTags, getPublishedPosts } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Blog");
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    alternates: {
      types: {
        "application/rss+xml": "/blog/rss.xml",
      },
    },
  };
}

type Props = { searchParams: Promise<{ tag?: string }> };

export default async function BlogPage({ searchParams }: Props) {
  const { tag } = await searchParams;
  const t = await getTranslations("Blog");
  const [posts, tags] = await Promise.all([
    getPublishedPosts(tag),
    getAllPostTags(),
  ]);

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("heading")}
        description={t("description")}
      >
        <p className="mt-4 text-sm text-muted">
          <a href="/blog/rss.xml" className="text-sky hover:underline">
            {t("rss")}
          </a>
        </p>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        {tags.length ? (
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`focus-ring rounded-lg px-3 py-1.5 text-xs ${
                !tag
                  ? "bg-royal/20 text-sky"
                  : "bg-white/5 text-muted hover:text-foreground"
              }`}
            >
              {t("all")}
            </Link>
            {tags.map((tagName) => (
              <Link
                key={tagName}
                href={`/blog?tag=${encodeURIComponent(tagName)}`}
                className={`focus-ring rounded-lg px-3 py-1.5 text-xs ${
                  tag === tagName
                    ? "bg-royal/20 text-sky"
                    : "bg-white/5 text-muted hover:text-foreground"
                }`}
              >
                {tagName}
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        {posts.length === 0 ? (
          <p className="text-center text-muted">
            {tag ? t("noTag") : t("noPosts")}
          </p>
        ) : (
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <StaggerItem key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="focus-ring block h-full">
                  <Card hover className="h-full">
                    <p className="text-xs uppercase tracking-wider text-sky">
                      {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <CardTitle className="mt-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                    {post.tags.length ? (
                      <p className="mt-4 text-xs text-muted">
                        {post.tags.join(" · ")}
                      </p>
                    ) : null}
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
    </>
  );
}
