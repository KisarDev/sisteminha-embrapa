import assert from "node:assert/strict";
import test from "node:test";
import { SimulationIotProvider } from "@/src/modules/iot/services/SimulationIotProvider";

test("SimulationIotProvider returns value in expected range", async () => {
  const provider = new SimulationIotProvider();
  const reading = await provider.getReading("FISH_TANK_PH");

  assert.equal(reading.source, "simulation");
  assert.equal(reading.sensorType, "FISH_TANK_PH");
  assert.ok(reading.value >= 5.5);
  assert.ok(reading.value <= 9);
});
