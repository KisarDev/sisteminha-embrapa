import { SensorType } from "@prisma/client";
import { AlertBadge } from "@/src/components/dashboard/AlertBadge";
import { SensorCard } from "@/src/components/dashboard/SensorCard";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { container } from "@/src/core/di/container";
import { readSession } from "@/src/core/http/auth";
import { redirect } from "next/navigation";
import { RefreshDashboardButton } from "@/src/components/dashboard/RefreshDashboardButton";

const sensorLabels: Record<SensorType, string> = {
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

export default async function DashboardPage() {
  let session;
  try {
    session = await readSession();
  } catch {
    redirect("/login");
  }

  const [summary, alerts] = await Promise.all([
    container.dashboardService.getSummary(session.sub),
    container.alertService.getActiveAlerts(session.sub),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Dashboard" description="Resumo operacional dos sensores do sisteminha.">
        <RefreshDashboardButton />
      </PageHeader>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summary.sensors.map(({ sensorType, stats }) => (
          <SensorCard key={sensorType} title={sensorLabels[sensorType]} stats={stats} />
        ))}
      </section>

      <section>
        <Card padding="lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-[var(--color-text)]">Alertas ativos</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">Gerados automaticamente nas leituras IoT.</p>
            </div>
            <Badge variant={alerts.length === 0 ? "success" : "warning"}>
              {alerts.length} aberto{alerts.length !== 1 ? "s" : ""}
            </Badge>
          </div>
          <div className="mt-4 space-y-2">
            {alerts.length === 0 ? (
              <p className="py-4 text-center text-sm text-[var(--color-text-tertiary)]">
                Nenhum alerta ativo no momento.
              </p>
            ) : (
              alerts.slice(0, 10).map((alert) => (
                <div
                  key={alert.id}
                  className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <AlertBadge severity={alert.severity} />
                      <span className="text-sm font-medium text-[var(--color-text)]">
                        {sensorLabels[alert.sensorType]}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">{alert.message}</p>
                  </div>
                  <div className="shrink-0 text-xs text-[var(--color-text-tertiary)]">
                    {new Date(alert.createdAt).toLocaleString("pt-BR")}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </main>
  );
}
