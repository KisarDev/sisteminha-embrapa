"use client";

import { useEffect, useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { PageLoading } from "@/src/components/ui/Loading";
import { api } from "@/src/lib/api";
import { AuthGuard } from "@/src/components/auth/AuthGuard";

type SchedulerStatus = {
  enabled: boolean;
  initialized: boolean;
  paused: boolean;
  timezone: string;
  schedules: Array<{ label: string; expression: string }>;
  lastRunAt: string | null;
  lastRunCount: number;
};

function SchedulerContent() {
  const [status, setStatus] = useState<SchedulerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchStatus = async () => {
    try {
      setStatus(await api<SchedulerStatus>("/api/scheduler"));
    } catch { setError("Erro ao carregar status."); }
    setLoading(false);
  };

  useEffect(() => { fetchStatus(); }, []);

  const handlePause = async () => {
    setMessage("");
    const data = await api<{ message: string; status: SchedulerStatus }>("/api/scheduler/pause", { method: "POST" }).catch(() => { setError("Erro ao pausar."); return null; });
    if (data) { setStatus(data.status); setMessage(data.message); }
  };

  const handleResume = async () => {
    setMessage("");
    const data = await api<{ message: string; status: SchedulerStatus }>("/api/scheduler/resume", { method: "POST" }).catch(() => { setError("Erro ao retomar."); return null; });
    if (data) { setStatus(data.status); setMessage(data.message); }
  };

  const handleManualTrigger = async () => {
    setMessage("");
    const data = await api<{ message: string }>("/api/scheduler", { method: "POST", body: "{}" }).catch(() => { setError("Erro na leitura manual."); return null; });
    if (data) { setMessage(data.message); fetchStatus(); }
  };

  if (loading) return <PageLoading />;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Scheduler" description="Controle das leituras automáticas IoT." />

      {error && <div className="rounded-[var(--radius-md)] bg-[var(--color-danger-soft)] px-4 py-3 text-sm text-[var(--color-danger)] border border-[var(--color-danger)]/20">{error}</div>}
      {message && <div className="rounded-[var(--radius-md)] bg-[var(--color-info-soft)] px-4 py-3 text-sm text-[var(--color-info)] border border-[var(--color-info)]/20">{message}</div>}

      {status && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card padding="sm">
              <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Status</p>
              <p className="mt-1.5 text-lg font-semibold">
                <Badge variant={status.paused ? "warning" : "success"}>{status.paused ? "Pausado" : "Ativo"}</Badge>
              </p>
            </Card>
            <Card padding="sm">
              <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Fuso horário</p>
              <p className="mt-1.5 text-lg font-semibold text-[var(--color-text)]">{status.timezone}</p>
            </Card>
            {status.lastRunAt && (
              <Card padding="sm">
                <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Última execução</p>
                <p className="mt-1.5 text-sm font-medium text-[var(--color-text)]">{new Date(status.lastRunAt).toLocaleString("pt-BR")}</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">{status.lastRunCount} leituras</p>
              </Card>
            )}
          </div>

          <Card>
            <h2 className="text-base font-semibold text-[var(--color-text)]">Agendamentos</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {status.schedules.map((s) => (
                <div key={s.label} className="rounded-[var(--radius-md)] bg-[var(--color-bg)] px-3 py-2 text-center">
                  <p className="text-sm font-medium text-[var(--color-text)]">{s.label}</p>
                  <p className="text-[11px] text-[var(--color-text-tertiary)]">{s.expression}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-wrap gap-3">
            {status.paused ? (
              <Button onClick={handleResume}>Retomar scheduler</Button>
            ) : (
              <Button variant="secondary" onClick={handlePause}>Pausar scheduler</Button>
            )}
            <Button variant="secondary" onClick={handleManualTrigger}>Executar leitura manual</Button>
            <Button variant="ghost" onClick={fetchStatus}>Atualizar status</Button>
          </div>
        </>
      )}
    </main>
  );
}

export default function SchedulerAdminPage() {
  return <AuthGuard><SchedulerContent /></AuthGuard>;
}
