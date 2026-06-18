import { SensorType } from "@prisma/client";
import { prisma } from "@/src/core/database/prisma";
import { IAlertRepository, CreateAlertInput } from "@/src/modules/iot/interfaces/IAlertRepository";

export class PrismaAlertRepository implements IAlertRepository {
  async create(input: CreateAlertInput) {
    return prisma.alert.create({ data: input });
  }

  async findUnresolved(limit = 100) {
    return prisma.alert.findMany({
      where: { isResolved: false },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        sensorReading: true,
      },
    });
  }

  async findBySensorType(sensorType: SensorType, limit = 50) {
    return prisma.alert.findMany({
      where: { sensorType },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        sensorReading: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.alert.findUnique({
      where: { id },
      include: {
        sensorReading: true,
      },
    });
  }

  async markAsResolved(alertId: string) {
    return prisma.alert.update({
      where: { id: alertId },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
      },
    });
  }
}
