import { NextResponse } from "next/server";
import { getPublishedCourses } from "@/lib/cms";

export async function GET() {
  const courses = await getPublishedCourses();
  return NextResponse.json({
    ok: true,
    courses: courses.map((c) => ({ slug: c.slug, title: c.title })),
  });
}
