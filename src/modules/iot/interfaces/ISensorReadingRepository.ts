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

export type FindAllOptions = {
  sensorType?: SensorType;
  limit?: number;
  offset?: number;
  startDate?: Date;
  endDate?: Date;
  orderBy?: "asc" | "desc";
};

export interface ISensorReadingRepository {
  create(input: SensorReadingInput & { userId: string }): Promise<SensorReading>;
  findBySensorType(sensorType: SensorType, userId: string, limit?: number): Promise<SensorReading[]>;
  findByDateRange(sensorType: SensorType, userId: string, startDate: Date, endDate: Date): Promise<SensorReading[]>;
  findAll(userId: string, options?: FindAllOptions): Promise<SensorReading[]>;
  getStatsBySensorType(sensorType: SensorType, userId: string, startDate?: Date, endDate?: Date): Promise<SensorReadingStats>;
  getLatestBySensorType(sensorType: SensorType, userId: string): Promise<SensorReading | null>;
}