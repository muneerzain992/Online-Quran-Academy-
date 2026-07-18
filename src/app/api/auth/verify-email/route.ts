import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { consumeVerificationToken } from "@/lib/tokens";

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    const ok = await consumeVerificationToken(
      `verify:${email}`,
      parsed.data.token,
    );
    if (!ok) {
      return NextResponse.json(
        { ok: false, message: "Verification link is invalid or expired." },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    return NextResponse.json({
      ok: true,
      message: "Email verified. You can sign in now.",
    });
  } catch (error) {
    console.error("[api/auth/verify-email]", error);
    return NextResponse.json({ ok: false, message: "Verification failed." }, { status: 500 });
  }
}
