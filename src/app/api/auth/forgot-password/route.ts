import { NextResponse } from "next/server";
import { PasswordResetEmail } from "@/emails/PasswordReset";
import { site } from "@/config/site";
import { appBaseUrl, sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { createRawToken, storeVerificationToken } from "@/lib/tokens";
import { firstZodError, forgotPasswordSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: firstZodError(parsed.error) },
        { status: 400 },
      );
    }

    const email = parsed.data.email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to avoid email enumeration
    if (!user?.passwordHash) {
      return NextResponse.json({
        ok: true,
        message: "If an account exists, a reset link has been sent.",
      });
    }

    const token = createRawToken();
    await storeVerificationToken(`reset:${email}`, token, 1);
    const resetUrl = `${appBaseUrl()}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    const mail = await sendEmail({
      to: email,
      subject: `Reset your ${site.shortName} password`,
      react: PasswordResetEmail({
        name: user.name ?? "",
        academyName: site.name,
        resetUrl,
      }),
    });

    return NextResponse.json({
      ok: true,
      emailSent: mail.ok,
      emailPreviewUrl:
        mail.ok && "previewUrl" in mail ? mail.previewUrl : undefined,
      message: "If an account exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("[api/auth/forgot-password]", error);
    return NextResponse.json({ ok: false, message: "Could not process request." }, { status: 500 });
  }
}
