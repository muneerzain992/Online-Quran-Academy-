import type { Metadata } from "next";
import { CoursesAdmin } from "@/components/cms/CoursesAdmin";

export const metadata: Metadata = { title: "CMS — Courses" };

export default function AdminCoursesPage() {
  return <CoursesAdmin />;
}
