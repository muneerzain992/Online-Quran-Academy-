import { auth } from "@/auth";
import { Role } from "@/lib/roles";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return null;
  }
  return session;
}
