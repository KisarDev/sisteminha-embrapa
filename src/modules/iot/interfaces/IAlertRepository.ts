import { Alert, AlertType, SensorType } from "@prisma/client";

export type CreateAlertInput = {
  type: AlertType;
  severity: "INFO" | "WARNING" | "CRITICAL";
  sensorType: SensorType;
  message: string;
  value: number;
  threshold: number;
  sensorReadingId?: string;
};

export interface IAlertRepository {
  create(input: CreateAlertInput): Promise<Alert>;
  findUnresolved(limit?: number): Promise<Alert[]>;
  findBySensorType(sensorType: SensorType, limit?: number): Promise<Alert[]>;
  findById(id: string): Promise<Alert | null>;
  markAsResolved(alertId: string): Promise<Alert>;
}
