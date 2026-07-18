import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { consumeVerificationToken } from "@/lib/tokens";
import { firstZodError, resetPasswordSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: firstZodError(parsed.error) },
        { status: 400 },
      );
    }

    const email = parsed.data.email.toLowerCase();
    const ok = await consumeVerificationToken(
      `reset:${email}`,
      parsed.data.token,
    );
    if (!ok) {
      return NextResponse.json(
        { ok: false, message: "Reset link is invalid or expired." },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    return NextResponse.json({
      ok: true,
      message: "Password updated. You can sign in now.",
    });
  } catch (error) {
    console.error("[api/auth/reset-password]", error);
    return NextResponse.json(
      { ok: false, message: "Could not reset password." },
      { status: 500 },
    );
  }
}
