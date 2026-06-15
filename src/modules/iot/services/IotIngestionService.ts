import { SensorType } from "@prisma/client";
import { IIotProvider } from "@/src/modules/iot/interfaces/IIotProvider";
import { PrismaSensorReadingRepository } from "@/src/modules/iot/repositories/PrismaSensorReadingRepository";

export const DEFAULT_SENSOR_TYPES: SensorType[] = [
  "CHICKEN_TEMPERATURE",
  "CHICKEN_LUMINOSITY",
  "QUAIL_TEMPERATURE",
  "QUAIL_LUMINOSITY",
  "WORMFARM_SOIL_TEMPERATURE",
  "WORMFARM_SOIL_HUMIDITY",
  "COMPOST_TEMPERATURE",
  "COMPOST_HUMIDITY",
  "PLANTING_SOIL_HUMIDITY",
  "FISH_TANK_PH",
  "FISH_TANK_WATER_LEVEL",
];

export class IotIngestionService {
  constructor(
    private readonly provider: IIotProvider,
    private readonly sensorReadingRepository: PrismaSensorReadingRepository,
  ) {}

  async ingest(sensorTypes = DEFAULT_SENSOR_TYPES) {
    const created = [];
    for (const sensorType of sensorTypes) {
      const reading = await this.provider.getReading(sensorType);
      created.push(await this.sensorReadingRepository.create(reading));
    }
    return created;
  }
}
