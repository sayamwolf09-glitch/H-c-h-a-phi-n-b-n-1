import { canAccess, listPermissionsForRole } from "@/lib/rbac/matrix";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function run() {
  const adminPerms = listPermissionsForRole("ADMIN");
  const teacherPerms = listPermissionsForRole("TEACHER");

  assert(adminPerms.includes("classes:write"), "ADMIN must have classes:write");
  assert(teacherPerms.includes("students:write"), "TEACHER must have students:write");
  assert(canAccess(["ADMIN"], "reports:export"), "ADMIN should export reports");
  assert(canAccess(["TEACHER"], "questions:write"), "TEACHER should write questions");
  assert(!canAccess(["TEACHER"], "system:root"), "TEACHER should not access system:root");

  console.log("✅ RBAC matrix smoke passed");
}

run();
