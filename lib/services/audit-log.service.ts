import { prisma } from "@/lib/db/prisma";

export async function writeAuditLog(params: {
  actorUserId?: string;
  actorStudentId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.activityLog.create({
      data: {
        actorUserId: params.actorUserId,
        actorStudentId: params.actorStudentId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        metadataJson: params.metadata ?? {}
      }
    });
  } catch {
    // best-effort logging: không làm fail request chính
  }
}
