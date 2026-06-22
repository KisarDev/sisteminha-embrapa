"use client";

import { useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { api } from "@/src/lib/api";
import { AuthGuard } from "@/src/components/auth/AuthGuard";

const SENSOR_TYPES = [
  { value: "CHICKEN_TEMPERATURE", label: "Temperatura das galinhas" },
  { value: "CHICKEN_LUMINOSITY", label: "Luminosidade das galinhas" },
  { value: "QUAIL_TEMPERATURE", label: "Temperatura das codornas" },
  { value: "QUAIL_LUMINOSITY", label: "Luminosidade das codornas" },
  { value: "WORMFARM_SOIL_TEMPERATURE", label: "Temperatura do minhocário" },
  { value: "WORMFARM_SOIL_HUMIDITY", label: "Umidade do minhocário" },
  { value: "COMPOST_TEMPERATURE", label: "Temperatura da composteira" },
  { value: "COMPOST_HUMIDITY", label: "Umidade da composteira" },
  { value: "PLANTING_SOIL_HUMIDITY", label: "Umidade do plantio" },
  { value: "FISH_TANK_PH", label: "pH do tanque" },
  { value: "FISH_TANK_WATER_LEVEL", label: "Nível da água" },
] as const;

function IotContent() {
  const [source, setSource] = useState<"simulation" | "real">("simulation");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [result, setResult] = useState<{ count: number; message: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleIngest = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    const body: Record<string, unknown> = { source };
    if (selectedTypes.length > 0) body.sensorTypes = selectedTypes;

    try {
      const data = await api<{ count: number; message?: string }>("/api/iot/ingest", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setResult({ count: data.count, message: `${data.count} leituras criadas.` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro na ingestão.");
    }
    setLoading(false);
  };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6 pt-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Ingestão IoT</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Disparar leitura manual de sensores.</p>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {result && <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{result.message}</p>}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-medium text-[var(--color-text)]">Configuração</h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--color-text)]">Fonte</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                  <input type="radio" name="source" value="simulation" checked={source === "simulation"} onChange={() => setSource("simulation")} />
                  Simulação
                </label>
                <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                  <input type="radio" name="source" value="real" checked={source === "real"} onChange={() => setSource("real")} />
                  Real
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-[var(--color-text)]">
                Sensores <span className="text-[var(--color-text-muted)]">(deixe vazio para todos)</span>
              </span>
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-[var(--color-border)] p-2">
                {SENSOR_TYPES.map((st) => (
                  <label key={st.value} className="flex items-center gap-2 rounded px-2 py-1 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface)]">
                    <input type="checkbox" checked={selectedTypes.includes(st.value)} onChange={() => toggleType(st.value)} />
                    {st.label}
                  </label>
                ))}
              </div>
            </div>

            <Button onClick={handleIngest} disabled={loading}>
              {loading ? "Ingerindo..." : "Executar ingestão"}
            </Button>
          </div>
        </Card>

        {result && (
          <Card>
            <h2 className="text-lg font-medium text-[var(--color-text)]">Resultado</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">{result.message}</p>
          </Card>
        )}
      </div>
    </main>
  );
}

export default function IotAdminPage() {
  return (
    <AuthGuard>
      <IotContent />
    </AuthGuard>
  );
}
