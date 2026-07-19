import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout";
import { Button } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/config/site";
import { getPostBySlug, getPublishedPosts } from "@/lib/cms";
import { blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article" };
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = (await getPublishedPosts())
    .filter((p) => p.slug !== post.slug)
    .filter((p) => p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={blogPostingJsonLd({
          title: post.title,
          excerpt: post.excerpt,
          slug: post.slug,
          publishedAt: post.publishedAt,
          authorName: post.authorName,
          tags: post.tags,
          coverImage: post.coverImage,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <PageHero
        eyebrow="Blog"
        title={post.title}
        description={post.excerpt}
      >
        <p className="mt-4 text-sm text-muted">
          {new Date(post.publishedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          {" · "}
          {post.authorName}
          {post.tags.length ? ` · ${post.tags.join(", ")}` : ""}
        </p>
      </PageHero>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Reveal>
          <div
            className="prose dark:prose-invert max-w-none text-muted prose-headings:font-display prose-headings:text-foreground prose-a:text-sky"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </Reveal>

        <div className="mt-12 flex flex-wrap gap-3 border-t border-border pt-8">
          <Button href="/book">Book Free Trial Class</Button>
          <Button href="/blog" variant="secondary">
            All articles
          </Button>
        </div>
      </article>

      {related.length ? (
        <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Related reading
          </h2>
          <ul className="mt-4 space-y-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/blog/${r.slug}`}
                  className="focus-ring text-sm text-sky hover:underline"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-xs text-muted">
            © {new Date().getFullYear()} {site.shortName}
          </p>
        </section>
      ) : null}
    </>
  );
}
