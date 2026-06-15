import { SensorType } from "@prisma/client";
import { IIotProvider, SensorReadingInput } from "@/src/modules/iot/interfaces/IIotProvider";

const ranges: Record<SensorType, { min: number; max: number }> = {
  CHICKEN_TEMPERATURE: { min: 18, max: 34 },
  CHICKEN_LUMINOSITY: { min: 150, max: 900 },
  QUAIL_TEMPERATURE: { min: 18, max: 32 },
  QUAIL_LUMINOSITY: { min: 120, max: 850 },
  WORMFARM_SOIL_TEMPERATURE: { min: 16, max: 28 },
  WORMFARM_SOIL_HUMIDITY: { min: 45, max: 90 },
  COMPOST_TEMPERATURE: { min: 30, max: 70 },
  COMPOST_HUMIDITY: { min: 35, max: 80 },
  PLANTING_SOIL_HUMIDITY: { min: 20, max: 75 },
  FISH_TANK_PH: { min: 5.5, max: 9 },
  FISH_TANK_WATER_LEVEL: { min: 15, max: 100 },
};

export class SimulationIotProvider implements IIotProvider {
  async getReading(sensorType: SensorType): Promise<SensorReadingInput> {
    const { min, max } = ranges[sensorType];
    return {
      sensorType,
      value: Number((Math.random() * (max - min) + min).toFixed(2)),
      measuredAt: new Date(),
      source: "simulation",
    };
  }
}
