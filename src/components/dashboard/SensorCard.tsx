import { SensorReadingStats } from "@/src/modules/iot/interfaces/ISensorReadingRepository";
import { Card } from "@/src/components/ui/Card";

type SensorCardProps = {
  title: string;
  stats: SensorReadingStats;
};

function formatValue(value: number | null) {
  if (value === null) {
    return "Sem dados";
  }

  return value.toFixed(2);
}

export function SensorCard({ title, stats }: SensorCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--color-text-muted)]">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--color-text)]">{formatValue(stats.latest?.value ?? null)}</p>
        </div>
        <div className="text-right text-xs text-[var(--color-text-muted)]">
          <p>{stats.count} leituras</p>
          <p>{stats.latest ? new Date(stats.latest.measuredAt).toLocaleString("pt-BR") : "Sem histórico"}</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <dt className="text-[var(--color-text-muted)]">Média</dt>
          <dd className="font-medium text-[var(--color-text)]">{formatValue(stats.average)}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-text-muted)]">Mínima</dt>
          <dd className="font-medium text-[var(--color-text)]">{formatValue(stats.minimum)}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-text-muted)]">Máxima</dt>
          <dd className="font-medium text-[var(--color-text)]">{formatValue(stats.maximum)}</dd>
        </div>
      </dl>
    </Card>
  );
}