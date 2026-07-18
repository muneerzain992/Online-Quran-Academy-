import { NextResponse } from "next/server";
import { WelcomeSubscriberEmail } from "@/emails/WelcomeSubscriber";
import { site } from "@/config/site";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Database is not configured. Add DATABASE_URL to .env.local (see .env.example).",
        },
        { status: 503 },
      );
    }

    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { email, locale } = parsed.data;

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({
        ok: true,
        message: "You are already subscribed. JazakAllah Khair!",
      });
    }

    await prisma.subscriber.create({
      data: { email, locale: locale ?? "en" },
    });

    await sendEmail({
      to: email,
      subject: `Welcome to ${site.shortName}`,
      react: WelcomeSubscriberEmail({
        academyName: site.name,
        trialOffer: site.trialOffer,
      }),
    });

    return NextResponse.json({
      ok: true,
      message: "Subscribed successfully. Check your inbox for a welcome note.",
    });
  } catch (error) {
    console.error("[api/newsletter]", error);
    return NextResponse.json(
      { ok: false, message: "Could not subscribe. Please try again." },
      { status: 500 },
    );
  }
}
