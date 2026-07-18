import type { Metadata } from "next";
import { FaqsAdmin } from "@/components/cms/FaqsAdmin";

export const metadata: Metadata = { title: "CMS — FAQs" };

export default function AdminFaqsPage() {
  return <FaqsAdmin />;
}
