import { SensorType } from "@prisma/client";
import { prisma } from "@/src/core/database/prisma";
import { SensorReadingInput } from "@/src/modules/iot/interfaces/IIotProvider";
import { ISensorReadingRepository } from "@/src/modules/iot/interfaces/ISensorReadingRepository";

export class PrismaSensorReadingRepository implements ISensorReadingRepository {
  create(input: SensorReadingInput) {
    return prisma.sensorReading.create({ data: input });
  }

  findBySensorType(sensorType: SensorType, limit = 100) {
    return prisma.sensorReading.findMany({
      where: { sensorType },
      orderBy: { measuredAt: "desc" },
      take: limit,
    });
  }

  findByDateRange(sensorType: SensorType, startDate: Date, endDate: Date) {
    return prisma.sensorReading.findMany({
      where: {
        sensorType,
        measuredAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { measuredAt: "asc" },
    });
  }

  async getStatsBySensorType(sensorType: SensorType, startDate?: Date, endDate?: Date) {
    const where = {
      sensorType,
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

  getLatestBySensorType(sensorType: SensorType) {
    return prisma.sensorReading.findFirst({
      where: { sensorType },
      orderBy: { measuredAt: "desc" },
    });
  }
}
