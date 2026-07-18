import { auth } from "@/auth";
import { DashShell } from "@/components/dashboard/DashShell";
import { redirect } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/classes", label: "Classes" },
  { href: "/dashboard/progress", label: "Progress" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/book", label: "Book trial" },
];

export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <DashShell
      title="Student dashboard"
      subtitle={session.user.name ?? session.user.email ?? undefined}
      nav={nav}
    >
      {children}
    </DashShell>
  );
}
