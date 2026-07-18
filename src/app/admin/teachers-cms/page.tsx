import type { Metadata } from "next";
import { TeachersAdmin } from "@/components/cms/TeachersAdmin";

export const metadata: Metadata = { title: "CMS — Teachers" };

export default function AdminTeachersCmsPage() {
  return <TeachersAdmin />;
}
