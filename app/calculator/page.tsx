"use client";

import { FormEvent, useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { Select } from "@/src/components/ui/Select";
import { AlertBanner } from "@/src/components/ui/AlertBanner";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { api } from "@/src/lib/api";

const CROPS = [
  { value: "milho", label: "Milho" },
  { value: "feijao", label: "Feijão" },
  { value: "abobora", label: "Abóbora" },
  { value: "tomate", label: "Tomate" },
  { value: "tomate_cereja", label: "Tomate cereja" },
  { value: "batata", label: "Batata" },
  { value: "alface", label: "Alface" },
  { value: "couve", label: "Couve" },
];

type Result = {
  crop: string;
  plantingCount: number;
  estimatedSeedAmount: number;
  estimatedHarvest: number;
  schedule: Array<{ plantingDay: number; expectedHarvestDay: number }>;
};

export default function CalculatorPage() {
  const [crop, setCrop] = useState("milho");
  const [desiredProduction, setDesiredProduction] = useState("");
  const [desiredQuantity, setDesiredQuantity] = useState("");
  const [periodInDays, setPeriodInDays] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setResult(null);
    setLoading(true);
    try {
      setResult(await api<Result>("/api/calculator/production-scaling", {
        method: "POST",
        body: JSON.stringify({
          crop,
          desiredProduction: parseFloat(desiredProduction),
          desiredQuantity: parseFloat(desiredQuantity),
          periodInDays: parseInt(periodInDays, 10),
        }),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao calcular.");
    }
    setLoading(false);
  };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Calculadora de Produção" description="Escalone sua produção com base no ciclo da cultura." />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-base font-semibold text-[var(--color-text)]">Parâmetros</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <AlertBanner variant="error">{error}</AlertBanner>}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="crop" className="text-sm font-medium text-[var(--color-text)]">Cultura</label>
              <Select id="crop" value={crop} onChange={(e) => setCrop(e.target.value)}>
                {CROPS.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="desiredProduction" className="text-sm font-medium text-[var(--color-text)]">Produção desejada (kg)</label>
              <Input id="desiredProduction" type="number" step="any" placeholder="Ex: 100" value={desiredProduction} onChange={(e) => setDesiredProduction(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="desiredQuantity" className="text-sm font-medium text-[var(--color-text)]">Quantidade desejada (unidades)</label>
              <Input id="desiredQuantity" type="number" step="any" placeholder="Ex: 50" value={desiredQuantity} onChange={(e) => setDesiredQuantity(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="periodInDays" className="text-sm font-medium text-[var(--color-text)]">Período (dias)</label>
              <Input id="periodInDays" type="number" placeholder="Ex: 365" value={periodInDays} onChange={(e) => setPeriodInDays(e.target.value)} required />
            </div>
            <Button type="submit" loading={loading}>Calcular</Button>
          </form>
        </Card>

        {result && (
          <div className="flex flex-col gap-3">
            <Card>
              <h3 className="text-base font-semibold text-[var(--color-text)]">
                {CROPS.find((c) => c.value === result.crop)?.label || result.crop}
              </h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                  <dt className="text-[var(--color-text-secondary)]">Plantios necessários</dt>
                  <dd className="font-medium text-[var(--color-text)]">{result.plantingCount}</dd>
                </div>
                <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                  <dt className="text-[var(--color-text-secondary)]">Sementes estimadas</dt>
                  <dd className="font-medium text-[var(--color-text)] tabular-nums">{result.estimatedSeedAmount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-secondary)]">Colheita estimada (kg)</dt>
                  <dd className="font-medium text-[var(--color-text)] tabular-nums">{result.estimatedHarvest}</dd>
                </div>
              </dl>
            </Card>
            <Card>
              <h4 className="text-sm font-semibold text-[var(--color-text)]">Cronograma</h4>
              <div className="mt-3 space-y-1.5">
                {result.schedule.map((s, i) => (
                  <div key={i} className="flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--color-bg)] px-3 py-2 text-sm">
                    <span className="text-[var(--color-text-secondary)]">Plantio dia {s.plantingDay}</span>
                    <span className="font-medium text-[var(--color-text)]">Colheita dia {s.expectedHarvestDay}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
