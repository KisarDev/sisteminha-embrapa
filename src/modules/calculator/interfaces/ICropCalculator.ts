export type ProductionScalingInput = {
  crop: string;
  desiredProduction: number;
  desiredQuantity: number;
  periodInDays: number;
};

export type ProductionScalingResult = {
  crop: string;
  plantingCount: number;
  estimatedSeedAmount: number;
  estimatedHarvest: number;
  schedule: Array<{ plantingDay: number; expectedHarvestDay: number }>;
};

export interface ICropCalculator {
  calculate(input: ProductionScalingInput): ProductionScalingResult;
}
