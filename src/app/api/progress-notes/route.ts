import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/roles";

const schema = z.object({
  studentUserId: z.string().min(1),
  teacherUserId: z.string().min(1),
  content: z.string().min(3),
});

export async function POST(request: Request) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== Role.TEACHER && session.user.role !== Role.ADMIN)
  ) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const note = await prisma.progressNote.create({
      data: {
        studentUserId: parsed.data.studentUserId,
        teacherUserId: session.user.id,
        content: parsed.data.content,
      },
    });

    return NextResponse.json({ ok: true, note });
  } catch (error) {
    console.error("[api/progress-notes]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
