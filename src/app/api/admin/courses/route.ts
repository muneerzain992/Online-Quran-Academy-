import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const courseSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2),
  title: z.string().min(2),
  shortDesc: z.string().min(2),
  longDesc: z.string().min(2),
  audience: z.string().min(2),
  duration: z.string().min(1),
  level: z.string().min(1),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const courses = await prisma.course.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ ok: true, courses });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const parsed = courseSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }
  const { id, ...data } = parsed.data;
  const course = id
    ? await prisma.course.update({ where: { id }, data })
    : await prisma.course.create({ data });
  return NextResponse.json({ ok: true, course });
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = (await request.json()) as { id?: string };
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
