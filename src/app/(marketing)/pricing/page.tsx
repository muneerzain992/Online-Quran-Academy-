import { redirect } from "next/navigation";

/** Pricing lives on the courses page. */
export default function PricingPage() {
  redirect("/courses#pricing");
}
