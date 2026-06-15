import { ManualRecordType } from "@prisma/client";
import { prisma } from "@/src/core/database/prisma";

export type ManualRecordInput = {
  type: ManualRecordType;
  quantity?: number;
  notes?: string;
  observedAt: Date;
  userId: string;
};

export class PrismaManualRecordRepository {
  create(input: ManualRecordInput) {
    return prisma.manualRecord.create({ data: input });
  }

  findByUser(userId: string) {
    return prisma.manualRecord.findMany({ where: { userId, isDeleted: false }, orderBy: { observedAt: "desc" } });
  }

  update(id: string, userId: string, input: Partial<ManualRecordInput>) {
    return prisma.manualRecord.update({ where: { id, userId }, data: input });
  }

  async softDelete(id: string, userId: string) {
    await prisma.manualRecord.update({
      where: { id, userId },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }
}
