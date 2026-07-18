import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { contentJsonToHtml, slugify } from "@/lib/posts";

const postSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2).optional(),
  title: z.string().min(2),
  excerpt: z.string().min(2),
  contentHtml: z.string().min(2),
  coverImage: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  publishedAt: z.string().datetime().optional().nullable(),
});

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true, email: true } } },
  });
  return NextResponse.json({
    ok: true,
    posts: posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      contentHtml: contentJsonToHtml(p.contentJson),
      coverImage: p.coverImage,
      tags: p.tags,
      published: p.published,
      publishedAt: p.publishedAt?.toISOString() ?? null,
      authorName: p.author?.name ?? p.author?.email ?? null,
    })),
  });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const session = await auth();
  const parsed = postSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { id, contentHtml, publishedAt, slug: rawSlug, ...rest } = parsed.data;
  const slug = rawSlug?.trim() || slugify(rest.title);
  const tags = rest.tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
  const data = {
    slug,
    title: rest.title,
    excerpt: rest.excerpt,
    contentJson: contentHtml,
    coverImage: rest.coverImage || null,
    tags,
    published: rest.published,
    publishedAt: rest.published
      ? publishedAt
        ? new Date(publishedAt)
        : new Date()
      : null,
    authorId: session?.user?.id ?? null,
  };

  const post = id
    ? await prisma.post.update({ where: { id }, data })
    : await prisma.post.create({ data });

  return NextResponse.json({ ok: true, post });
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = (await request.json()) as { id?: string };
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
