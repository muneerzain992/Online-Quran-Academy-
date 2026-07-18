import { auth } from "@/auth";
import { DashShell } from "@/components/dashboard/DashShell";
import { redirect } from "next/navigation";

const nav = [
  { href: "/teacher", label: "Overview" },
  { href: "/teacher/students", label: "Students" },
];

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <DashShell
      title="Teacher dashboard"
      subtitle={session.user.name ?? session.user.email ?? undefined}
      nav={nav}
    >
      {children}
    </DashShell>
  );
}
