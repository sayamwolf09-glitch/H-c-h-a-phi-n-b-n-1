import { auth } from "@/lib/auth";
import { fail } from "@/lib/utils/api-response";
import { ROLE_ADMIN, ROLE_TEACHER, type AppRole } from "@/lib/rbac/roles";
import { prisma } from "@/lib/db/prisma";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: fail("Bạn chưa đăng nhập", 401) };
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { roles: { include: { role: true } } }
  });
  if (!user || !user.isActive) {
    return { error: fail("Tài khoản không hợp lệ hoặc đã bị khóa", 401) };
  }

  const dbRoles = user.roles.map((item) => item.role.code);
  session.user.roles = dbRoles;

  return { session };
}

export async function requireRole(roles: AppRole[]) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult;

  const sessionRoles = authResult.session.user.roles ?? [];
  if (!roles.some((role) => sessionRoles.includes(role))) {
    return { error: fail("Bạn không có quyền thực hiện thao tác này", 403) };
  }

  return authResult;
}

export async function requireTeacherClassAccess(classRoomId: string) {
  const authResult = await requireRole([ROLE_ADMIN, ROLE_TEACHER]);
  if ("error" in authResult) return authResult;

  const sessionRoles = authResult.session.user.roles ?? [];
  if (sessionRoles.includes(ROLE_ADMIN)) {
    return authResult;
  }

  const permission = await prisma.teacherClassPermission.findUnique({
    where: {
      teacherId_classRoomId: {
        teacherId: authResult.session.user.id,
        classRoomId
      }
    }
  });

  if (!permission) {
    return { error: fail("Giáo viên không được phân quyền lớp này", 403) };
  }

  return authResult;
}
