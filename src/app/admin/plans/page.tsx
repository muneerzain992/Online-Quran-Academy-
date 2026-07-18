import type { Metadata } from "next";
import { PlansAdmin } from "@/components/cms/PlansAdmin";

export const metadata: Metadata = { title: "CMS — Plans" };

export default function AdminPlansPage() {
  return <PlansAdmin />;
}
