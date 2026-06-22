"use client";

import { useEffect, useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { AlertBadge } from "@/src/components/dashboard/AlertBadge";
import { api } from "@/src/lib/api";
import { AuthGuard } from "@/src/components/auth/AuthGuard";

const sensorLabels: Record<string, string> = {
  CHICKEN_TEMPERATURE: "Temperatura das galinhas",
  CHICKEN_LUMINOSITY: "Luminosidade das galinhas",
  QUAIL_TEMPERATURE: "Temperatura das codornas",
  QUAIL_LUMINOSITY: "Luminosidade das codornas",
  WORMFARM_SOIL_TEMPERATURE: "Temperatura do minhocário",
  WORMFARM_SOIL_HUMIDITY: "Umidade do minhocário",
  COMPOST_TEMPERATURE: "Temperatura da composteira",
  COMPOST_HUMIDITY: "Umidade da composteira",
  PLANTING_SOIL_HUMIDITY: "Umidade do plantio",
  FISH_TANK_PH: "pH do tanque",
  FISH_TANK_WATER_LEVEL: "Nível da água",
};

type Alert = {
  id: string;
  type: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  sensorType: string;
  message: string;
  value: number;
  threshold: number;
  createdAt: string;
};

type AlertsResponse = {
  count: number;
  data: Alert[];
};

function AlertsContent() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resolving, setResolving] = useState<string | null>(null);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await api<AlertsResponse>("/api/alerts");
      setAlerts(data.data || []);
    } catch {
      setError("Erro ao carregar alertas.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolve = async (id: string) => {
    setResolving(id);
    try {
      await api<{ message: string }>(`/api/alerts/${id}`, { method: "PATCH" });
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao resolver alerta.");
    }
    setResolving(null);
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 pt-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Alertas</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {alerts.length} alerta{alerts.length !== 1 ? "s" : ""} ativo{alerts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={fetchAlerts}
          className="text-sm text-[var(--color-primary)] underline transition hover:opacity-80"
        >
          Atualizar
        </button>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-[var(--color-text-muted)]">Carregando...</p>
      ) : alerts.length === 0 ? (
        <Card>
          <p className="text-sm text-[var(--color-text-muted)]">Nenhum alerta ativo no momento.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id}>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertBadge severity={alert.severity} />
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {sensorLabels[alert.sensorType] || alert.sensorType}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text)]">{alert.message}</p>
                  <div className="flex gap-4 text-xs text-[var(--color-text-muted)]">
                    <span>Valor: {alert.value.toFixed(2)}</span>
                    <span>Limite: {alert.threshold}</span>
                    <span>{new Date(alert.createdAt).toLocaleString("pt-BR")}</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleResolve(alert.id)}
                  disabled={resolving === alert.id}
                  className="shrink-0 !bg-green-700"
                >
                  {resolving === alert.id ? "..." : "Resolver"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

export default function AlertsPage() {
  return (
    <AuthGuard>
      <AlertsContent />
    </AuthGuard>
  );
}
