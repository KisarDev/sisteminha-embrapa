import { AppError } from "@/src/core/errors/AppError";
import {
  ICropCalculator,
  ProductionScalingInput,
  ProductionScalingResult,
} from "@/src/modules/calculator/interfaces/ICropCalculator";

type CropRule = {
  averageCycleDays: number;
  seedsPerProductionUnit: number;
  expectedYieldFactor: number;
};

const cropRules: Record<string, CropRule> = {
  milho: { averageCycleDays: 110, seedsPerProductionUnit: 1.2, expectedYieldFactor: 1.1 },
  feijao: { averageCycleDays: 90, seedsPerProductionUnit: 1.4, expectedYieldFactor: 1.05 },
  abobora: { averageCycleDays: 100, seedsPerProductionUnit: 0.8, expectedYieldFactor: 1.15 },
  tomate: { averageCycleDays: 95, seedsPerProductionUnit: 1.8, expectedYieldFactor: 1.2 },
  tomate_cereja: { averageCycleDays: 85, seedsPerProductionUnit: 2.1, expectedYieldFactor: 1.25 },
  batata: { averageCycleDays: 120, seedsPerProductionUnit: 1.6, expectedYieldFactor: 1.1 },
  alface: { averageCycleDays: 55, seedsPerProductionUnit: 2.6, expectedYieldFactor: 1.2 },
  couve: { averageCycleDays: 75, seedsPerProductionUnit: 1.9, expectedYieldFactor: 1.18 },
};

export class ProductionScalingService implements ICropCalculator {
  calculate(input: ProductionScalingInput): ProductionScalingResult {
    if (input.desiredProduction <= 0 || input.desiredQuantity <= 0 || input.periodInDays <= 0) {
      throw new AppError(400, "Parâmetros inválidos.");
    }

    const cropKey = input.crop.trim().toLowerCase().replaceAll(" ", "_");
    const rule = cropRules[cropKey];
    if (!rule) {
      throw new AppError(400, "Cultura não suportada.");
    }

    const plantingCount = Math.max(1, Math.ceil(input.periodInDays / rule.averageCycleDays));
    const estimatedSeedAmount = Number((input.desiredQuantity * rule.seedsPerProductionUnit).toFixed(2));
    const estimatedHarvest = Number((input.desiredProduction * rule.expectedYieldFactor).toFixed(2));
    const spacing = Math.max(1, Math.floor(input.periodInDays / plantingCount));

    return {
      crop: input.crop,
      plantingCount,
      estimatedSeedAmount,
      estimatedHarvest,
      schedule: Array.from({ length: plantingCount }, (_, index) => {
        const plantingDay = index * spacing;
        return {
          plantingDay,
          expectedHarvestDay: plantingDay + rule.averageCycleDays,
        };
      }),
    };
  }
}
