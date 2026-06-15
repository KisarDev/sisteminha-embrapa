import { SensorType } from "@prisma/client";
import { AppError } from "@/src/core/errors/AppError";
import { IIotProvider, SensorReadingInput } from "@/src/modules/iot/interfaces/IIotProvider";

export class RealIotProvider implements IIotProvider {
  async getReading(sensorType: SensorType): Promise<SensorReadingInput> {
    const baseUrl = process.env.IOT_API_BASE_URL;
    if (!baseUrl) {
      throw new AppError(500, "IOT_API_BASE_URL não configurada.");
    }

    const response = await fetch(`${baseUrl}/readings/${sensorType}`);
    if (!response.ok) {
      throw new AppError(502, "Falha na API IoT externa.");
    }

    const payload = (await response.json()) as { value: number; measuredAt?: string };
    return {
      sensorType,
      value: payload.value,
      measuredAt: payload.measuredAt ? new Date(payload.measuredAt) : new Date(),
      source: "real",
    };
  }
}
