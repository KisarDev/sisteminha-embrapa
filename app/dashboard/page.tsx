import Link from "next/link";
import { SensorType } from "@prisma/client";
import { AlertBadge } from "@/src/components/dashboard/AlertBadge";
import { SensorCard } from "@/src/components/dashboard/SensorCard";
import { Card } from "@/src/components/ui/Card";
import { container } from "@/src/core/di/container";

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
  const [summary, alerts] = await Promise.all([
    container.dashboardService.getSummary(),
    container.alertService.getActiveAlerts(),
  ]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 p-6">
      <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--color-text)]">Dashboard</h1>
          <p className="text-[var(--color-text-muted)]">Resumo operacional dos sensores e alertas ativos do sisteminha.</p>
        </div>
        <div className="flex gap-4 text-sm">
          <Link className="text-[var(--color-primary)] underline" href="/">
            Início
          </Link>
          <Link className="text-[var(--color-primary)] underline" href="/api/dashboard/summary">
            API resumo
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summary.sensors.map(({ sensorType, stats }) => (
          <SensorCard key={sensorType} title={sensorLabels[sensorType]} stats={stats} />
        ))}
      </section>

      <section>
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-medium text-[var(--color-text)]">Alertas ativos</h2>
              <p className="text-sm text-[var(--color-text-muted)]">Alertas abertos gerados automaticamente nas leituras IoT.</p>
            </div>
            <div className="text-sm font-medium text-[var(--color-text)]">{alerts.length} abertos</div>
          </div>

          <div className="mt-4 space-y-3">
            {alerts.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">Nenhum alerta ativo no momento.</p>
            ) : (
              alerts.slice(0, 10).map((alert) => (
                <div key={alert.id} className="flex flex-col gap-2 rounded-md border border-[var(--color-border)] p-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertBadge severity={alert.severity} />
                      <span className="text-sm font-medium text-[var(--color-text)]">{sensorLabels[alert.sensorType]}</span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--color-text)]">{alert.message}</p>
                  </div>
                  <div className="text-sm text-[var(--color-text-muted)]">
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