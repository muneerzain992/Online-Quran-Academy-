export const Role = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
} as const;

export type AppRole = (typeof Role)[keyof typeof Role];

export function dashboardPathForRole(role?: string | null) {
  switch (role) {
    case Role.ADMIN:
      return "/admin";
    case Role.TEACHER:
      return "/teacher";
    default:
      return "/dashboard";
  }
}
