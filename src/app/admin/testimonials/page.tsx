import type { Metadata } from "next";
import { TestimonialsAdmin } from "@/components/cms/TestimonialsAdmin";

export const metadata: Metadata = { title: "CMS — Testimonials" };

export default function AdminTestimonialsPage() {
  return <TestimonialsAdmin />;
}
