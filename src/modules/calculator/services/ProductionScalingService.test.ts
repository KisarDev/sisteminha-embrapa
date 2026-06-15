import assert from "node:assert/strict";
import test from "node:test";
import { ProductionScalingService } from "@/src/modules/calculator/services/ProductionScalingService";

test("ProductionScalingService calculates known crop", () => {
  const service = new ProductionScalingService();
  const result = service.calculate({
    crop: "Milho",
    desiredProduction: 100,
    desiredQuantity: 80,
    periodInDays: 220,
  });

  assert.equal(result.crop, "Milho");
  assert.equal(result.plantingCount, 2);
  assert.equal(result.estimatedSeedAmount, 96);
  assert.equal(result.estimatedHarvest, 110);
  assert.equal(result.schedule.length, 2);
});

test("ProductionScalingService rejects unsupported crop", () => {
  const service = new ProductionScalingService();

  assert.throws(() =>
    service.calculate({
      crop: "Cenoura",
      desiredProduction: 100,
      desiredQuantity: 80,
      periodInDays: 220,
    }),
  );
});
