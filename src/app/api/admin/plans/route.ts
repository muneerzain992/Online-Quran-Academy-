import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  priceUsd: z.number().int().positive(),
  classesPerWeek: z.number().int().positive(),
  minutesPerClass: z.number().int().positive(),
  features: z.array(z.string()).default([]),
  stripePriceId: z.string().optional().nullable(),
  popular: z.boolean().default(false),
});

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const plans = await prisma.plan.findMany({ orderBy: { priceUsd: "asc" } });
  return NextResponse.json({ ok: true, plans });
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
  const plan = id
    ? await prisma.plan.update({ where: { id }, data })
    : await prisma.plan.create({ data });
  return NextResponse.json({ ok: true, plan });
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = (await request.json()) as { id?: string };
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  await prisma.plan.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
