"use client";

import { useEffect, useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { api } from "@/src/lib/api";
import { AuthGuard } from "@/src/components/auth/AuthGuard";

type SensorReading = {
  id: string;
  sensorType: string;
  value: number;
  unit: string;
  measuredAt: string;
  source: string;
};

const SENSOR_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Todos os sensores" },
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
];

const UNIT_LABELS: Record<string, string> = {
  CHICKEN_TEMPERATURE: "°C",
  CHICKEN_LUMINOSITY: "lux",
  QUAIL_TEMPERATURE: "°C",
  QUAIL_LUMINOSITY: "lux",
  WORMFARM_SOIL_TEMPERATURE: "°C",
  WORMFARM_SOIL_HUMIDITY: "%",
  COMPOST_TEMPERATURE: "°C",
  COMPOST_HUMIDITY: "%",
  PLANTING_SOIL_HUMIDITY: "%",
  FISH_TANK_PH: "pH",
  FISH_TANK_WATER_LEVEL: "cm",
};

function ReadingsContent() {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [sensorType, setSensorType] = useState("");
  const [limit, setLimit] = useState(50);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReadings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (sensorType) params.set("sensorType", sensorType);
      params.set("limit", String(limit));
      const data = await api<SensorReading[]>(`/api/iot/history?${params}`);
      setReadings(data);
    } catch {
      // api() handles 401 redirect
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReadings();
  }, [sensorType, limit]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await api("/api/iot/refresh", { method: "POST" });
      await fetchReadings();
    } catch {
      // api() handles errors
    }
    setRefreshing(false);
  };

  const getUnit = (st: string) => UNIT_LABELS[st] ?? "";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6 pt-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Leituras dos Sensores</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Histórico de dados coletados pelos sensores IoT.</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? "Atualizando..." : "Atualizar dados"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--color-text-muted)]">Sensor</label>
          <select
            value={sensorType}
            onChange={(e) => setSensorType(e.target.value)}
            className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
          >
            {SENSOR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--color-text-muted)]">Limite</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>
      </div>

      <Card>
        {loading ? (
          <p className="text-sm text-[var(--color-text-muted)]">Carregando...</p>
        ) : readings.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">
            Nenhuma leitura encontrada. Clique em &quot;Atualizar dados&quot; para gerar leituras simuladas.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)]">
                  <th className="pb-2 pr-4 font-medium">Data</th>
                  <th className="pb-2 pr-4 font-medium">Sensor</th>
                  <th className="pb-2 pr-4 font-medium">Valor</th>
                  <th className="pb-2 pr-4 font-medium">Unidade</th>
                  <th className="pb-2 font-medium">Origem</th>
                </tr>
              </thead>
              <tbody>
                {readings.map((r) => (
                  <tr key={r.id} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="py-2 pr-4 text-[var(--color-text)] whitespace-nowrap">
                      {new Date(r.measuredAt).toLocaleString("pt-BR")}
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text)]">
                      {SENSOR_OPTIONS.find((o) => o.value === r.sensorType)?.label ?? r.sensorType}
                    </td>
                    <td className="py-2 pr-4 font-medium text-[var(--color-text)]">{r.value}</td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">{getUnit(r.sensorType)}</td>
                    <td className="py-2 text-[var(--color-text-muted)] capitalize">{r.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </main>
  );
}

export default function ReadingsPage() {
  return (
    <AuthGuard>
      <ReadingsContent />
    </AuthGuard>
  );
}
