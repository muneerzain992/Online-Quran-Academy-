import { NextResponse } from "next/server";
import { AdminContactNoticeEmail } from "@/emails/AdminContactNotice";
import { ContactAutoReplyEmail } from "@/emails/ContactAutoReply";
import { site } from "@/config/site";
import { adminEmail, sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

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
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const saved = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
      },
    });

    await Promise.all([
      sendEmail({
        to: data.email,
        subject: `We received your message — ${site.shortName}`,
        react: ContactAutoReplyEmail({
          name: data.name,
          academyName: site.name,
        }),
      }),
      sendEmail({
        to: adminEmail(),
        subject: `Contact: ${data.subject}`,
        react: AdminContactNoticeEmail(data),
      }),
    ]);

    return NextResponse.json({
      ok: true,
      id: saved.id,
      message: "Thanks for reaching out. We will reply soon.",
    });
  } catch (error) {
    console.error("[api/contact]", error);
    return NextResponse.json(
      { ok: false, message: "Could not send message. Please try again." },
      { status: 500 },
    );
  }
}
