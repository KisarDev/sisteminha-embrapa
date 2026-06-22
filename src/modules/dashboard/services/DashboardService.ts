import { SensorType } from "@prisma/client";
import {
  ISensorReadingRepository,
} from "@/src/modules/iot/interfaces/ISensorReadingRepository";

const ALL_SENSOR_TYPES: SensorType[] = [
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

const PERIOD_IN_DAYS = {
  "24h": 1,
  "7d": 7,
  "30d": 30,
} as const;

export type HistoricalPeriod = keyof typeof PERIOD_IN_DAYS;

export class DashboardService {
  constructor(private readonly sensorReadingRepository: ISensorReadingRepository) {}

  async getStats(sensorType: SensorType, userId: string, startDate?: Date, endDate?: Date) {
    return this.sensorReadingRepository.getStatsBySensorType(sensorType, userId, startDate, endDate);
  }

  async getHistoricalData(sensorType: SensorType, userId: string, period: HistoricalPeriod) {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - PERIOD_IN_DAYS[period]);

    return this.sensorReadingRepository.findByDateRange(sensorType, userId, startDate, endDate);
  }

  async getSummary(userId: string) {
    const summary = await Promise.all(
      ALL_SENSOR_TYPES.map(async (sensorType) => ({
        sensorType,
        stats: await this.sensorReadingRepository.getStatsBySensorType(sensorType, userId),
      })),
    );

    return {
      generatedAt: new Date(),
      sensors: summary,
    };
  }
}