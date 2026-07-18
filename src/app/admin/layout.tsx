import { auth } from "@/auth";
import { DashShell } from "@/components/dashboard/DashShell";
import { redirect } from "next/navigation";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/teachers-cms", label: "Teachers" },
  { href: "/admin/plans", label: "Plans" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/posts", label: "Blog" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/subscribers", label: "Subscribers" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <DashShell
      title="Admin dashboard"
      subtitle={session.user.name ?? session.user.email ?? undefined}
      nav={nav}
    >
      {children}
    </DashShell>
  );
}
