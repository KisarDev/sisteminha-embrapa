import { SensorType } from "@prisma/client";

export type SensorReadingInput = {
  sensorType: SensorType;
  value: number;
  measuredAt: Date;
  source: string;
};

export interface IIotProvider {
  getReading(sensorType: SensorType): Promise<SensorReadingInput>;
}
