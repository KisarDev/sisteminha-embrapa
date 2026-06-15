import { SensorType } from "@prisma/client";
import { prisma } from "@/src/core/database/prisma";
import { SensorReadingInput } from "@/src/modules/iot/interfaces/IIotProvider";

export class PrismaSensorReadingRepository {
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
}
