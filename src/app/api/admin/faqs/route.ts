import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  id: z.string().optional(),
  question: z.string().min(2),
  answer: z.string().min(2),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ ok: true, faqs });
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
  const faq = id
    ? await prisma.fAQ.update({ where: { id }, data })
    : await prisma.fAQ.create({ data });
  return NextResponse.json({ ok: true, faq });
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = (await request.json()) as { id?: string };
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  await prisma.fAQ.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
