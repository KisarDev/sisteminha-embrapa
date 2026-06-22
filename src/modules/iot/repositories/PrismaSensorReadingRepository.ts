import { SensorType } from "@prisma/client";
import { prisma } from "@/src/core/database/prisma";
import { SensorReadingInput } from "@/src/modules/iot/interfaces/IIotProvider";
import { ISensorReadingRepository } from "@/src/modules/iot/interfaces/ISensorReadingRepository";

export class PrismaSensorReadingRepository implements ISensorReadingRepository {
  create(input: SensorReadingInput & { userId: string }) {
    return prisma.sensorReading.create({ data: input });
  }

  findBySensorType(sensorType: SensorType, userId: string, limit = 100) {
    return prisma.sensorReading.findMany({
      where: { sensorType, userId },
      orderBy: { measuredAt: "desc" },
      take: limit,
    });
  }

  findByDateRange(sensorType: SensorType, userId: string, startDate: Date, endDate: Date) {
    return prisma.sensorReading.findMany({
      where: {
        sensorType,
        userId,
        measuredAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { measuredAt: "asc" },
    });
  }

  async getStatsBySensorType(sensorType: SensorType, userId: string, startDate?: Date, endDate?: Date) {
    const where: Record<string, unknown> = {
      sensorType,
      userId,
      ...(startDate || endDate
        ? {
            measuredAt: {
              ...(startDate ? { gte: startDate } : {}),
              ...(endDate ? { lte: endDate } : {}),
            },
          }
        : {}),
    };

    const [aggregate, latest] = await Promise.all([
      prisma.sensorReading.aggregate({
        where,
        _count: { _all: true },
        _avg: { value: true },
        _min: { value: true },
        _max: { value: true },
      }),
      prisma.sensorReading.findFirst({
        where,
        orderBy: { measuredAt: "desc" },
      }),
    ]);

    return {
      sensorType,
      count: aggregate._count._all,
      average: aggregate._avg.value,
      minimum: aggregate._min.value,
      maximum: aggregate._max.value,
      latest,
    };
  }

  getLatestBySensorType(sensorType: SensorType, userId: string) {
    return prisma.sensorReading.findFirst({
      where: { sensorType, userId },
      orderBy: { measuredAt: "desc" },
    });
  }
}
