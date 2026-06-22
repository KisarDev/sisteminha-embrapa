import assert from "node:assert/strict";
import test from "node:test";
import { ProductionScalingService } from "@/src/modules/calculator/services/ProductionScalingService";

test("ProductionScalingService calcula milho-verde na região Sudeste", () => {
  const service = new ProductionScalingService();
  const result = service.calculate({
    cultura: "Milho-verde",
    kgPorSemana: 50,
    regiao: "Sudeste",
  });

  assert.equal(result.cultura, "Milho-verde");
  assert.equal(result.regiao, "Sudeste");
  assert.equal(result.tipoPlantio, "m2");
  assert.ok(result.areaPorSemanaM2 > 0);
  assert.ok(result.plantasPorSemana > 0);
  assert.ok(result.semanasSimultaneas >= 11); // 80-110 dias / 7 = ~11-16 semanas
  assert.ok(result.instrucaoPlantio.includes("Plante"));
});

test("ProductionScalingService calcula tomate na região Norte", () => {
  const service = new ProductionScalingService();
  const result = service.calculate({
    cultura: "Tomate",
    kgPorSemana: 50,
    regiao: "Norte",
  });

  assert.equal(result.cultura, "Tomate");
  assert.equal(result.tipoPlantio, "m2");
  assert.equal(result.producaoDisplay, "5,0 a 10,0 kg/m²");
  assert.ok(result.areaPorSemanaM2 > 0);
  assert.ok(result.plantasPorSemana > 0);
  assert.ok(result.instrucaoPlantio.includes("Plante"));
});

test("ProductionScalingService rejeita cultura inexistente", () => {
  const service = new ProductionScalingService();
  assert.throws(() =>
    service.calculate({
      cultura: "Cenoura",
      kgPorSemana: 50,
      regiao: "Sul",
    }),
  );
});

test("ProductionScalingService rejeita kgPorSemana zero", () => {
  const service = new ProductionScalingService();
  assert.throws(() =>
    service.calculate({
      cultura: "Tomate",
      kgPorSemana: 0,
      regiao: "Nordeste",
    }),
  );
});
