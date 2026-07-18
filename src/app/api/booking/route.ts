import { TeacherGenderPref } from "@prisma/client";
import { NextResponse } from "next/server";
import { AdminBookingNoticeEmail } from "@/emails/AdminBookingNotice";
import { BookingConfirmationEmail } from "@/emails/BookingConfirmation";
import { site } from "@/config/site";
import { adminEmail, sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";

const genderMap: Record<
  "female" | "male" | "no-preference",
  TeacherGenderPref
> = {
  female: TeacherGenderPref.FEMALE,
  male: TeacherGenderPref.MALE,
  "no-preference": TeacherGenderPref.NO_PREFERENCE,
};

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
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const course = await prisma.course.findUnique({
      where: { slug: data.courseSlug },
    });

    const booking = await prisma.booking.create({
      data: {
        studentName: data.studentName,
        parentName: data.parentName,
        email: data.email,
        whatsapp: data.whatsapp,
        country: data.country,
        timezone: data.timezone,
        preferredTime: data.preferredTime,
        teacherGenderPref: genderMap[data.teacherGenderPref],
        courseId: course?.id,
      },
    });

    const courseTitle = course?.title ?? data.courseSlug;

    await Promise.all([
      sendEmail({
        to: data.email,
        subject: `Your ${site.trialOffer} request — ${site.shortName}`,
        react: BookingConfirmationEmail({
          studentName: data.studentName,
          parentName: data.parentName,
          courseTitle,
          preferredTime: data.preferredTime,
          academyName: site.name,
        }),
      }),
      sendEmail({
        to: adminEmail(),
        subject: `New trial booking: ${data.studentName}`,
        react: AdminBookingNoticeEmail({
          studentName: data.studentName,
          parentName: data.parentName,
          email: data.email,
          whatsapp: data.whatsapp,
          country: data.country,
          timezone: data.timezone,
          courseTitle,
          preferredTime: data.preferredTime,
          teacherGenderPref: data.teacherGenderPref,
        }),
      }),
    ]);

    return NextResponse.json({
      ok: true,
      id: booking.id,
      message:
        "Your 3 Days Free Trial Classes request is received. We will confirm shortly by email or WhatsApp.",
    });
  } catch (error) {
    console.error("[api/booking]", error);
    return NextResponse.json(
      { ok: false, message: "Could not save booking. Please try again." },
      { status: 500 },
    );
  }
}
