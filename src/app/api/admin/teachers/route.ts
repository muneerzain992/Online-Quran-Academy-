import { Gender } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2),
  name: z.string().min(2),
  bio: z.string().min(2),
  gender: z.enum(["FEMALE", "MALE"]),
  certifications: z.array(z.string()).default([]),
  subjects: z.array(z.string()).default([]),
  rating: z.number().min(1).max(5).default(5),
  active: z.boolean().default(true),
});

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const teachers = await prisma.teacher.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ ok: true, teachers });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }
  const { id, gender, ...rest } = parsed.data;
  const data = { ...rest, gender: gender as Gender };
  const teacher = id
    ? await prisma.teacher.update({ where: { id }, data })
    : await prisma.teacher.create({ data });
  return NextResponse.json({ ok: true, teacher });
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = (await request.json()) as { id?: string };
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  await prisma.teacher.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
