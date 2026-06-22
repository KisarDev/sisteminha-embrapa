import { SensorReading, SensorType } from "@prisma/client";
import { SensorReadingInput } from "@/src/modules/iot/interfaces/IIotProvider";

export type SensorReadingStats = {
  sensorType: SensorType;
  count: number;
  average: number | null;
  minimum: number | null;
  maximum: number | null;
  latest: SensorReading | null;
};

export interface ISensorReadingRepository {
  create(input: SensorReadingInput & { userId: string }): Promise<SensorReading>;
  findBySensorType(sensorType: SensorType, userId: string, limit?: number): Promise<SensorReading[]>;
  findByDateRange(sensorType: SensorType, userId: string, startDate: Date, endDate: Date): Promise<SensorReading[]>;
  getStatsBySensorType(sensorType: SensorType, userId: string, startDate?: Date, endDate?: Date): Promise<SensorReadingStats>;
  getLatestBySensorType(sensorType: SensorType, userId: string): Promise<SensorReading | null>;
}