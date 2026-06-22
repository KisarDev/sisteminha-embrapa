"use client";

import { useEffect, useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { AlertBadge } from "@/src/components/dashboard/AlertBadge";
import { Badge } from "@/src/components/ui/Badge";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { PageLoading } from "@/src/components/ui/Loading";
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

function AlertsContent() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resolving, setResolving] = useState<string | null>(null);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await api<{ data: Alert[] }>("/api/alerts");
      setAlerts(data.data ?? []);
    } catch { setError("Erro ao carregar alertas."); }
    setLoading(false);
  };

  useEffect(() => { fetchAlerts(); }, []);

  const handleResolve = async (id: string) => {
    setResolving(id);
    try {
      await api(`/api/alerts/${id}`, { method: "PATCH" });
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao resolver alerta.");
    }
    setResolving(null);
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Alertas" description="Alertas gerados pelos sensores IoT.">
        <Badge variant={alerts.length === 0 ? "success" : "warning"}>
          {alerts.length} ativo{alerts.length !== 1 ? "s" : ""}
        </Badge>
        <Button variant="secondary" size="sm" onClick={fetchAlerts}>
          Atualizar
        </Button>
      </PageHeader>

      {error && (
        <div className="rounded-[var(--radius-md)] bg-[var(--color-danger-soft)] px-4 py-3 text-sm text-[var(--color-danger)] border border-[var(--color-danger)]/20">
          {error}
        </div>
      )}

      {loading ? (
        <PageLoading />
      ) : alerts.length === 0 ? (
        <Card>
          <p className="py-4 text-center text-sm text-[var(--color-text-tertiary)]">
            Nenhum alerta ativo no momento.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Card key={alert.id} padding="sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <AlertBadge severity={alert.severity} />
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {sensorLabels[alert.sensorType] || alert.sensorType}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">{alert.message}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-[var(--color-text-tertiary)]">
                    <span>Valor: {alert.value.toFixed(2)}</span>
                    <span>Limite: {alert.threshold}</span>
                    <span>{new Date(alert.createdAt).toLocaleString("pt-BR")}</span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleResolve(alert.id)}
                  loading={resolving === alert.id}
                >
                  Resolver
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
  return <AuthGuard><AlertsContent /></AuthGuard>;
}
