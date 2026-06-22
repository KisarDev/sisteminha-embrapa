import { Alert, SensorReading, SensorType } from "@prisma/client";

export interface IAlertService {
  checkThresholds(reading: SensorReading, userId: string): Promise<Alert[] | null>;
  getActiveAlerts(userId: string, sensorType?: SensorType): Promise<Alert[]>;
  resolveAlert(alertId: string): Promise<Alert>;
}
