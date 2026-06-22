"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";

type SchedulerStatus = {
  enabled: boolean;
  initialized: boolean;
  paused: boolean;
  source: string;
  timezone: string;
  schedules: Array<{ label: string; expression: string }>;
  lastRunAt: string | null;
  lastRunSource: string | null;
  lastRunCount: number;
};

export default function SchedulerAdminPage() {
  const router = useRouter();
  const [status, setStatus] = useState<SchedulerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchStatus = async () => {
    const res = await fetch("/api/scheduler");
    if (res.status === 401 || res.status === 403) {
      router.push("/login");
      return;
    }
    if (res.ok) {
      setStatus(await res.json());
    } else {
      setError("Erro ao carregar status do scheduler.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handlePause = async () => {
    setMessage("");
    const res = await fetch("/api/scheduler/pause", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setStatus(data.status);
      setMessage(data.message);
    } else {
      setError("Erro ao pausar scheduler.");
    }
  };

  const handleResume = async () => {
    setMessage("");
    const res = await fetch("/api/scheduler/resume", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setStatus(data.status);
      setMessage(data.message);
    } else {
      setError("Erro ao retomar scheduler.");
    }
  };

  const handleManualTrigger = async () => {
    setMessage("");
    const res = await fetch("/api/scheduler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      setMessage(`${data.message} (${data.count} leituras)`);
      fetchStatus();
    } else {
      setError("Erro ao executar leitura manual.");
    }
  };

  if (loading) {
    return (
      <main className="mx-auto flex w-full max-w-3xl p-6 pt-8">
        <p className="text-[var(--color-text-muted)]">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6 pt-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Gerenciamento do Scheduler</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Controle das leituras automáticas IoT.</p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      {message && (
        <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">{message}</p>
      )}

      {status && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <p className="text-sm text-[var(--color-text-muted)]">Status</p>
              <p className={`mt-1 text-lg font-semibold ${status.paused ? "text-red-600" : "text-green-600"}`}>
                {status.paused ? "Pausado" : "Ativo"}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-[var(--color-text-muted)]">Fonte</p>
              <p className="mt-1 text-lg font-semibold text-[var(--color-text)]">
                {status.source === "simulation" ? "Simulação" : "Real"}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-[var(--color-text-muted)]">Fuso horário</p>
              <p className="mt-1 text-lg font-semibold text-[var(--color-text)]">{status.timezone}</p>
            </Card>
          </div>

          <Card>
            <h2 className="text-lg font-medium text-[var(--color-text)]">Agendamentos</h2>
            <div className="mt-3 space-y-2">
              {status.schedules.map((s) => (
                <div key={s.label} className="flex items-center gap-3 rounded-md bg-[var(--color-surface)] px-3 py-2 text-sm">
                  <span className="font-medium text-[var(--color-text)]">{s.label}</span>
                  <span className="text-[var(--color-text-muted)]">{s.expression}</span>
                </div>
              ))}
            </div>
          </Card>

          {status.lastRunAt && (
            <Card>
              <h2 className="text-lg font-medium text-[var(--color-text)]">Última execução</h2>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-muted)]">Data</dt>
                  <dd className="font-medium text-[var(--color-text)]">
                    {new Date(status.lastRunAt).toLocaleString("pt-BR")}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-muted)]">Fonte</dt>
                  <dd className="font-medium text-[var(--color-text)]">{status.lastRunSource}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-muted)]">Leituras</dt>
                  <dd className="font-medium text-[var(--color-text)]">{status.lastRunCount}</dd>
                </div>
              </dl>
            </Card>
          )}

          <div className="flex flex-wrap gap-3">
            {status.paused ? (
              <Button onClick={handleResume}>Retomar scheduler</Button>
            ) : (
              <Button onClick={handlePause}>Pausar scheduler</Button>
            )}
            <Button onClick={handleManualTrigger}>Executar leitura manual</Button>
            <Button onClick={fetchStatus}>Atualizar status</Button>
          </div>
        </>
      )}
    </main>
  );
}
