import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { WelcomeAccountEmail } from "@/emails/WelcomeAccount";
import { site } from "@/config/site";
import { appBaseUrl, sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { createRawToken, storeVerificationToken } from "@/lib/tokens";
import { firstZodError, registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { ok: false, message: "Database is not configured." },
        { status: 503 },
      );
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: firstZodError(parsed.error),
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const email = parsed.data.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { ok: false, message: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash,
        role: Role.STUDENT,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    const token = createRawToken();
    await storeVerificationToken(`verify:${email}`, token, 48);
    const verifyUrl = `${appBaseUrl()}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    const mail = await sendEmail({
      to: email,
      subject: `Welcome to ${site.shortName} — verify your email`,
      react: WelcomeAccountEmail({
        name: parsed.data.name,
        academyName: site.name,
        verifyUrl,
      }),
    });

    return NextResponse.json({
      ok: true,
      user,
      emailSent: mail.ok,
      emailPreviewUrl:
        mail.ok && "previewUrl" in mail ? mail.previewUrl : undefined,
      message: mail.ok
        ? "Account created. Check your email to verify your address."
        : "Account created. Email could not be sent — you can still sign in.",
    });
  } catch (error) {
    console.error("[api/auth/register]", error);
    return NextResponse.json(
      { ok: false, message: "Could not create account." },
      { status: 500 },
    );
  }
}
