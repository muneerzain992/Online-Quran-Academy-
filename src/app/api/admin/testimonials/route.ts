import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  location: z.string().min(2),
  quote: z.string().min(2),
  rating: z.number().int().min(1).max(5).default(5),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ ok: true, testimonials });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }
  const { id, ...data } = parsed.data;
  const testimonial = id
    ? await prisma.testimonial.update({ where: { id }, data })
    : await prisma.testimonial.create({ data });
  return NextResponse.json({ ok: true, testimonial });
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = (await request.json()) as { id?: string };
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
