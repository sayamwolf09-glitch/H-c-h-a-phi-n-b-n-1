import { ROLE_ADMIN, ROLE_TEACHER } from "@/lib/rbac/roles";

export type Role = typeof ROLE_ADMIN | typeof ROLE_TEACHER;

const MATRIX: Record<Role, string[]> = {
  ADMIN: [
    "classes:read",
    "classes:write",
    "students:read",
    "students:write",
    "questions:read",
    "questions:write",
    "quizzes:read",
    "quizzes:write",
    "reports:read",
    "reports:export"
  ],
  TEACHER: [
    "classes:read",
    "students:read",
    "students:write",
    "questions:read",
    "questions:write",
    "quizzes:read",
    "quizzes:write",
    "reports:read",
    "reports:export"
  ]
};

export function canAccess(roles: string[], permission: string): boolean {
  return roles.some((role) => {
    if (role !== ROLE_ADMIN && role !== ROLE_TEACHER) return false;
    return MATRIX[role].includes(permission);
  });
}

export function listPermissionsForRole(role: Role): string[] {
  return MATRIX[role];
}
