import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import { dashboardPathForRole, Role } from "@/lib/roles";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isStudentDash = pathname.startsWith("/dashboard");
  const isTeacherDash = pathname.startsWith("/teacher");
  const isAdminDash = pathname.startsWith("/admin");
  const isProtected = isStudentDash || isTeacherDash || isAdminDash;

  if (isAuthPage && session?.user) {
    return NextResponse.redirect(
      new URL(dashboardPathForRole(role), req.url),
    );
  }

  if (isProtected && !session?.user) {
    const login = new URL("/login", req.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  if (isAdminDash && role !== Role.ADMIN) {
    return NextResponse.redirect(new URL(dashboardPathForRole(role), req.url));
  }

  if (isTeacherDash && role !== Role.TEACHER && role !== Role.ADMIN) {
    return NextResponse.redirect(new URL(dashboardPathForRole(role), req.url));
  }

  if (isStudentDash && role === Role.TEACHER) {
    return NextResponse.redirect(new URL("/teacher", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/teacher/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
