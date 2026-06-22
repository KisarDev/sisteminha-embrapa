"use client";

import { useEffect, useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Select } from "@/src/components/ui/Select";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { Badge } from "@/src/components/ui/Badge";
import { PageLoading } from "@/src/components/ui/Loading";
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

const SENSOR_OPTIONS = [
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
  CHICKEN_TEMPERATURE: "°C", CHICKEN_LUMINOSITY: "lux",
  QUAIL_TEMPERATURE: "°C", QUAIL_LUMINOSITY: "lux",
  WORMFARM_SOIL_TEMPERATURE: "°C", WORMFARM_SOIL_HUMIDITY: "%",
  COMPOST_TEMPERATURE: "°C", COMPOST_HUMIDITY: "%",
  PLANTING_SOIL_HUMIDITY: "%", FISH_TANK_PH: "pH", FISH_TANK_WATER_LEVEL: "cm",
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
      setReadings(await api<SensorReading[]>(`/api/iot/history?${params}`));
    } catch { /* api() handles 401 */ }
    setLoading(false);
  };

  useEffect(() => { fetchReadings(); }, [sensorType, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await api("/api/iot/refresh", { method: "POST" });
      await fetchReadings();
    } catch { /* */ }
    setRefreshing(false);
  };

  const unit = (st: string) => UNIT_LABELS[st] ?? "";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Leituras dos Sensores" description="Histórico de dados coletados pelos sensores IoT.">
        <Button onClick={handleRefresh} loading={refreshing} size="sm">
          Atualizar dados
        </Button>
      </PageHeader>

      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Sensor</label>
          <Select value={sensorType} onChange={(e) => setSensorType(e.target.value)} className="min-w-[200px]">
            {SENSOR_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Limite</label>
          <Select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="min-w-[100px]">
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </Select>
        </div>
      </div>

      <Card padding="sm">
        {loading ? (
          <PageLoading />
        ) : readings.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12">
            <p className="text-sm text-[var(--color-text-tertiary)]">Nenhuma leitura encontrada.</p>
            <Button variant="secondary" size="sm" onClick={handleRefresh}>
              Gerar leituras simuladas
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left">
                  <th className="pb-3 pr-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Data</th>
                  <th className="pb-3 pr-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Sensor</th>
                  <th className="pb-3 pr-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Valor</th>
                  <th className="pb-3 pr-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Unidade</th>
                  <th className="pb-3 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Origem</th>
                </tr>
              </thead>
              <tbody>
                {readings.map((r) => (
                  <tr key={r.id} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="py-2.5 pr-4 whitespace-nowrap text-[var(--color-text)]">
                      {new Date(r.measuredAt).toLocaleString("pt-BR")}
                    </td>
                    <td className="py-2.5 pr-4 text-[var(--color-text)]">
                      {SENSOR_OPTIONS.find((o) => o.value === r.sensorType)?.label ?? r.sensorType}
                    </td>
                    <td className="py-2.5 pr-4 font-medium tabular-nums text-[var(--color-text)]">{r.value.toFixed(2)}</td>
                    <td className="py-2.5 pr-4 text-[var(--color-text-tertiary)]">{unit(r.sensorType)}</td>
                    <td className="py-2.5 text-[var(--color-text-tertiary)]">
                      <Badge variant={r.source === "real" ? "info" : "neutral"}>{r.source}</Badge>
                    </td>
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
  return <AuthGuard><ReadingsContent /></AuthGuard>;
}
