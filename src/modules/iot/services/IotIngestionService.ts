import { SensorType } from "@prisma/client";
import { IIotProvider } from "@/src/modules/iot/interfaces/IIotProvider";
import { ISensorReadingRepository } from "@/src/modules/iot/interfaces/ISensorReadingRepository";
import { IAlertService } from "@/src/modules/iot/interfaces/IAlertService";

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
    private readonly sensorReadingRepository: ISensorReadingRepository,
    private readonly alertService: IAlertService,
  ) {}

  async ingest(sensorTypes: SensorType[], userId: string) {
    const created = [];
    for (const sensorType of sensorTypes) {
      const reading = await this.provider.getReading(sensorType);
      const savedReading = await this.sensorReadingRepository.create({ ...reading, userId });
      created.push(savedReading);

      await this.alertService.checkThresholds(savedReading, userId);
    }
    return created;
  }
}
